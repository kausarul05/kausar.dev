"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Field primitives
 * ------------------------------------------------------------------ */

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ label, name, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[11px] tracking-[0.16em] text-mute uppercase">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-dim">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-rose">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-acid/50 focus:bg-white/[0.05]";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} id={props.id ?? props.name} className={cn(controlClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      id={props.id ?? props.name}
      className={cn(controlClass, "min-h-28 resize-y leading-relaxed", props.className)}
    />
  );
}

/** Native colour picker paired with the hex value, kept in sync. */
export function ColorInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        defaultValue={defaultValue}
        aria-label={`${name} colour picker`}
        onChange={(event) => {
          const text = document.getElementById(name) as HTMLInputElement | null;
          if (text) text.value = event.target.value;
        }}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
      />
      <Input name={name} defaultValue={defaultValue} spellCheck={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

export function SubmitButton({
  children = "Save",
  variant = "primary",
  className,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-50",
        variant === "primary" && "bg-acid text-void hover:bg-acid/85",
        variant === "ghost" && "border border-white/12 text-mute hover:border-white/25 hover:text-ink",
        variant === "danger" && "border border-rose/30 text-rose hover:bg-rose/10",
        className,
      )}
    >
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

/** Small icon-sized submit used by the reorder and delete row actions. */
export function IconSubmit({
  label,
  children,
  danger = false,
}: {
  label: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title={label}
      aria-label={label}
      disabled={pending}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-mute transition-colors disabled:opacity-40",
        danger ? "hover:border-rose/40 hover:text-rose" : "hover:border-white/25 hover:text-ink",
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Layout helpers
 * ------------------------------------------------------------------ */

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-rose/25 bg-rose/8 px-4 py-3 text-sm text-rose"
    >
      {message}
    </p>
  );
}

export function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/8 bg-panel/60 p-6 md:p-7">
      <header className="mb-6">
        <h2 className="text-lg font-medium text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-mute">{description}</p>}
      </header>
      {children}
    </section>
  );
}
