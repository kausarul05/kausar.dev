"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import { Field, FormError, Input, SubmitButton } from "@/components/admin/form";

export function LoginForm({ disabled }: { disabled: boolean }) {
  const [state, formAction] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />

      <Field label="Password" name="password" error={state.fields?.password}>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          disabled={disabled}
          placeholder="••••••••••••"
        />
      </Field>

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
