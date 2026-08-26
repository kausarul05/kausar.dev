"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject, type ActionState } from "@/app/admin/actions";
import {
  Card,
  ColorInput,
  Field,
  FormError,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/admin/form";
import type { Project } from "@/lib/schemas";

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveProject, {});
  const err = state.fields ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      <FormError message={state.error} />

      <Card title="Identity" description="The headline details shown on the card.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" name="title" error={err.title}>
            <Input name="title" defaultValue={project?.title} placeholder="LAWAPAN" />
          </Field>
          <Field label="Subtitle" name="subtitle" error={err.subtitle}>
            <Input
              name="subtitle"
              defaultValue={project?.subtitle}
              placeholder="Logistics marketplace"
            />
          </Field>
          <Field label="Year" name="year" error={err.year}>
            <Input name="year" defaultValue={project?.year} placeholder="2026" />
          </Field>
          <Field label="Your role" name="role" error={err.role}>
            <Input name="role" defaultValue={project?.role} placeholder="Lead Frontend" />
          </Field>
          <Field
            label="Status"
            name="status"
            hint="Optional badge, e.g. In production"
            error={err.status}
          >
            <Input name="status" defaultValue={project?.status} placeholder="In production" />
          </Field>
        </div>
      </Card>

      <Card title="Copy" description="What the project is and what it does well.">
        <div className="flex flex-col gap-5">
          <Field label="Summary" name="summary" error={err.summary}>
            <Textarea
              name="summary"
              defaultValue={project?.summary}
              placeholder="A freight platform where shippers post loads and transporters bid on them…"
            />
          </Field>
          <Field
            label="Highlights"
            name="highlights"
            hint="One bullet per line."
            error={err.highlights}
          >
            <Textarea
              name="highlights"
              defaultValue={project?.highlights.join("\n")}
              placeholder={"Separate dashboards for shippers and transporters\nLive tracking with Google Maps"}
            />
          </Field>
          <Field
            label="Tags"
            name="tags"
            hint="Comma or line separated. The card shows the first five."
            error={err.tags}
          >
            <Textarea
              name="tags"
              defaultValue={project?.tags.join(", ")}
              className="min-h-20"
              placeholder="Next.js 16, Socket.IO, Leaflet"
            />
          </Field>
        </div>
      </Card>

      <Card title="Artwork" description="The two colours behind the project title on the card.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Accent from" name="accentFrom" error={err.accentFrom}>
            <ColorInput name="accentFrom" defaultValue={project?.accentFrom ?? "#6d4dff"} />
          </Field>
          <Field label="Accent to" name="accentTo" error={err.accentTo}>
            <ColorInput name="accentTo" defaultValue={project?.accentTo ?? "#3ddcff"} />
          </Field>
        </div>
      </Card>

      <Card title="Links" description="Optional. Leave blank if the project isn't public.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Live URL" name="href" error={err.href}>
            <Input name="href" defaultValue={project?.href} placeholder="https://example.com" />
          </Field>
          <Field label="Repository" name="repo" error={err.repo}>
            <Input
              name="repo"
              defaultValue={project?.repo}
              placeholder="https://github.com/you/project"
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
