/**
 * Sets project order from a list of titles:
 *   node scripts/reorder-projects.mjs "LAWAPAN" "Dealnux" ...
 * Handy for fixing order from the terminal; the admin panel does the same thing.
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(resolve(process.cwd(), file), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // optional
  }
}

const titles = process.argv.slice(2);
if (titles.length === 0) {
  console.error('Usage: node scripts/reorder-projects.mjs "Title A" "Title B" …');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
await client.connect();
const projects = client.db(process.env.MONGODB_DB ?? "portfolio").collection("projects");

for (const [order, title] of titles.entries()) {
  const result = await projects.updateOne({ title }, { $set: { order } });
  if (result.matchedCount === 0) console.warn(`  no project titled "${title}"`);
}

const docs = await projects.find().sort({ order: 1 }).toArray();
console.log(docs.map((d) => `${d.order}: ${d.title}`).join("\n"));
await client.close();
