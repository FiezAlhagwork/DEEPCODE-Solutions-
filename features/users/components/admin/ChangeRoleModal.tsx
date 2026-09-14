"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/admin/ui/Button";
import Field from "@/components/admin/ui/Field";
import Modal from "@/components/admin/ui/Modal";
import SelectInput from "@/components/admin/ui/SelectInput";
import { useChangeUserRole } from "@/features/users/hooks/UseUsers";
import type {
  AdminRole,
  ChangeRoleModalProps,
} from "@/features/users/types/Users";
import { fullName } from "@/features/users/utils/Users";

// `PATCH /api/users/:id/role` — `super_admin` only, and it accepts all three
// roles (unlike the invite endpoint, which can't create a plain `user`). The
// table withholds the button that opens this from anyone who isn't allowed,
// and from the viewer's own row.
//
// The caller passes a `key` tied to the selected user, so opening a different
// row remounts this and re-seeds the select from that user's current role. That
// is the alternative to syncing props into state inside an effect, which the
// project's `react-hooks/set-state-in-effect` rule rejects.
export default function ChangeRoleModal({
  user,
  onClose,
}: ChangeRoleModalProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");
  const [role, setRole] = useState(user?.role ?? "admin");
  const changeRole = useChangeUserRole();

  function close() {
    if (!changeRole.isPending) onClose();
  }

  return (
    <Modal
      open={user !== null}
      onClose={close}
      closeLabel={tCommon("cancel")}
      title={t("changeRoleTitle")}
      description={
        user ? `${fullName(user)} — ${t("changeRoleDescription")}` : undefined
      }
      footer={
        <>
          <Button
            variant="ghost"
            disabled={changeRole.isPending}
            onClick={close}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            variant="primary"
            loading={changeRole.isPending}
            // Saving the role the user already has would be a request that
            // changes nothing and still reports success.
            disabled={role === user?.role}
            onClick={() => {
              if (!user) return;
              // Closed from `onSuccess` only, so a refusal (403, or a row that
              // was deactivated elsewhere) leaves the dialog up next to its
              // toast rather than looking like it worked.
              changeRole.mutate(
                { id: user._id, payload: { role } },
                { onSuccess: onClose },
              );
            }}
          >
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <Field htmlFor="userRole" label={t("inviteRole")}>
        <SelectInput
          id="userRole"
          value={role}
          disabled={changeRole.isPending}
          // The option values below are the only ones this can produce.
          onChange={(event) => setRole(event.target.value as AdminRole)}
        >
          <option value="user">{tCommon("roleUser")}</option>
          <option value="admin">{tCommon("roleAdmin")}</option>
          <option value="super_admin">{tCommon("roleSuperAdmin")}</option>
        </SelectInput>
      </Field>
    </Modal>
  );
}
