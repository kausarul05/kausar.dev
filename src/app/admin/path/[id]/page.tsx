import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { readAdmin, getPathEntry } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { DbError } from "@/components/admin/db-error";
import { PathForm } from "@/components/admin/path-form";

export default async function EditPathPage({ params }: PageProps<"/admin/path/[id]">) {
  await requireAuth();
  const { id } = await params;
  const result = await readAdmin(() => getPathEntry(id));
  if (!result.ok) return <DbError message={result.error} />;
  const entry = result.data;
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={entry.title} backHref="/admin/path" />
      <PathForm entry={entry} />
    </div>
  );
}
