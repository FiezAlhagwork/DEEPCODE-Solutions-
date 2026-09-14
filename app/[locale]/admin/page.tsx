import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import CategoryStats from "@/features/categories/components/admin/CategoryStats";
import ProjectStats from "@/features/projects/components/admin/ProjectStats";
import RecentProjectsPanel from "@/features/projects/components/admin/RecentProjectsPanel";
import UserStats from "@/features/users/components/admin/UserStats";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminDashboardPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.dashboard");

  // Every tile now reads its count from the API through its own client
  // component — no placeholder data is left on this page.
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("welcome")} description={t("title")} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProjectStats />
        <CategoryStats />
        <UserStats />
      </div>

      <RecentProjectsPanel />
    </div>
  );
}
