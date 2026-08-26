import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getPathEntry } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { PathForm } from "@/components/admin/path-form";

export default async function EditPathPage({ params }: PageProps<"/admin/path/[id]">) {
  await requireAuth();
  const { id } = await params;
  const entry = await getPathEntry(id);
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={entry.title} backHref="/admin/path" />
      <PathForm entry={entry} />
    </div>
  );
}
