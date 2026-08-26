import { requireAuth } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-parts";
import { PathForm } from "@/components/admin/path-form";

export default async function NewPathPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="New timeline entry" backHref="/admin/path" />
      <PathForm />
    </div>
  );
}
