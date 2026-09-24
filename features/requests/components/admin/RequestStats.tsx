"use client";

import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";

import { Panel } from "@/components/kit/Panel";
import { Link } from "@/i18n/navigation";
import { usePendingRequestsCount } from "../../hooks/UseRequests";

// The dashboard tile for requests still waiting on a call: the same count as
// the sidebar badge, from the same cached query. Unlike the other tiles it
// links through, since the number is a to-do list rather than a statistic.
export default function RequestStats() {
  const t = useTranslations("admin.dashboard");
  const { data, isPending } = usePendingRequestsCount();

  return (
    <Link
      href="/admin/requests"
      className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <Panel className="flex h-full items-center gap-4 transition-colors hover:border-hairline-strong">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-3 text-primary">
          <Inbox className="size-4.5" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-xl font-semibold tabular-nums text-ink">
            {isPending ? "…" : (data ?? "—")}
          </span>
          <span className="truncate text-xs text-ink-faint">
            {t("stats.pendingRequests")}
          </span>
        </div>
      </Panel>
    </Link>
  );
}
