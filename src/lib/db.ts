import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "portfolio";

declare global {
  /* The cache has to survive HMR in dev, so it lives on globalThis. */
  var __mongoClient: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const client = new MongoClient(uri, {
    // Fail fast: the site falls back to seed content rather than hanging on a
    // request when Mongo isn't up.
    serverSelectionTimeoutMS: 2500,
    connectTimeoutMS: 2500,
  });
  return client.connect();
}

/**
 * One client per process, reused across HMR reloads in development so we don't
 * leak connections on every file save.
 */
export function getClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    globalThis.__mongoClient ??= connect();
    return globalThis.__mongoClient;
  }
  return (globalThis.__mongoClient ??= connect());
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(dbName);
}

export const collections = {
  settings: "settings",
  projects: "projects",
  stack: "stackGroups",
  path: "pathEntries",
} as const;
