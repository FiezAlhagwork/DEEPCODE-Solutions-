"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import Badge from "@/components/kit/Badge";
import Button from "@/components/kit/Button";
import Tooltip from "@/components/kit/Tooltip";
import type { AccountSessionCardProps } from "../../types/Account";

// A card rather than a table row, for the same reason the admin grids turn into
// cards below `lg`: three short lines and one action don't need columns, and a
// list of devices reads better stacked at every width.
export default function AccountSessionCard({
  session,
  onRevoke,
  isRevoking,
  now,
}: AccountSessionCardProps) {
  const t = useTranslations("admin.account");
  const format = useFormatter();

  const DeviceIcon = session.isMobile ? Smartphone : Monitor;

  return (
    <li className="flex flex-wrap items-start gap-4 rounded-xl border border-hairline bg-surface-1 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-3 text-ink-muted">
        <DeviceIcon className="size-4.5" aria-hidden />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-ink">{session.device}</p>
          {/* The badge doubles as the reason the revoke button is disabled.
              That matters because the tooltip below is hidden under `md` — a
              touch screen has no hover — so without it a phone would show a
              dead button with no explanation at all. */}
          {session.isCurrent && (
            <Badge tone="brand">{t("currentDevice")}</Badge>
          )}
        </div>

        <p className="text-xs text-ink-faint">{session.location}</p>

        <p className="text-xs text-ink-faint">
          {t("lastActive")}:{" "}
          <time dateTime={session.lastActiveAt.toISOString()}>
            {format.relativeTime(session.lastActiveAt, now)}
          </time>
        </p>
      </div>

      <Tooltip
        label={t("currentDeviceHint")}
        side="start"
        enabled={session.isCurrent}
      >
        <Button
          variant="danger"
          size="sm"
          disabled={session.isCurrent}
          loading={isRevoking}
          onClick={() => onRevoke(session)}
        >
          {t("revoke")}
        </Button>
      </Tooltip>
    </li>
  );
}
