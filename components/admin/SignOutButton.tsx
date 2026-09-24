"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import IconButton from "@/components/kit/IconButton";
import Tooltip from "@/components/kit/Tooltip";
import type { SignOutButtonProps } from "@/types/Admin";

// Its own component, not inlined into `AdminHeader` — sign-out belongs
// wherever a signed-in admin can see their session, which today is the
// header but is likely to grow to an account menu or a settings page later.
export default function SignOutButton({
  variant = "icon",
  redirectUrl,
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const locale = useLocale();
  const t = useTranslations("admin.header");
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut({ redirectUrl: redirectUrl ?? `/${locale}/sign-in` });
    } catch {
      // Clerk already surfaces its own console error; re-enable the button
      // rather than leaving it stuck disabled on a failed sign-out.
      setLoading(false);
    }
  }

  if (variant === "menuItem") {
    return (
      <button
        type="button"
        role="menuitem"
        onClick={handleSignOut}
        disabled={loading}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-start text-sm text-ink-muted transition-colors outline-none hover:bg-surface-3 hover:text-ink focus-visible:bg-surface-3 focus-visible:text-ink disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <LogOut className="size-4" aria-hidden />
        )}
        {t("signOut")}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button variant="ghost" onClick={handleSignOut} loading={loading}>
        <LogOut aria-hidden />
        {t("signOut")}
      </Button>
    );
  }

  return (
    // Opens inward: this button is the last thing in the header's actions row,
    // pinned to the far edge, so an outward bubble ran past the viewport and
    // made the whole page scrollable sideways.
    <Tooltip label={t("signOut")} side="start">
      <IconButton
        aria-label={t("signOut")}
        variant="outline"
        onClick={handleSignOut}
        disabled={loading}
      >
        <LogOut aria-hidden />
      </IconButton>
    </Tooltip>
  );
}
