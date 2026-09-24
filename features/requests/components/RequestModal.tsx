"use client";

import { useAuth } from "@clerk/nextjs";
import { useIsMutating } from "@tanstack/react-query";
import { Loader2, ServerCog } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import Modal from "@/components/kit/Modal";
import { authPageHref } from "@/features/auth/utils/Auth";
import { Link, usePathname } from "@/i18n/navigation";
import { requestKeys } from "../QueryKeys";
import type { RequestModalProps } from "../types/Requests";
import RequestForm from "./RequestForm";

const FORM_ID = "planRequestForm";

// One modal per product list, not one per card — `Modal` stays mounted while
// closed so it can animate, and twenty cards would mean twenty dialogs in the
// DOM. The list owns which product is open and hands it in here.
//
// A visitor who isn't signed in still gets the modal, with what they picked
// and why they need an account, rather than being thrown straight onto the
// sign-in page: it tells them what the detour is for, and `returnTo` brings
// them back to this same product with the modal open again.
export default function RequestModal({
  product,
  onClose,
  onSubmitted,
}: RequestModalProps) {
  const t = useTranslations("requests.modal");
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const submitting = useIsMutating({ mutationKey: requestKeys.create() }) > 0;

  // Where the sign-in page should send them back to: this page, with the
  // product reopened. Locale-less, because the sign-in page hands it to the
  // locale-aware router.
  const returnTo = product
    ? `${pathname}?order=${encodeURIComponent(product.id)}`
    : undefined;

  function close() {
    if (!submitting) onClose();
  }

  const footer = !isLoaded ? null : isSignedIn ? (
    <>
      <Button variant="ghost" disabled={submitting} onClick={close}>
        {t("cancel")}
      </Button>
      <Button
        type="submit"
        form={FORM_ID}
        variant="primary"
        loading={submitting}
      >
        {submitting ? t("sending") : t("submit")}
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" onClick={close}>
        {t("cancel")}
      </Button>
      <Button variant="primary" href={authPageHref("/sign-in", returnTo)}>
        {t("signIn")}
      </Button>
    </>
  );

  return (
    <Modal
      open={product !== null}
      onClose={close}
      closeLabel={t("close")}
      title={t("title")}
      description={t("description")}
      footer={footer}
      // The tallest dialog in the site: on a short phone screen — or any
      // phone once the keyboard is up — it no longer fits, and `Modal` would
      // clip it top and bottom with nothing to scroll. Scoped to this dialog
      // rather than changed in the kit, where every other dialog fits.
      className="max-h-full max-w-lg overflow-y-auto"
    >
      {product && (
        <>
          {/* What is being requested — read-only, and exactly what gets sent:
              the backend stores this snapshot as-is. */}
          <div className="flex items-center gap-3 rounded-lg border border-hairline bg-surface-1 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ServerCog className="size-4" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-ink">
                {product.name}
              </span>
              <span className="text-xs text-ink-faint">{t("price")}</span>
            </div>
            <span dir="ltr" className="shrink-0 text-sm font-semibold text-ink">
              € {product.base_price}
              {product.billing_cycle && (
                <span className="ms-1 text-xs font-normal text-ink-faint">
                  / {product.billing_cycle}
                </span>
              )}
            </span>
          </div>

          {!isLoaded ? (
            <div className="flex justify-center py-6 text-ink-faint">
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </div>
          ) : isSignedIn ? (
            <RequestForm
              key={product.id}
              product={product}
              formId={FORM_ID}
              onSubmitted={onSubmitted}
            />
          ) : (
            <div className="flex flex-col gap-2 text-sm text-ink-muted">
              <p>{t("signInPrompt")}</p>
              <p className="text-xs">
                {t("noAccount")}{" "}
                <Link
                  href={authPageHref("/sign-up", returnTo)}
                  className="text-primary hover:text-primary/80"
                >
                  {t("signUp")}
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
