import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/features/projects/components/admin/ProjectForm";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleIdRouteProps } from "@/types/Shared";

export default async function EditAdminProjectPage({ params }: LocaleIdRouteProps) {
  const { locale: rawLocale, id } = await params;
  const locale = requireLocale(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.projects.form");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("editTitle")} />
      <ProjectForm projectId={id} />
    </div>
  );
}
