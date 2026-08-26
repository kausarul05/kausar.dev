import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { listPathEntries } from "@/lib/content";
import { deletePathEntry } from "@/app/admin/actions";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState, PageHeader } from "@/components/admin/page-parts";

export default async function PathPage() {
  await requireAuth();
  const entries = await listPathEntries();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Path"
        description="Your timeline. Keep it newest-first — the rail draws top to bottom."
        action={
          <Link
            href="/admin/path/new"
            className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-void uppercase transition-colors hover:bg-acid/85"
          >
            <Plus className="h-3.5 w-3.5" />
            New entry
          </Link>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No timeline entries yet"
          body="Add the roles you want to show, most recent at the top."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-panel/60 p-4"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] tracking-[0.14em] text-acid uppercase">
                  {entry.period}
                </span>
                <p className="mt-1 font-medium text-ink">{entry.title}</p>
                <p className="text-sm text-mute">
                  {entry.org}
                  {entry.location && ` · ${entry.location}`}
                </p>
                <p className="mt-1 font-mono text-[10px] text-dim">
                  {entry.points.length} bullet{entry.points.length === 1 ? "" : "s"}
                </p>
              </div>

              <Link
                href={`/admin/path/${entry.id}`}
                aria-label={`Edit ${entry.title}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-mute transition-colors hover:border-white/25 hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>

              <RowActions
                collection="path"
                id={entry.id}
                index={index}
                total={entries.length}
                onDelete={deletePathEntry}
                label={entry.title}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
