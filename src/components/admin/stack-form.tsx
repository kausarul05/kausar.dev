"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveStackGroup, type ActionState } from "@/app/admin/actions";
import { Card, Field, FormError, Input, SubmitButton, Textarea } from "@/components/admin/form";
import type { StackGroup } from "@/lib/schemas";

export function StackForm({ group }: { group?: StackGroup }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveStackGroup, {});
  const err = state.fields ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {group && <input type="hidden" name="id" value={group.id} />}
      <FormError message={state.error} />

      <Card title="Group" description="One row in the Stack section.">
        <div className="flex flex-col gap-5">
          <Field label="Group name" name="group" error={err.group}>
            <Input name="group" defaultValue={group?.group} placeholder="Styling & Motion" />
          </Field>
          <Field
            label="Items"
            name="items"
            hint="Comma or line separated. Each becomes a chip."
            error={err.items}
          >
            <Textarea
              name="items"
              defaultValue={group?.items.join(", ")}
              placeholder="Tailwind CSS v4, Framer Motion, GSAP"
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>{group ? "Save changes" : "Create group"}</SubmitButton>
        <Link
          href="/admin/stack"
          className="rounded-lg border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
