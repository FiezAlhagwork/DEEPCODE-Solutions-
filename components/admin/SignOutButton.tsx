"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
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
