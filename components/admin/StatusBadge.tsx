import { useTranslations } from "next-intl";

import Badge from "@/components/kit/Badge";
import type { BadgeStatus, StatusBadgeProps } from "@/types/Admin";
import type { BadgeTone } from "@/types/Kit";

const tones: Record<BadgeStatus, BadgeTone> = {
  published: "success",
  draft: "neutral",
  active: "success",
  deactivated: "danger",
};

const labelKeys = {
  published: "statusPublished",
  draft: "statusDraft",
  active: "statusActive",
  deactivated: "statusDeactivated",
} as const;

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("admin.common");

  return (
    <Badge tone={tones[status]} dot>
      {t(labelKeys[status])}
    </Badge>
  );
}
