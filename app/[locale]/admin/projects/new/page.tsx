import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/features/projects/components/admin/ProjectForm";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function NewAdminProjectPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.projects.form");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("addTitle")} />
      <ProjectForm />
    </div>
  );
}
