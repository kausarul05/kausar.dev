import "server-only";
import { cache } from "react";
import { ObjectId, type WithId, type Document } from "mongodb";
import { collections, getDb } from "@/lib/db";
import { seed } from "@/content/seed";
import type { Content, PathEntry, Project, Settings, StackGroup } from "@/lib/schemas";

/* ------------------------------------------------------------------ *
 * Document → view-model mappers
 * ------------------------------------------------------------------ */

function toProject(doc: WithId<Document>): Project {
  const accentFrom = String(doc.accentFrom ?? "#6d4dff");
  const accentTo = String(doc.accentTo ?? "#3ddcff");
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    subtitle: String(doc.subtitle ?? ""),
    year: String(doc.year ?? ""),
    role: String(doc.role ?? ""),
    status: String(doc.status ?? ""),
    summary: String(doc.summary ?? ""),
    highlights: (doc.highlights ?? []) as string[],
    tags: (doc.tags ?? []) as string[],
    accentFrom,
    accentTo,
    accent: [accentFrom, accentTo],
    image: String(doc.image ?? ""),
    href: String(doc.href ?? ""),
    repo: String(doc.repo ?? ""),
  };
}

function toStackGroup(doc: WithId<Document>): StackGroup {
  return {
    id: doc._id.toString(),
    group: String(doc.group ?? ""),
    items: (doc.items ?? []) as string[],
  };
}

function toPathEntry(doc: WithId<Document>): PathEntry {
  return {
    id: doc._id.toString(),
    period: String(doc.period ?? ""),
    title: String(doc.title ?? ""),
    org: String(doc.org ?? ""),
    location: String(doc.location ?? ""),
    points: (doc.points ?? []) as string[],
  };
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

/**
 * Everything the public site renders, in one round trip.
 *
 * If Mongo is unreachable or a collection is empty, that slice falls back to
 * the seed content — an unavailable database degrades the site to its starting
 * state rather than taking it down. `cache` keeps it to one read per request.
 */
export const getContent = cache(async (): Promise<Content> => {
  try {
    const db = await getDb();

    const [settingsDoc, projectDocs, stackDocs, pathDocs] = await Promise.all([
      db.collection(collections.settings).findOne({ _id: "site" as unknown as ObjectId }),
      db.collection(collections.projects).find().sort({ order: 1 }).toArray(),
      db.collection(collections.stack).find().sort({ order: 1 }).toArray(),
      db.collection(collections.path).find().sort({ order: 1 }).toArray(),
    ]);

    const settings = (settingsDoc?.data as Settings | undefined) ?? {
      site: seed.site,
      about: seed.about,
      contact: seed.contact,
      socials: seed.socials,
      marquee: seed.marquee,
    };

    return {
      ...settings,
      projects: projectDocs.length ? projectDocs.map(toProject) : seed.projects,
      stack: stackDocs.length ? stackDocs.map(toStackGroup) : seed.stack,
      path: pathDocs.length ? pathDocs.map(toPathEntry) : seed.path,
    };
  } catch (error) {
    console.warn(
      "[content] MongoDB unavailable, serving seed content:",
      error instanceof Error ? error.message : error,
    );
    return seed;
  }
});

/** Either the data, or a message explaining why it couldn't be read. */
export type AdminRead<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Runs an admin read and reports failure instead of throwing.
 *
 * Admin pages deliberately don't fall back to seed content — a stale editor is
 * worse than an honest error — so each one renders the failure itself. The `ok`
 * tag is what lets TypeScript narrow `data`; keying off the message alone
 * doesn't, since an empty string is falsy too.
 */
export async function readAdmin<T>(read: () => Promise<T>): Promise<AdminRead<T>> {
  try {
    return { ok: true, data: await read() };
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    // Never let a connection string's credentials reach the screen.
    return { ok: false, error: raw.replace(/\/\/[^@]*@/, "//***:***@") };
  }
}

/** Admin reads — these must surface failures instead of silently falling back. */
export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  const docs = await db.collection(collections.projects).find().sort({ order: 1 }).toArray();
  return docs.map(toProject);
}

export async function getProject(id: string): Promise<Project | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(collections.projects).findOne({ _id: new ObjectId(id) });
  return doc ? toProject(doc) : null;
}

export async function listStackGroups(): Promise<StackGroup[]> {
  const db = await getDb();
  const docs = await db.collection(collections.stack).find().sort({ order: 1 }).toArray();
  return docs.map(toStackGroup);
}

export async function getStackGroup(id: string): Promise<StackGroup | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(collections.stack).findOne({ _id: new ObjectId(id) });
  return doc ? toStackGroup(doc) : null;
}

export async function listPathEntries(): Promise<PathEntry[]> {
  const db = await getDb();
  const docs = await db.collection(collections.path).find().sort({ order: 1 }).toArray();
  return docs.map(toPathEntry);
}

export async function getPathEntry(id: string): Promise<PathEntry | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(collections.path).findOne({ _id: new ObjectId(id) });
  return doc ? toPathEntry(doc) : null;
}

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const doc = await db.collection(collections.settings).findOne({ _id: "site" as unknown as ObjectId });
  return (
    (doc?.data as Settings | undefined) ?? {
      site: seed.site,
      about: seed.about,
      contact: seed.contact,
      socials: seed.socials,
      marquee: seed.marquee,
    }
  );
}
