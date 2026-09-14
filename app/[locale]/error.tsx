"use client";

import { startTransition } from "react";
import { useTranslations } from "next-intl";

import ErrorScreen from "@/components/shared/ErrorScreen";
import { useRouter } from "@/i18n/navigation";
import type { ErrorBoundaryProps } from "@/types/Shared";

// Deliberately at the `[locale]` level rather than inside `admin/`: an
// `error.tsx` catches throws from the layouts *below* it, never from the
// layout of its own segment. The failure this exists for — the backend not
// answering `admin/layout.tsx`'s role check — is thrown by that layout, so a
// boundary inside `admin/` would never see it.
export default function LocaleError({ error, reset }: ErrorBoundaryProps) {
  const t = useTranslations("common");
  const router = useRouter();

  if (process.env.NODE_ENV === "development") console.error(error);

  // All three parts matter, and each one was needed to make retry actually
  // recover — verified live against a backend that went down and came back:
  // `reset()` alone re-renders the boundary against the RSC payload the client
  // already has, which is the same failure again; `router.refresh()` re-runs
  // the server render; and the transition is what makes `reset()` wait for that
  // refresh instead of re-throwing the stale error before it arrives.
  function handleRetry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <ErrorScreen
      title={t("errorTitle")}
      description={t("errorDescription")}
      retryLabel={t("retry")}
      homeLabel={t("backHome")}
      onRetry={handleRetry}
    />
  );
}
