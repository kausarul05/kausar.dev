import Link from "next/link";
import { ArrowUpRight, FolderKanban, Layers, Route, Settings } from "lucide-react";
import { DbError } from "@/components/admin/db-error";
import { requireAuth } from "@/lib/auth";
import { listPathEntries, listProjects, listStackGroups } from "@/lib/content";

type Counts = { projects: number; stack: number; techs: number; path: number };

async function loadCounts(): Promise<{ counts: Counts | null; error?: string }> {
  try {
    const [projects, stack, path] = await Promise.all([
      listProjects(),
      listStackGroups(),
      listPathEntries(),
    ]);
    return {
      counts: {
        projects: projects.length,
        stack: stack.length,
        techs: stack.reduce((total, group) => total + group.items.length, 0),
        path: path.length,
      },
    };
  } catch (error) {
    return { counts: null, error: error instanceof Error ? error.message : String(error) };
  }
}

export default async function AdminHome() {
  await requireAuth();
  const { counts, error } = await loadCounts();

  const cards = [
    {
      href: "/admin/projects",
      icon: FolderKanban,
      label: "Projects",
      value: counts?.projects,
      hint: "Cards in the horizontal Work section",
    },
    {
      href: "/admin/stack",
      icon: Layers,
      label: "Stack groups",
      value: counts?.stack,
      hint: counts ? `${counts.techs} technologies in total` : "Grouped skill lists",
    },
    {
      href: "/admin/path",
      icon: Route,
      label: "Timeline entries",
      value: counts?.path,
      hint: "Roles on the Path section",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      value: undefined,
      hint: "Name, about, contact, socials, marquee",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="display text-4xl text-ink md:text-5xl">Overview</h1>
        <p className="mt-3 max-w-xl text-sm text-mute">
          Everything here writes straight to MongoDB. The public site picks changes up on its
          next request — no rebuild, no redeploy.
        </p>
      </header>

      {error && <DbError message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-white/8 bg-panel/60 p-6 transition-colors hover:border-white/18"
          >
            <div className="flex items-start justify-between">
              <card.icon className="h-5 w-5 text-mute transition-colors group-hover:text-acid" />
              <ArrowUpRight className="h-4 w-4 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid" />
            </div>
            <p className="display mt-6 text-4xl text-ink">
              {card.value ?? <span className="text-dim">—</span>}
            </p>
            <p className="mt-2 text-sm font-medium text-ink">{card.label}</p>
            <p className="mt-1 text-xs text-dim">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
