import type { LayoutDashboard } from "lucide-react";
import type { Messages } from "next-intl";
import type { ReactNode } from "react";

import type { ProjectStatus } from "@/features/projects/types/Projects";
import type { AdminRole, AdminUserStatus } from "@/features/users/types/Users";

/**
 * Types for the admin chrome in `components/admin/` — the shell, its navigation
 * and the shared badges. The component library's own types live beside these in
 * `types/AdminUi.ts`.
 */

// --- Navigation ------------------------------------------------------------

/** `key` resolves against the `admin.sidebar` message namespace. */
export type AdminNavItem = {
  key: keyof Messages["admin"]["sidebar"];
  href: string;
  icon: typeof LayoutDashboard;
};

// --- Shell -----------------------------------------------------------------

export type AdminShellProps = {
  children: ReactNode;
};

export type AdminSidebarProps = {
  collapsed: boolean;
};

export type AdminHeaderProps = {
  onOpenSidebar: () => void;
};

export type SignOutButtonProps = {
  /** `"icon"` (default) fits the header's compact actions row; `"button"` renders icon + label for a roomier spot like an account menu. */
  variant?: "icon" | "button";
  /**
   * Where to land after signing out. Defaults to the sign-in page. The
   * invitation flow overrides it with the invitation link itself, ticket and
   * all, so someone who had to sign out first isn't left to find their way
   * back to an email they already opened.
   */
  redirectUrl?: string;
};

export type AdminMobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type AdminNavLinksProps = {
  /** Icon-only rail mode — the label is moved into a tooltip. */
  collapsed?: boolean;
  onNavigate?: () => void;
};

// --- Page furniture --------------------------------------------------------

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  /** Shown inside the confirmation text so it's clear what is being deleted. */
  itemName?: string;
  /** Disables both buttons and shows a spinner on Delete while the mutation is in flight. */
  loading?: boolean;
};

/** The two record states `StatusBadge` can render, from either domain. */
export type BadgeStatus = ProjectStatus | AdminUserStatus;

export type StatusBadgeProps = {
  status: BadgeStatus;
};

export type RoleBadgeProps = {
  role: AdminRole;
};
