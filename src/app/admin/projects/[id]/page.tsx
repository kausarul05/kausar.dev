import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { readAdmin, getProject } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { DbError } from "@/components/admin/db-error";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAuth();
  const { id } = await params;
  const result = await readAdmin(() => getProject(id));
  if (!result.ok) return <DbError message={result.error} />;
  const project = result.data;
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={project.title} backHref="/admin/projects" />
      <ProjectForm project={project} />
    </div>
  );
}
