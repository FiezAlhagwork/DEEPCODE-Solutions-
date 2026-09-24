import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import Button from "@/components/kit/Button";
import CategoriesTable from "@/features/categories/components/admin/CategoriesTable";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminCategoriesPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.categories");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button variant="primary" href="/admin/categories/new">
            <Plus aria-hidden />
            {t("addNew")}
          </Button>
        }
      />

      <CategoriesTable />
    </div>
  );
}
