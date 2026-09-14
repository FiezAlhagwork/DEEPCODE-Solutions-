import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import Button from "@/components/admin/ui/Button";
import ProjectsTable from "@/features/projects/components/admin/ProjectsTable";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminProjectsPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.projects");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button variant="primary" href="/admin/projects/new">
            <Plus aria-hidden />
            {t("addNew")}
          </Button>
        }
      />

      <ProjectsTable />
    </div>
  );
}
