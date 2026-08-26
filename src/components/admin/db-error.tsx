import { AlertTriangle } from "lucide-react";

/**
 * Shown when an admin read can't reach MongoDB.
 *
 * This is rendered on the server rather than left to `error.tsx`, because
 * production redacts server error messages before they reach the client
 * boundary — from there every failure looks identical, so the boundary can't
 * tell a dropped database from a genuine bug.
 */
export function DbError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-rose/25 bg-rose/8 p-6">
      <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-rose" />
      <div>
        <h2 className="text-lg font-medium text-ink">Can&apos;t reach the database</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-mute">
          <p>
            The admin panel reads MongoDB on every request, and the connection didn&apos;t come
            back this time — usually a dropped network, a paused Atlas cluster, or an IP that
            isn&apos;t on the access list.
          </p>
          <p>
            Your site is unaffected: it falls back to its built-in content whenever the database
            is away.
          </p>
          <p className="text-dim">
            Run <code className="text-mute">npm run check-db</code> to test the connection from the
            terminal.
          </p>
        </div>
        <p className="mt-4 rounded-lg border border-white/8 bg-void/60 p-3 font-mono text-xs break-all text-dim">
          {message}
        </p>
      </div>
    </div>
  );
}
