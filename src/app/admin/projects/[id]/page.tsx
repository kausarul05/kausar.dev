import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getProject } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAuth();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={project.title} backHref="/admin/projects" />
      <ProjectForm project={project} />
    </div>
  );
}
