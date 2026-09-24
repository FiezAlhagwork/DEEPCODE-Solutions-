import { Inbox } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/kit/EmptyState";
import { Panel } from "@/components/kit/Panel";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

// A placeholder, on purpose: the requests list for the team is the next round
// of work. It exists now so the customer's "my requests" page has somewhere to
// send an admin, and so that redirect can be exercised end to end. Makes no
// request to the backend.
export default async function AdminRequestsPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.requests");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("title")} description={t("description")} />
      <Panel flush>
        <EmptyState
          icon={Inbox}
          title={t("comingSoonTitle")}
          description={t("comingSoonDescription")}
        />
      </Panel>
    </div>
  );
}
