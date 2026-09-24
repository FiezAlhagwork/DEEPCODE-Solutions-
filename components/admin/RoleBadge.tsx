import { useTranslations } from "next-intl";

import Badge from "@/components/kit/Badge";
import type { AdminRole } from "@/features/users/types/Users";
import type { RoleBadgeProps } from "@/types/Admin";
import type { BadgeTone } from "@/types/Kit";

// `super_admin` is the only role that can invite, change roles or remove users,
// so it gets the brand tone to stand out in the list.
const tones: Record<AdminRole, BadgeTone> = {
  super_admin: "brand",
  admin: "neutral",
  user: "neutral",
};

const labelKeys = {
  super_admin: "roleSuperAdmin",
  admin: "roleAdmin",
  user: "roleUser",
} as const;

export default function RoleBadge({ role }: RoleBadgeProps) {
  const t = useTranslations("admin.common");

  return <Badge tone={tones[role]}>{t(labelKeys[role])}</Badge>;
}
