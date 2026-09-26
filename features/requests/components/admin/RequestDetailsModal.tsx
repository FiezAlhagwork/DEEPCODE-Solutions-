"use client";

import { useFormatter, useTranslations } from "next-intl";

import PhoneActions from "@/components/admin/PhoneActions";
import Button from "@/components/kit/Button";
import Modal from "@/components/kit/Modal";
import LeadStatusBadge from "@/components/shared/LeadStatusBadge";
import type { RequestDetailsModalProps } from "../../types/Requests";
import { requesterName } from "../../utils/Requests";

const row = "flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4";
const label = "w-28 shrink-0 text-xs text-ink-faint sm:pt-0.5";

// Everything one request carries, notes in full. "Mark contacted" closes this
// dialog and opens the confirmation in its place rather than stacking a
// second dialog on top of it.
export default function RequestDetailsModal({
  request,
  onClose,
  onMarkContacted,
}: RequestDetailsModalProps) {
  const t = useTranslations("admin.requests.details");
  const tCommon = useTranslations("admin.common");
  const tTypes = useTranslations("requests.types");
  const format = useFormatter();

  return (
    <Modal
      open={request !== null}
      onClose={onClose}
      closeLabel={t("close")}
      title={t("title")}
      className="max-h-full max-w-lg overflow-y-auto"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t("close")}
          </Button>
          {request?.status === "pending" && (
            <Button variant="primary" onClick={() => onMarkContacted(request)}>
              {tCommon("markContacted")}
            </Button>
          )}
        </>
      }
    >
      {request && (
        <dl className="flex flex-col gap-3 text-sm">
          <div className={row}>
            <dt className={label}>{t("customer")}</dt>
            <dd className="text-ink">{requesterName(request.user)}</dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("email")}</dt>
            <dd dir="ltr" className="self-start break-all text-ink-muted">
              {request.user.email}
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("phone")}</dt>
            <dd>
              <PhoneActions phone={request.phone} />
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("product")}</dt>
            <dd className="text-ink">{request.productName}</dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("price")}</dt>
            <dd dir="ltr" className="self-start text-ink">
              € {request.productPrice}
              {request.billingCycle && (
                <span className="ms-1 text-xs text-ink-faint">
                  / {request.billingCycle}
                </span>
              )}
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("type")}</dt>
            <dd className="text-ink">{tTypes(request.requestType)}</dd>
          </div>
          <div className={row}>
            <dt className={label}>{t("date")}</dt>
            <dd className="text-ink-muted">
              {format.dateTime(new Date(request.createdAt), {
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
              <LeadStatusBadge status={request.status} />
            </dd>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
            <dt className="text-xs text-ink-faint">{t("notes")}</dt>
            <dd
              className={
                request.notes
                  ? "leading-relaxed break-words whitespace-pre-wrap text-ink"
                  : "text-ink-faint"
              }
            >
              {request.notes || t("noNotes")}
            </dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}
