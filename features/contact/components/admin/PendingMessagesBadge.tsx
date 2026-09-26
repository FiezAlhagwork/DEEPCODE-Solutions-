"use client";

import { useTranslations } from "next-intl";

import NavCountBadge from "@/components/admin/NavCountBadge";
import type { NavBadgeProps } from "@/types/Admin";
import { usePendingContactCount } from "../../hooks/UseContact";

// The sidebar's count of contact messages still waiting on a reply. Polls
// every minute (see the hook), like the requests badge above it.
export default function PendingMessagesBadge({ collapsed }: NavBadgeProps) {
  const t = useTranslations("admin.sidebar");
  const { data: count } = usePendingContactCount();

  return (
    <NavCountBadge
      count={count}
      label={t("pendingMessages", { count: count ?? 0 })}
      collapsed={collapsed}
    />
  );
}
