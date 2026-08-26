/**
 * Connection smoke test: `node scripts/check-db.mjs`
 * Prints what the app would see, with credentials masked.
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
const mask = (value) => value.replace(/\/\/[^@]*@/, "//***:***@");

console.log(`URI : ${mask(uri)}`);
console.log(`DB  : ${dbName}`);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log("\nConnected.\n");

  const db = client.db(dbName);
  for (const name of ["settings", "projects", "stackGroups", "pathEntries"]) {
    const count = await db.collection(name).countDocuments();
    console.log(`  ${name.padEnd(12)} ${count} document${count === 1 ? "" : "s"}`);
  }
} catch (error) {
  console.error("\nFailed:", mask(error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
} finally {
  await client.close();
}
