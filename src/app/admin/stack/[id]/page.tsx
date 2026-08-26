import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getStackGroup } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { StackForm } from "@/components/admin/stack-form";

export default async function EditStackPage({ params }: PageProps<"/admin/stack/[id]">) {
  await requireAuth();
  const { id } = await params;
  const group = await getStackGroup(id);
  if (!group) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={group.group} backHref="/admin/stack" />
      <StackForm group={group} />
    </div>
  );
}
