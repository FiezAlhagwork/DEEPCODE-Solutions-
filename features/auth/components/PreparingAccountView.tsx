"use client";

import { useEffect } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import { useRouter } from "@/i18n/navigation";
import { useMyProfile } from "../hooks/UseAuth";
import type { PreparingAccountViewProps } from "../types/Auth";
import { landingPathForProfile } from "../utils/Auth";

// The stop between finishing sign-up and using the site. A new account's
// record in our database lands a moment after Clerk's, and anything done in
// that gap — ordering a server, the admin gate reading a role — would fail or
// guess. So this waits for `GET /api/auth/me` to say the account is ready,
// then carries on: to `returnTo` when there is one (the product a visitor was
// ordering), otherwise wherever their role belongs. An account that already
// existed passes straight through on the first check.
export default function PreparingAccountView({
  returnTo,
}: PreparingAccountViewProps) {
  const t = useTranslations("auth.preparing");
  const router = useRouter();
  const { profile, ready, timedOut, retry } = useMyProfile();

  useEffect(() => {
    if (ready && profile) {
      router.replace(returnTo ?? landingPathForProfile(profile));
    }
  }, [ready, profile, returnTo, router]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-hairline bg-surface-1 p-6 text-center"
    >
      {timedOut ? (
        <>
          <span className="flex size-12 items-center justify-center rounded-full bg-warning/12 text-warning">
            <TriangleAlert className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-ink">{t("slowTitle")}</h1>
            <p className="text-sm leading-relaxed text-ink-muted">
              {t("slowDescription")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="primary" onClick={retry}>
              {t("retry")}
            </Button>
            <Button variant="ghost" href="/">
              {t("home")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Loader2 className="size-5 animate-spin" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-ink">{t("title")}</h1>
            <p className="text-sm leading-relaxed text-ink-muted">
              {t("description")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
