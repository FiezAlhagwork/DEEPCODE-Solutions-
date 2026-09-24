"use client";

import { useTranslations } from "next-intl";

import { accountNavItems } from "@/constants/AccountNav";
import { isActiveHref } from "@/constants/AdminNav";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";

// The section strip across the top of the customer's account area. One item
// today; it is a strip rather than a sidebar because the area sits inside the
// public site's frame, under its navbar, not in a panel of its own.
export default function AccountNav() {
  const t = useTranslations("myAccount");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("navLabel")}
      // `overflow-y-hidden` is the actual fix: with `overflow-x-auto` alone the
      // browser makes the other axis `auto` as well, and the active tab's
      // `-mb-px` (which lets its underline sit on the strip's border) overflows
      // by that one pixel — enough to draw a vertical scrollbar beside the tab.
      className="no-scrollbar flex gap-1 overflow-x-auto overflow-y-hidden border-b border-hairline"
    >
      {accountNavItems.map(({ key, href, icon: Icon }) => {
        const active = isActiveHref(pathname, href);

        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {t(`nav.${key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
