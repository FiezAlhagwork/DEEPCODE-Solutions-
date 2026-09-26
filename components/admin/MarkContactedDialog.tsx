"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import Modal from "@/components/kit/Modal";
import type { MarkContactedDialogProps } from "@/types/Admin";

// Asks before a lead leaves the pending queue, because the move is one way:
// the panel never sends a lead back to `pending`, so a mis-click would hide
// someone nobody has called. Shared by the requests and messages lists; each
// builds its own sentence. The dismiss-mid-flight and close-on-success rules
// come from `useConfirmedAction` in the table.
export default function MarkContactedDialog({
  open,
  description,
  isPending,
  onCancel,
  onConfirm,
}: MarkContactedDialogProps) {
  const t = useTranslations("admin.common");

  return (
    <Modal
      open={open}
      onClose={onCancel}
      closeLabel={t("cancel")}
      title={t("confirmContactTitle")}
      description={description}
      footer={
        <>
          <Button variant="ghost" disabled={isPending} onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button variant="primary" loading={isPending} onClick={onConfirm}>
            {t("markContacted")}
          </Button>
        </>
      }
    />
  );
}
