"use client";

import { useTranslations } from "next-intl";

import NavCountBadge from "@/components/admin/NavCountBadge";
import type { NavBadgeProps } from "@/types/Admin";
import { usePendingRequestsCount } from "../../hooks/UseRequests";

// The sidebar's count of requests still waiting on a call. The query polls
// every minute (see the hook), so a new request shows up without a reload.
export default function PendingRequestsBadge({ collapsed }: NavBadgeProps) {
  const t = useTranslations("admin.sidebar");
  const { data: count } = usePendingRequestsCount();

  return (
    <NavCountBadge
      count={count}
      label={t("pendingRequests", { count: count ?? 0 })}
      collapsed={collapsed}
    />
  );
}
