"use client";

import { useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import SignOutButton from "@/components/admin/SignOutButton";
import Avatar from "@/components/kit/Avatar";
import { Button } from "@/components/ui/button";
import { authPageHref } from "@/features/auth/utils/Auth";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";
import type { AccountEntryProps } from "@/types/Shared";
import AccountMenu from "./AccountMenu";

// The navbar's way into an account. A visitor gets a "sign in" button in the
// spot the old "contact us" call to action used to take; a signed-in person
// gets their avatar — a menu in the desktop bar, a plain row plus sign-out in
// the mobile drawer, which has the room. It always points at the customer
// area; an admin who follows it is sent on to the panel by that page, so the
// navbar never has to know anyone's role.
//
// Until Clerk has loaded, a same-sized empty box holds the spot, so the bar
// doesn't jump sideways when the real control arrives.
export default function AccountEntry({
  variant = "inline",
  onNavigate,
}: AccountEntryProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  // Back to this page after signing in — except from the home page, which is
  // where the sign-in flow ends up anyway.
  const returnTo = pathname === "/" ? undefined : pathname;
  const block = variant === "block";

  if (!isLoaded) {
    return (
      <span
        aria-hidden
        className={cn("block", block ? "h-9 w-full" : "h-9 w-28")}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <Button asChild variant="default" className={cn(block && "w-full")}>
        <Link href={authPageHref("/sign-in", returnTo)} onClick={onNavigate}>
          {/* Mirrored in RTL so the arrow points into the door either way. */}
          <LogIn aria-hidden className="rtl:-scale-x-100" />
          {t("signIn")}
        </Link>
      </Button>
    );
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    t("myRequests");
  const email = user.primaryEmailAddress?.emailAddress;

  if (!block) {
    return <AccountMenu name={name} email={email} imageUrl={user.imageUrl} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/account/requests"
        onClick={onNavigate}
        className="flex h-11 w-full items-center gap-3 rounded-lg border border-border/30 px-3 text-foreground transition-colors hover:bg-secondary/50"
      >
        <Avatar name={name} imageUrl={user.imageUrl} size="sm" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm">{t("myRequests")}</span>
          {email && (
            <span dir="ltr" className="truncate text-start text-xs text-muted-foreground">
              {email}
            </span>
          )}
        </span>
      </Link>
      <SignOutButton variant="button" redirectUrl={`/${locale}`} />
    </div>
  );
}
