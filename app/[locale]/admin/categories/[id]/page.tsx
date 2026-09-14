import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import CategoryForm from "@/features/categories/components/admin/CategoryForm";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleIdRouteProps } from "@/types/Shared";

// No record lookup here, and no `notFound()`: the form fetches the category
// from the client through `useCategory`, and raises the 404 itself when the id
// doesn't resolve. Mirrors `projects/[id]/page.tsx`.
export default async function EditAdminCategoryPage({ params }: LocaleIdRouteProps) {
  const { locale: rawLocale, id } = await params;
  const locale = requireLocale(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.categories.form");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("editTitle")} />
      <CategoryForm categoryId={id} />
    </div>
  );
}
