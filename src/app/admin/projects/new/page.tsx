import { requireAuth } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-parts";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="New project" backHref="/admin/projects" />
      <ProjectForm />
    </div>
  );
}
