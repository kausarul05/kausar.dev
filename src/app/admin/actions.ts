"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import {
  fieldErrors,
  pathEntrySchema,
  projectSchema,
  settingsSchema,
  stackGroupSchema,
} from "@/lib/schemas";

export type ActionState = {
  /** Set only after a successful save that stays on the page. */
  ok?: boolean;
  error?: string;
  fields?: Record<string, string>;
};

/**
 * Server actions are their own entry point — a layout check doesn't protect
 * them, so every mutation re-checks the session before touching the database.
 */
async function guard(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

/** Public site plus every admin list that could show the change. */
function refresh(...paths: string[]): void {
  revalidatePath("/");
  revalidatePath("/opengraph-image");
  for (const path of paths) revalidatePath(path);
}

function toMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/ECONNREFUSED|ServerSelection|connect/i.test(raw)) {
    return "Can't reach MongoDB. Is it running, and is MONGODB_URI correct?";
  }
  return raw;
}

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const stored = process.env.ADMIN_PASSWORD_HASH;

  if (!stored) {
    return { error: "No admin password is set for this deployment." };
  }
  if ((process.env.AUTH_SECRET ?? "").length < 32) {
    return { error: "AUTH_SECRET is missing or too short — sessions can't be signed." };
  }
  if (!password) {
    return { error: "Enter your password.", fields: { password: "Required" } };
  }
  if (!verifyPassword(password, stored)) {
    return { error: "That password doesn't match." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

async function nextOrder(collection: string): Promise<number> {
  const db = await getDb();
  const last = await db.collection(collection).find().sort({ order: -1 }).limit(1).toArray();
  return (last[0]?.order ?? -1) + 1;
}

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const id = String(formData.get("id") ?? "");
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }

  try {
    const db = await getDb();
    if (id) {
      await db
        .collection(collections.projects)
        .updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
    } else {
      await db
        .collection(collections.projects)
        .insertOne({ ...parsed.data, order: await nextOrder(collections.projects) });
    }
  } catch (error) {
    return { error: toMessage(error) };
  }

  refresh("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!ObjectId.isValid(id)) return;

  const db = await getDb();
  await db.collection(collections.projects).deleteOne({ _id: new ObjectId(id) });
  refresh("/admin/projects");
}

/* ------------------------------------------------------------------ *
 * Stack groups
 * ------------------------------------------------------------------ */

export async function saveStackGroup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const id = String(formData.get("id") ?? "");
  const parsed = stackGroupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }
  if (parsed.data.items.length === 0) {
    return { error: "Add at least one item.", fields: { items: "Required" } };
  }

  try {
    const db = await getDb();
    if (id) {
      await db
        .collection(collections.stack)
        .updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
    } else {
      await db
        .collection(collections.stack)
        .insertOne({ ...parsed.data, order: await nextOrder(collections.stack) });
    }
  } catch (error) {
    return { error: toMessage(error) };
  }

  refresh("/admin/stack");
  redirect("/admin/stack");
}

export async function deleteStackGroup(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!ObjectId.isValid(id)) return;

  const db = await getDb();
  await db.collection(collections.stack).deleteOne({ _id: new ObjectId(id) });
  refresh("/admin/stack");
}

/* ------------------------------------------------------------------ *
 * Path entries
 * ------------------------------------------------------------------ */

export async function savePathEntry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const id = String(formData.get("id") ?? "");
  const parsed = pathEntrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }

  try {
    const db = await getDb();
    if (id) {
      await db
        .collection(collections.path)
        .updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
    } else {
      await db
        .collection(collections.path)
        .insertOne({ ...parsed.data, order: await nextOrder(collections.path) });
    }
  } catch (error) {
    return { error: toMessage(error) };
  }

  refresh("/admin/path");
  redirect("/admin/path");
}

export async function deletePathEntry(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!ObjectId.isValid(id)) return;

  const db = await getDb();
  await db.collection(collections.path).deleteOne({ _id: new ObjectId(id) });
  refresh("/admin/path");
}

/* ------------------------------------------------------------------ *
 * Reordering — shared by all three lists
 * ------------------------------------------------------------------ */

const reorderSchema = z.object({
  collection: z.enum(["projects", "stack", "path"]),
  id: z.string(),
  direction: z.enum(["up", "down"]),
});

/**
 * Swaps a row with its neighbour. The list is small enough that rewriting two
 * `order` values beats maintaining a fractional index.
 */
export async function reorder(formData: FormData): Promise<void> {
  await guard();

  const parsed = reorderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !ObjectId.isValid(parsed.data.id)) return;

  const { collection, id, direction } = parsed.data;
  const name = collections[collection];
  const db = await getDb();

  const docs = await db.collection(name).find().sort({ order: 1 }).toArray();
  const index = docs.findIndex((doc) => doc._id.toString() === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= docs.length) return;

  await Promise.all([
    db.collection(name).updateOne({ _id: docs[index]._id }, { $set: { order: swapWith } }),
    db.collection(name).updateOne({ _id: docs[swapWith]._id }, { $set: { order: index } }),
  ]);

  refresh(`/admin/${collection}`);
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  // Stats and socials arrive as parallel arrays of inputs.
  const statLabels = formData.getAll("statLabel").map(String);
  const statValues = formData.getAll("statValue").map(String);
  const statSuffixes = formData.getAll("statSuffix").map(String);

  const solveTitles = formData.getAll("solveTitle").map(String);
  const solveBodies = formData.getAll("solveBody").map(String);

  const socialLabels = formData.getAll("socialLabel").map(String);
  const socialHandles = formData.getAll("socialHandle").map(String);
  const socialHrefs = formData.getAll("socialHref").map(String);

  const candidate = {
    site: {
      name: formData.get("name"),
      first: formData.get("first"),
      last: formData.get("last"),
      role: formData.get("role"),
      roleTail: formData.get("roleTail") ?? "",
      tagline: formData.get("tagline"),
      location: formData.get("location"),
      timeZone: formData.get("timeZone"),
      edition: formData.get("edition"),
      email: formData.get("email"),
      available: formData.get("available") === "on",
      availableLabel: formData.get("availableLabel"),
      url: formData.get("url"),
      photo: formData.get("photo"),
    },
    about: {
      kicker: formData.get("aboutKicker"),
      body: formData.get("aboutBody"),
      note: formData.get("aboutNote"),
      stats: statLabels
        .map((label, i) => ({
          label,
          value: statValues[i] ?? "0",
          suffix: statSuffixes[i] ?? "",
        }))
        .filter((stat) => stat.label.trim()),
      solves: solveTitles
        .map((title, i) => ({ title, body: solveBodies[i] ?? "" }))
        .filter((solve) => solve.title.trim() && solve.body.trim()),
    },
    contact: {
      kicker: formData.get("contactKicker"),
      headline: formData.get("contactHeadline"),
      headlineAccent: formData.get("contactAccent"),
      body: formData.get("contactBody"),
    },
    socials: socialLabels
      .map((label, i) => ({
        label,
        handle: socialHandles[i] ?? "",
        href: socialHrefs[i] ?? "",
      }))
      .filter((social) => social.label.trim() && social.href.trim()),
    marquee: splitLines(formData.get("marquee")),
  };

  const parsed = settingsSchema.safeParse(candidate);
  if (!parsed.success) {
    return { error: "Check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }

  try {
    const db = await getDb();
    await db
      .collection(collections.settings)
      .updateOne(
        { _id: "site" as unknown as ObjectId },
        { $set: { data: parsed.data } },
        { upsert: true },
      );
  } catch (error) {
    return { error: toMessage(error) };
  }

  refresh("/admin/settings");
  return { ok: true };
}
