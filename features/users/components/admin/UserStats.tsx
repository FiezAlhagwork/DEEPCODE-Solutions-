"use client";

import { Users as UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Panel } from "@/components/kit/Panel";
import { useUsers } from "@/features/users/hooks/UseUsers";

// Only the count is needed, so it asks for a single row and reads
// `pagination.total` — the count across every page, unlike `data.length`,
// which would only ever be the size of the page fetched.
//
// The number is active accounts: `GET /api/users` filters `status: "active"`
// and offers no way to ask for anything else.
export default function UserStats() {
  const t = useTranslations("admin.dashboard");
  const { data, isPending } = useUsers({ page: 1, limit: 1 });

  return (
    <Panel className="flex items-center gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-3 text-primary">
        <UsersIcon className="size-4.5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xl font-semibold tabular-nums text-ink">
          {isPending && !data ? "…" : (data?.pagination.total ?? "—")}
        </span>
        <span className="truncate text-xs text-ink-faint">
          {t("stats.users")}
        </span>
      </div>
    </Panel>
  );
}
