"use client";

import { useTranslations } from "next-intl";

import { usePendingRequestsCount } from "../../hooks/UseRequests";
import type { PendingRequestsBadgeProps } from "../../types/Requests";

// The count beside "Requests" in the sidebar, or a dot on the icon when the
// rail is collapsed. Nothing at all at zero: a permanent "0" teaches the eye
// to skip the badge. The query polls every minute (see the hook), so a new
// request shows up without a reload.
export default function PendingRequestsBadge({
  collapsed = false,
}: PendingRequestsBadgeProps) {
  const t = useTranslations("admin.sidebar");
  const { data: count } = usePendingRequestsCount();

  if (!count) return null;

  const label = t("pendingRequests", { count });

  if (collapsed) {
    return (
      <span
        aria-label={label}
        role="img"
        className="absolute inset-e-2 top-2 size-2 rounded-full bg-primary ring-2 ring-surface-1"
      />
    );
  }

  return (
    <span
      aria-label={label}
      role="img"
      className="ms-auto rounded-full bg-primary px-1.5 py-0.5 text-[0.6875rem] leading-none font-semibold text-primary-foreground tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
