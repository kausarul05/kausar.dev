import { requireAuth } from "@/lib/auth";
import { readAdmin, getSettings } from "@/lib/content";
import { PageHeader } from "@/components/admin/page-parts";
import { DbError } from "@/components/admin/db-error";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  await requireAuth();
  const result = await readAdmin(getSettings);
  if (!result.ok) return <DbError message={result.error} />;
  const settings = result.data;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description="Everything on the site that isn't a project, a stack group or a timeline entry."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
