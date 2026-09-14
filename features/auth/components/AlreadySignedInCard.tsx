"use client";

import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import SignOutButton from "@/components/admin/SignOutButton";

/**
 * Shown instead of the invitation form when the visitor already has a session.
 * Clerk runs in single-session mode, so `signUp.create({ strategy: "ticket" })`
 * would be rejected with `session_exists` no matter what — and an invitation is
 * very often opened by someone already signed in as a different account.
 *
 * Signing out returns to this same invitation link, ticket included, so the
 * invite doesn't have to be dug back out of an email that was already opened.
 */
export default function AlreadySignedInCard() {
  const t = useTranslations("auth.acceptInvitation");
  const locale = useLocale();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const ticket = searchParams.get("__clerk_ticket");
  const returnUrl = `/${locale}/accept-invitation${
    ticket ? `?__clerk_ticket=${encodeURIComponent(ticket)}` : ""
  }`;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-hairline bg-surface-1 p-6 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-ink">{t("signedInTitle")}</h1>
        <p className="text-sm leading-relaxed text-ink-muted">
          {t("signedInDescription", {
            email: user?.primaryEmailAddress?.emailAddress ?? "",
          })}
        </p>
      </div>

      <SignOutButton variant="button" redirectUrl={returnUrl} />
    </div>
  );
}
