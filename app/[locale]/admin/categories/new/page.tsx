import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import CategoryForm from "@/features/categories/components/admin/CategoryForm";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function NewAdminCategoryPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.categories.form");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("addTitle")} />
      <CategoryForm />
    </div>
  );
}
