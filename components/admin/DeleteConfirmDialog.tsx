"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import type { DeleteConfirmDialogProps } from "@/types/Admin";

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  loading = false,
}: DeleteConfirmDialogProps) {
  const t = useTranslations("admin.common");

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) onOpenChange(false);
      }}
      closeLabel={t("cancel")}
      title={t("confirmDeleteTitle")}
      description={
        itemName
          ? `${itemName} — ${t("confirmDeleteDescription")}`
          : t("confirmDeleteDescription")
      }
      footer={
        <>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {t("delete")}
          </Button>
        </>
      }
    />
  );
}
