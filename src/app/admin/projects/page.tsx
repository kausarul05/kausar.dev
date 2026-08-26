import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { listProjects } from "@/lib/content";
import { deleteProject } from "@/app/admin/actions";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState, PageHeader } from "@/components/admin/page-parts";

export default async function ProjectsPage() {
  await requireAuth();
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Projects"
        description="These become the cards in the Work section, in this order."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-void uppercase transition-colors hover:bg-acid/85"
          >
            <Plus className="h-3.5 w-3.5" />
            New project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="Add your first one, or run `npm run seed` to import the six that shipped with the site."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="flex items-center gap-4 rounded-xl border border-white/8 bg-panel/60 p-4"
            >
              <span
                className="h-12 w-12 shrink-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${project.accentFrom}, ${project.accentTo})`,
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium text-ink">{project.title}</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-dim">
                    {project.year}
                  </span>
                  {project.status && (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-mute uppercase">
                      {project.status}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-mute">{project.subtitle}</p>
                <p className="mt-1 truncate font-mono text-[10px] text-dim">
                  {project.tags.join(" · ")}
                </p>
              </div>

              <Link
                href={`/admin/projects/${project.id}`}
                aria-label={`Edit ${project.title}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-mute transition-colors hover:border-white/25 hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>

              <RowActions
                collection="projects"
                id={project.id}
                index={index}
                total={projects.length}
                onDelete={deleteProject}
                label={project.title}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
