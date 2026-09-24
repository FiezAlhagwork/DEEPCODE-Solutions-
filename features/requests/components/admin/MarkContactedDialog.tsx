"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import Modal from "@/components/kit/Modal";
import type { MarkContactedDialogProps } from "../../types/Requests";
import { requesterName } from "../../utils/Requests";

// Asks before a request leaves the pending queue, because the move is one way:
// the panel never sends a request back to `pending`, so a mis-click would hide
// a customer nobody has called. The dismiss-mid-flight and close-on-success
// rules come from `useConfirmedAction` in the table.
export default function MarkContactedDialog({
  request,
  isPending,
  onCancel,
  onConfirm,
}: MarkContactedDialogProps) {
  const t = useTranslations("admin.requests");
  const tCommon = useTranslations("admin.common");

  return (
    <Modal
      open={request !== null}
      onClose={onCancel}
      closeLabel={tCommon("cancel")}
      title={t("confirmTitle")}
      description={
        request
          ? t("confirmDescription", {
              name: requesterName(request.user),
              product: request.productName,
            })
          : undefined
      }
      footer={
        <>
          <Button variant="ghost" disabled={isPending} onClick={onCancel}>
            {tCommon("cancel")}
          </Button>
          <Button variant="primary" loading={isPending} onClick={onConfirm}>
            {t("markContacted")}
          </Button>
        </>
      }
    />
  );
}
