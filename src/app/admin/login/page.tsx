import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  const hasPassword = Boolean(process.env.ADMIN_PASSWORD_HASH);
  const hasSecret = (process.env.AUTH_SECRET ?? "").length >= 32;
  const configured = hasPassword && hasSecret;

  // Locally the fix is a script; on a host it's the project's env settings.
  const hosted = Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
  const missing = [
    !hasPassword && "ADMIN_PASSWORD_HASH",
    !hasSecret && "AUTH_SECRET",
  ].filter(Boolean) as string[];

  return (
    <div className="flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-acid" />
          <span className="font-mono text-xs tracking-[0.18em] text-mute uppercase">
            Portfolio admin
          </span>
        </div>

        <h1 className="display mb-2 text-4xl text-ink">Sign in</h1>
        {configured ? (
          <p className="mb-8 text-sm text-mute">
            Enter the admin password to manage your content.
          </p>
        ) : (
          <div className="mb-8 space-y-3 rounded-xl border border-rose/25 bg-rose/8 p-4 text-sm leading-relaxed text-mute">
            <p className="text-rose">
              Sign-in isn&apos;t configured on this deployment.
            </p>
            <p>
              Missing:{" "}
              {missing.map((name, i) => (
                <span key={name}>
                  {i > 0 && ", "}
                  <code className="text-ink">{name}</code>
                </span>
              ))}
            </p>
            {hosted ? (
              <p className="text-dim">
                <code className="text-mute">.env.local</code> is git-ignored, so it never reaches
                the host. Add these in your project&apos;s environment variables — along with{" "}
                <code className="text-mute">MONGODB_URI</code> and{" "}
                <code className="text-mute">MONGODB_DB</code> — then redeploy.
              </p>
            ) : (
              <p className="text-dim">
                Run <code className="text-mute">npm run set-password -- &quot;your password&quot;</code>{" "}
                and restart the dev server.
              </p>
            )}
          </div>
        )}

        <LoginForm disabled={!configured} />
      </div>
    </div>
  );
}
