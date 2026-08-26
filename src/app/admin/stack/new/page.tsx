import { requireAuth } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-parts";
import { StackForm } from "@/components/admin/stack-form";

export default async function NewStackPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="New stack group" backHref="/admin/stack" />
      <StackForm />
    </div>
  );
}
