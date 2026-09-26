"use client";

import { useFormatter, useTranslations } from "next-intl";

import PhoneActions from "@/components/admin/PhoneActions";
import Button from "@/components/kit/Button";
import Modal from "@/components/kit/Modal";
import LeadStatusBadge from "@/components/shared/LeadStatusBadge";
import type { MessageDetailsModalProps } from "../../types/Contact";

const row = "flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4";
const label = "w-28 shrink-0 text-xs text-ink-faint sm:pt-0.5";

// The whole message and how to reach its sender. "Mark contacted" closes this
// dialog and opens the confirmation in its place, as the requests list does.
export default function MessageDetailsModal({
  message,
  onClose,
  onMarkContacted,
}: MessageDetailsModalProps) {
  const t = useTranslations("admin.messages.details");
  const tCommon = useTranslations("admin.common");
  const format = useFormatter();

  return (
    <Modal
      open={message !== null}
      onClose={onClose}
      closeLabel={t("close")}
      title={t("title")}
      className="max-h-full max-w-lg overflow-y-auto"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t("close")}
          </Button>
          {message?.status === "pending" && (
            <Button variant="primary" onClick={() => onMarkContacted(message)}>
              {tCommon("markContacted")}
            </Button>
          )}
        </>
      }
    >
      {message && (
        <dl className="flex flex-col gap-3 text-sm">
          <div className={row}>
            <dt className={label}>{t("sender")}</dt>
            <dd className="text-ink">{message.name}</dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("email")}</dt>
            <dd dir="ltr" className="self-start break-all">
              <a
                href={`mailto:${message.email}`}
                className="rounded text-ink-muted outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {message.email}
              </a>
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("phone")}</dt>
            <dd>
              <PhoneActions phone={message.phone} />
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("date")}</dt>
            <dd className="text-ink-muted">
              {format.dateTime(new Date(message.createdAt), {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("status")}</dt>
            <dd>
              <LeadStatusBadge status={message.status} />
            </dd>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
            <dt className="text-xs text-ink-faint">{t("message")}</dt>
            <dd
              dir="auto"
              className="text-start leading-relaxed break-words whitespace-pre-wrap text-ink"
            >
              {message.message}
            </dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}
