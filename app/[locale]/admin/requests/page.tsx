import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import RequestsTable from "@/features/requests/components/admin/RequestsTable";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminRequestsPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.requests");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("title")} description={t("description")} />
      <RequestsTable />
    </div>
  );
}
