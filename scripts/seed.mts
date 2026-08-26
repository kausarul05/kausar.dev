/**
 * Copies src/content/seed.ts into MongoDB.
 *
 *   npm run seed            # only fills collections that are empty
 *   npm run seed -- --force # wipes and re-imports everything
 */
import { MongoClient, type ObjectId } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { seed } from "../src/content/seed";

// Read env the same way Next does, without pulling in a dependency.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(resolve(process.cwd(), file), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // Both files are optional.
  }
}

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "portfolio";
const force = process.argv.includes("--force");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });

try {
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected to "${dbName}" at ${uri.replace(/\/\/[^@]*@/, "//***@")}`);

  const plans = [
    {
      name: "projects",
      docs: seed.projects.map(({ id: _id, accent: _accent, ...rest }, order) => ({ ...rest, order })),
    },
    {
      name: "stackGroups",
      docs: seed.stack.map(({ id: _id, ...rest }, order) => ({ ...rest, order })),
    },
    {
      name: "pathEntries",
      docs: seed.path.map(({ id: _id, ...rest }, order) => ({ ...rest, order })),
    },
  ];

  for (const { name, docs } of plans) {
    const existing = await db.collection(name).countDocuments();
    if (existing > 0 && !force) {
      console.log(`  ${name}: ${existing} already there — skipped (--force to replace)`);
      continue;
    }
    if (force) await db.collection(name).deleteMany({});
    await db.collection(name).insertMany(docs);
    console.log(`  ${name}: inserted ${docs.length}`);
  }

  const settingsId = "site" as unknown as ObjectId;
  const hasSettings = await db.collection("settings").countDocuments({ _id: settingsId });

  if (hasSettings && !force) {
    console.log("  settings: already there — skipped (--force to replace)");
  } else {
    await db.collection("settings").updateOne(
      { _id: settingsId },
      {
        $set: {
          data: {
            site: seed.site,
            about: seed.about,
            contact: seed.contact,
            socials: seed.socials,
            marquee: seed.marquee,
          },
        },
      },
      { upsert: true },
    );
    console.log("  settings: written");
  }

  console.log("\nDone. Open /admin to edit.");
} catch (error) {
  console.error("\nSeeding failed:", error instanceof Error ? error.message : error);
  console.error("Is MongoDB running, and is MONGODB_URI correct?");
  process.exitCode = 1;
} finally {
  await client.close();
}
