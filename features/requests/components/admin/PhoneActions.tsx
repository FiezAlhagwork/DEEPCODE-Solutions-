"use client";

import { Copy, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import IconButton from "@/components/kit/IconButton";
import type { PhoneActionsProps } from "../../types/Requests";
import { telHref, whatsappHref } from "../../utils/Requests";

// The number as a `tel:` link, then WhatsApp and copy — the three ways the
// team actually reaches a customer, next to each other in the table and in
// the details dialog. WhatsApp first among the buttons: in Syria it is how
// most of these calls end up happening.
export default function PhoneActions({ phone }: PhoneActionsProps) {
  const t = useTranslations("admin.requests.phone");

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success(t("copied"));
    } catch {
      // Refused permission, or a non-secure origin with no clipboard API.
      toast.error(t("copyFailed"));
    }
  }

  return (
    <div className="flex items-center gap-1">
      <a
        href={telHref(phone)}
        dir="ltr"
        aria-label={t("call", { phone })}
        className="me-1 rounded text-sm text-ink tabular-nums outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {phone}
      </a>
      <IconButton
        size="sm"
        href={whatsappHref(phone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
      >
        <MessageCircle aria-hidden />
      </IconButton>
      <IconButton size="sm" aria-label={t("copy")} onClick={copy}>
        <Copy aria-hidden />
      </IconButton>
    </div>
  );
}
