import {
  FolderKanban,
  LayoutDashboard,
  Tags,
  UserRound,
  Users,
} from "lucide-react";

import type { AdminNavItem } from "@/types/Admin";

// Single source of truth for the admin navigation: the sidebar, the mobile
// drawer and the header's breadcrumb all read from here, so adding a section is
// one entry rather than three edits. Root-level `constants/` because two
// separate chrome components consume it — the same reason `constants/Site.ts`
// sits here.

export const adminNavItems: AdminNavItem[] = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "projects", href: "/admin/projects", icon: FolderKanban },
  { key: "categories", href: "/admin/categories", icon: Tags },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "account", href: "/admin/account", icon: UserRound },
];

export function isActiveHref(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

/**
 * The nav entry the current route belongs to, used for the header breadcrumb.
 * `/admin` itself is excluded so the root doesn't render as its own crumb.
 */
export function activeSection(pathname: string) {
  return adminNavItems.find(
    (item) => item.href !== "/admin" && isActiveHref(pathname, item.href),
  );
}
