"use client";

import { useUser } from "@clerk/nextjs";
import { ChevronRight, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import SignOutButton from "@/components/admin/SignOutButton";
import Avatar from "@/components/kit/Avatar";
import IconButton from "@/components/kit/IconButton";
import Tooltip from "@/components/kit/Tooltip";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { activeSection } from "@/constants/AdminNav";
import { Link, usePathname } from "@/i18n/navigation";
import type { AdminHeaderProps } from "@/types/Admin";

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const t = useTranslations("admin.header");
  const tNav = useTranslations("admin.sidebar");
  const pathname = usePathname();
  const { user } = useUser();

  // The old header printed one constant string on every page. The crumb is
  // derived from the route instead, so it actually says where you are.
  const section = activeSection(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-surface-1/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          aria-label={t("openSidebar")}
          variant="outline"
          onClick={onOpenSidebar}
          className="md:hidden"
        >
          <Menu aria-hidden />
        </IconButton>

        <nav aria-label={t("breadcrumb")} className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="truncate text-ink-faint">{t("title")}</span>
          {section && (
            <>
              <ChevronRight
                aria-hidden
                className="size-3.5 shrink-0 text-ink-faint rtl:rotate-180"
              />
              <span className="truncate font-medium text-ink">
                {tNav(section.key)}
              </span>
            </>
          )}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <LocaleSwitcher className="h-9 rounded-lg border-hairline-strong px-3 py-0 text-xs max-md:w-auto" />
        {/* The real signed-in admin's picture, and the way into their account
            page. `imageUrl` is always set — Clerk serves its own generated
            avatar when nothing has been uploaded — so `Avatar`'s initials
            fallback never comes up here. It stays `undefined` only for the
            moment before Clerk has loaded. */}
        <Tooltip label={tNav("account")} side="start">
          <Link
            href="/admin/account"
            aria-label={tNav("account")}
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Avatar
              name={
                [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                t("profile")
              }
              imageUrl={user?.imageUrl}
            />
          </Link>
        </Tooltip>
        <SignOutButton />
      </div>
    </header>
  );
}
