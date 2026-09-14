"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * The one deliberate exception to "no Clerk prebuilt components" — completing
 * an OAuth redirect is a full-page round trip through Google and back, so
 * *some* landing page is unavoidable. `<AuthenticateWithRedirectCallback>`
 * has no real visual design of its own to reject; it just finishes the
 * handshake and redirects, same as any other piece of infrastructure code.
 */
export default function SsoCallbackView() {
  const t = useTranslations("auth.common");

  return (
    <div className="flex flex-col items-center gap-3 text-sm text-ink-muted">
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <p>{t("finishingSignIn")}</p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
