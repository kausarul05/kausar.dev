"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * Admin reads hit MongoDB directly and deliberately don't fall back to seed
 * content the way the public site does — a stale admin panel would be worse
 * than an honest error. This turns that error into something readable, and
 * names the usual cause instead of showing a stack trace.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  const message = error.message ?? "";
  const unreachable = /ECONNREFUSED|ServerSelection|querySrv|timed out|ETIMEDOUT|connect/i.test(
    message,
  );

  return (
    <div className="mx-auto max-w-xl py-16">
      <div className="flex items-start gap-4 rounded-2xl border border-rose/25 bg-rose/8 p-6">
        <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-rose" />
        <div>
          <h1 className="text-lg font-medium text-ink">
            {unreachable ? "Can't reach the database" : "Something went wrong"}
          </h1>

          {unreachable ? (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-mute">
              <p>
                The admin panel talks to MongoDB on every request. The connection didn&apos;t come
                back this time — usually a dropped network, a paused Atlas cluster, or an IP that
                isn&apos;t on the access list.
              </p>
              <p>
                The public site is unaffected: it falls back to its built-in content when the
                database is away.
              </p>
              <p className="text-dim">
                Run <code className="text-mute">npm run check-db</code> to test the connection from
                the terminal.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-mute">
              An unexpected error came back while loading this page.
            </p>
          )}

          {message && (
            <p className="mt-4 rounded-lg border border-white/8 bg-void/60 p-3 font-mono text-xs break-all text-dim">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-ink uppercase transition-colors hover:border-acid/50 hover:text-acid"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
