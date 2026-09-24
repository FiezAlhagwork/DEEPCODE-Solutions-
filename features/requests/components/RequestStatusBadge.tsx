import { useTranslations } from "next-intl";

import Badge from "@/components/kit/Badge";
import type { BadgeTone } from "@/types/Kit";
import type {
  RequestStatus,
  RequestStatusBadgeProps,
} from "../types/Requests";

// Its own badge rather than another case on the admin `StatusBadge`: that one
// speaks for projects and user accounts, and the customer's page has no
// business importing admin chrome to say "we'll call you".
const tones: Record<RequestStatus, BadgeTone> = {
  pending: "warning",
  contacted: "success",
};

export default function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const t = useTranslations("requests.statuses");

  return (
    <Badge tone={tones[status]} dot>
      {t(status)}
    </Badge>
  );
}
