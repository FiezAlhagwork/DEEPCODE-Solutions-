"use client";

import { useTranslations } from "next-intl";

import Tooltip from "@/components/kit/Tooltip";
import { adminNavItems, isActiveHref } from "@/constants/AdminNav";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";
import type { AdminNavLinksProps } from "@/types/Admin";

// Shared by the desktop sidebar and the mobile drawer so the two can't drift.
export default function AdminNavLinks({
  collapsed = false,
  onNavigate,
}: AdminNavLinksProps) {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map(({ key, href, icon: Icon, badge: Badge }) => {
        const active = isActiveHref(pathname, href);
        const label = t(key);

        return (
          <Tooltip
            key={key}
            label={label}
            side="end"
            enabled={collapsed}
            className="w-full"
          >
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? label : undefined}
              title={undefined}
              className={cn(
                "relative flex h-10 w-full items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-ink-muted hover:bg-surface-3 hover:text-ink",
              )}
            >
              {/* Active marker on the inline-start edge — flips sides with the
                  document direction on its own. */}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-s-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                />
              )}
              <Icon className="size-4.5 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{label}</span>}
              {Badge && <Badge collapsed={collapsed} />}
            </Link>
          </Tooltip>
        );
      })}
    </nav>
  );
}
