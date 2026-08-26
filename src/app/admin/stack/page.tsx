import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { readAdmin, listStackGroups } from "@/lib/content";
import { deleteStackGroup } from "@/app/admin/actions";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState, PageHeader } from "@/components/admin/page-parts";
import { DbError } from "@/components/admin/db-error";

export default async function StackPage() {
  await requireAuth();
  // Narrowed through the result object — destructuring first loses the link
  // between `error` and `data`.
  const result = await readAdmin(listStackGroups);
  if (!result.ok) return <DbError message={result.error} />;
  const groups = result.data;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Stack"
        description="Skill groups shown in the Stack section, in this order."
        action={
          <Link
            href="/admin/stack/new"
            className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-void uppercase transition-colors hover:bg-acid/85"
          >
            <Plus className="h-3.5 w-3.5" />
            New group
          </Link>
        }
      />

      {groups.length === 0 ? (
        <EmptyState
          title="No stack groups yet"
          body="Add a group like Core or Styling, then list the technologies inside it."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {groups.map((group, index) => (
            <li
              key={group.id}
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-panel/60 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-medium text-ink">{group.group}</span>
                  <span className="font-mono text-[10px] text-dim">{group.items.length} items</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-xs text-mute"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/admin/stack/${group.id}`}
                aria-label={`Edit ${group.group}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-mute transition-colors hover:border-white/25 hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>

              <RowActions
                collection="stack"
                id={group.id}
                index={index}
                total={groups.length}
                onDelete={deleteStackGroup}
                label={group.group}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
