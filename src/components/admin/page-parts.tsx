import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
  backHref,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-dim uppercase transition-colors hover:text-acid"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        )}
        <h1 className="display text-4xl text-ink md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-sm text-mute">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 p-12 text-center">
      <p className="text-lg text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-mute">{body}</p>
    </div>
  );
}
