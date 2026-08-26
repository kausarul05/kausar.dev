import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Admin reads and writes the database on every request. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const signedIn = await isAuthenticated();

  // The login page renders bare — there's no shell to show yet.
  if (!signedIn) return <div className="min-h-svh bg-void">{children}</div>;

  return (
    <div className="min-h-svh bg-void">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-acid" />
            <span className="font-mono text-xs tracking-[0.18em] text-ink uppercase">
              Portfolio admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-white/25 hover:text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] text-mute uppercase transition-colors hover:border-rose/40 hover:text-rose"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-8 pb-28 md:px-8 md:pt-12">{children}</main>
    </div>
  );
}
