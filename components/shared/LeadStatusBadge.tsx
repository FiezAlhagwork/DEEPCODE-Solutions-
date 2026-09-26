import { useTranslations } from "next-intl";

import Badge from "@/components/kit/Badge";
import type { BadgeTone } from "@/types/Kit";
import type { LeadStatus, LeadStatusBadgeProps } from "@/types/Shared";

// Where the team is with a lead: a server-plan request or a contact message,
// which share the same two states. Its own badge rather than another case on
// the admin `StatusBadge`: the customer's "my requests" page shows it too, and
// has no business importing admin chrome to say "we'll call you".
const tones: Record<LeadStatus, BadgeTone> = {
  pending: "warning",
  contacted: "success",
};

export default function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const t = useTranslations("common.leadStatus");

  return (
    <Badge tone={tones[status]} dot>
      {t(status)}
    </Badge>
  );
}
