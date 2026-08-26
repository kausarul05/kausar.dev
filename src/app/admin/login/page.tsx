import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  const configured = Boolean(process.env.ADMIN_PASSWORD_HASH);

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
        <p className="mb-8 text-sm text-mute">
          {configured
            ? "Enter the admin password to manage your content."
            : "No password is set yet. Run `npm run set-password` and restart the dev server."}
        </p>

        <LoginForm disabled={!configured} />
      </div>
    </div>
  );
}
