"use client";

import Link from "next/link";
import { useActionState } from "react";
import { savePathEntry, type ActionState } from "@/app/admin/actions";
import { Card, Field, FormError, Input, SubmitButton, Textarea } from "@/components/admin/form";
import type { PathEntry } from "@/lib/schemas";

export function PathForm({ entry }: { entry?: PathEntry }) {
  const [state, formAction] = useActionState<ActionState, FormData>(savePathEntry, {});
  const err = state.fields ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <FormError message={state.error} />

      <Card title="Role" description="One stop on the timeline. Newest first.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Period" name="period" error={err.period}>
            <Input name="period" defaultValue={entry?.period} placeholder="2026 — Present" />
          </Field>
          <Field label="Location" name="location" error={err.location}>
            <Input name="location" defaultValue={entry?.location} placeholder="Dhaka · Remote" />
          </Field>
          <Field label="Title" name="title" error={err.title}>
            <Input name="title" defaultValue={entry?.title} placeholder="Frontend Engineer" />
          </Field>
          <Field label="Organisation" name="org" error={err.org}>
            <Input name="org" defaultValue={entry?.org} placeholder="Independent" />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Points" name="points" hint="One bullet per line." error={err.points}>
            <Textarea
              name="points"
              defaultValue={entry?.points.join("\n")}
              placeholder={"Shipped production platforms across logistics and commerce.\nOwned the full frontend."}
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>{entry ? "Save changes" : "Create entry"}</SubmitButton>
        <Link
          href="/admin/path"
          className="rounded-lg border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
