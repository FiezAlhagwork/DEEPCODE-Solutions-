"use client";

import { PanelLeftClose } from "lucide-react";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/kit/Tooltip";
import { setSidebarCollapsed } from "@/hooks/UseSidebarCollapsed";
import { cn } from "@/lib/Utils";
import type { AdminSidebarProps } from "@/types/Admin";
import AdminNavLinks from "./AdminNavLinks";

// Persistent desktop sidebar. Its width comes from `--admin-sidebar-w`, set once
// on the shell wrapper, so the sidebar and the content column can never disagree
// about how wide it is.
export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const t = useTranslations("admin.sidebar");

  return (
    <aside
      className={cn(
        "fixed inset-y-0 inset-s-0 z-40 hidden w-(--admin-sidebar-w) flex-col",
        "border-e border-hairline bg-surface-1 transition-[width] duration-200 ease-out md:flex",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-hairline",
          collapsed ? "justify-center px-0" : "px-4",
        )}
      >
        {collapsed ? (
          <span className="flex size-8 items-center justify-center text-sm font-bold text-primary">
            D
          </span>
        ) : (
          <span className="text-base font-bold tracking-tight text-ink">
            DEEPCODE
          </span>
        )}
      </div>

      <div className={cn("flex-1 py-4", collapsed ? "px-2" : "px-3")}>
        <AdminNavLinks collapsed={collapsed} />
      </div>

      <div className={cn("border-t border-hairline py-3", collapsed ? "px-2" : "px-3")}>
        <Tooltip label={t("expand")} side="end" enabled={collapsed} className="w-full">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!collapsed)}
            aria-label={collapsed ? t("expand") : t("collapse")}
            className={cn(
              "flex h-9 w-full items-center rounded-lg text-sm font-medium",
              "text-ink-faint transition-colors hover:bg-surface-3 hover:text-ink",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
            )}
          >
            <PanelLeftClose
              aria-hidden
              className={cn(
                "size-4.5 shrink-0 transition-transform",
                // The icon points at the edge the panel folds towards, which is
                // mirrored both by direction and by the current state.
                "rtl:rotate-180",
                collapsed && "rotate-180 rtl:rotate-0",
              )}
            />
            {!collapsed && <span className="truncate">{t("collapse")}</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
