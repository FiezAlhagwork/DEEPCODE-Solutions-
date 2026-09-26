"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Panel } from "@/components/kit/Panel";
import { Link } from "@/i18n/navigation";
import { usePendingContactCount } from "../../hooks/UseContact";

// The dashboard tile for messages still waiting on a reply: the same count as
// the sidebar badge, from the same cached query, and a link through, like the
// requests tile beside it.
export default function ContactStats() {
  const t = useTranslations("admin.dashboard");
  const { data, isPending } = usePendingContactCount();

  return (
    <Link
      href="/admin/messages"
      className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <Panel className="flex h-full items-center gap-4 transition-colors hover:border-hairline-strong">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-3 text-primary">
          <Mail className="size-4.5" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-xl font-semibold tabular-nums text-ink">
            {isPending ? "…" : (data ?? "—")}
          </span>
          <span className="truncate text-xs text-ink-faint">
            {t("stats.pendingMessages")}
          </span>
        </div>
      </Panel>
    </Link>
  );
}
