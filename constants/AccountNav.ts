import { Inbox } from "lucide-react";

import type { AccountNavItem } from "@/types/Shared";

// The customer's `/account` area — the public-site counterpart of
// `constants/AdminNav.ts`. Data only; the active-link check reuses
// `isActiveHref` from there.

export const accountNavItems: AccountNavItem[] = [
  { key: "requests", href: "/account/requests", icon: Inbox },
];
