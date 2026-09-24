"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import Tooltip from "@/components/kit/Tooltip";
import type { UsersPageActionsProps } from "@/features/users/types/Users";
import InviteUserModal from "./InviteUserModal";

// Client island for the users page header: the invite button owns modal state,
// so the page itself stays a server component.
//
// `canManage` comes from the server — `POST /api/users` is `super_admin`-only
// while the list is open to `admin` too, so an admin would otherwise be handed
// a button that can only ever answer 403.
export default function UsersPageActions({ canManage }: UsersPageActionsProps) {
  const t = useTranslations("admin.users");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <>
      <Tooltip
        label={t("superAdminOnly")}
        side="start"
        enabled={!canManage}
      >
        <Button
          variant="primary"
          disabled={!canManage}
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus aria-hidden />
          {t("invite")}
        </Button>
      </Tooltip>

      {canManage && (
        <InviteUserModal open={isInviteOpen} onOpenChange={setIsInviteOpen} />
      )}
    </>
  );
}
