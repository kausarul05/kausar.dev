import { z } from "zod";

const hex = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour, e.g. #6d4dff");

/** Comma- or newline-separated text in a form becomes a string array. */
export const listFromText = z
  .string()
  .transform((value) =>
    value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean),
  );

/** One line per item — commas are legitimate inside a bullet point. */
export const linesFromText = z
  .string()
  .transform((value) =>
    value
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().min(1, "Subtitle is required"),
  year: z.string().trim().min(1, "Year is required"),
  role: z.string().trim().min(1, "Role is required"),
  status: z.string().trim().default(""),
  summary: z.string().trim().min(1, "Summary is required"),
  highlights: linesFromText,
  tags: listFromText,
  accentFrom: hex,
  accentTo: hex,
  href: z.string().trim().url("Must be a full URL").or(z.literal("")).default(""),
  repo: z.string().trim().url("Must be a full URL").or(z.literal("")).default(""),
});

export const stackGroupSchema = z.object({
  group: z.string().trim().min(1, "Group name is required"),
  items: listFromText,
});

export const pathEntrySchema = z.object({
  period: z.string().trim().min(1, "Period is required"),
  title: z.string().trim().min(1, "Title is required"),
  org: z.string().trim().min(1, "Organisation is required"),
  location: z.string().trim().default(""),
  points: linesFromText,
});

export const statSchema = z.object({
  value: z.coerce.number().int(),
  suffix: z.string().trim().default(""),
  label: z.string().trim().min(1),
});

export const socialSchema = z.object({
  label: z.string().trim().min(1),
  handle: z.string().trim().default(""),
  href: z.string().trim().min(1),
});

export const settingsSchema = z.object({
  site: z.object({
    name: z.string().trim().min(1, "Name is required"),
    first: z.string().trim().min(1, "First name is required"),
    last: z.string().trim().min(1, "Last name is required"),
    role: z.string().trim().min(1, "Role is required"),
    tagline: z.string().trim().min(1, "Tagline is required"),
    location: z.string().trim().min(1),
    timeZone: z.string().trim().min(1),
    edition: z.string().trim().min(1),
    email: z.string().trim().email("Must be a valid email"),
    available: z.boolean(),
    availableLabel: z.string().trim().min(1),
    url: z.string().trim().url("Must be a full URL"),
    photo: z.string().trim().min(1),
  }),
  about: z.object({
    kicker: z.string().trim().min(1),
    body: z.string().trim().min(1, "About text is required"),
    note: z.string().trim().min(1),
    stats: z.array(statSchema).max(4),
  }),
  contact: z.object({
    kicker: z.string().trim().min(1),
    headline: z.string().trim().min(1),
    headlineAccent: z.string().trim().min(1),
    body: z.string().trim().min(1),
  }),
  socials: z.array(socialSchema),
  marquee: z.array(z.string().trim().min(1)),
});

/* ------------------------------------------------------------------ *
 * Types — the shape the site components consume
 * ------------------------------------------------------------------ */

export type ProjectInput = z.infer<typeof projectSchema>;
export type StackGroupInput = z.infer<typeof stackGroupSchema>;
export type PathEntryInput = z.infer<typeof pathEntrySchema>;
export type Settings = z.infer<typeof settingsSchema>;

export type Project = ProjectInput & { id: string; accent: [string, string] };
export type StackGroup = StackGroupInput & { id: string };
export type PathEntry = PathEntryInput & { id: string };

export type Content = Settings & {
  projects: Project[];
  stack: StackGroup[];
  path: PathEntry[];
};

/** Flattens a Zod error into `{ field: message }` for rendering next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}
