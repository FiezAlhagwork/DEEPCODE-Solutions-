import type { LayoutDashboard } from "lucide-react";
import type { Messages } from "next-intl";
import type { ReactNode } from "react";

import type { ProjectStatus } from "@/features/projects/types/Projects";
import type { AdminRole, AdminUserStatus } from "@/features/users/types/Users";
import type { ListQueryParams } from "./Shared";

/**
 * Types for the admin chrome in `components/admin/` — the shell, its navigation
 * and the shared badges. The component library's own types live beside these in
 * `types/Kit.ts`.
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

// --- Shared admin-grid hooks ------------------------------------------------

/**
 * What a table actually sends: every filter is optional, and the `""` that
 * means "no filter" in the UI is excluded — the API reads an absent key as
 * "no filter", while `?status=` is a validation error.
 */
type ActiveFilters<TFilters> = {
  [K in keyof TFilters]?: Exclude<TFilters[K], "">;
};

/**
 * `hooks/UseListControls.ts`'s return value — the search/paging/filter state
 * every admin grid needs, plus the `params` object to hand straight to its
 * query hook.
 *
 * `setFilter` and `setLimit` reset the page themselves. That is the whole
 * point of the hook rather than a convenience: remembering it at each call
 * site is what left a user on page 3 staring at "no results" for a filter
 * whose matches were all on page 1.
 */
export type ListControls<TFilters extends Record<string, string>> = {
  /** The raw input value; `params.q` is its debounced, trimmed form. */
  search: string;
  setSearch: (value: string) => void;
  filters: TFilters;
  setFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  params: ListQueryParams & ActiveFilters<TFilters>;
  /** True when a search term or any filter is set — drives the empty-state copy. */
  isFiltered: boolean;
  reset: () => void;
};

/**
 * The slice of a TanStack mutation `useConfirmedAction` actually uses. Declared
 * structurally rather than as `UseMutationResult<…>` so the hook states its
 * real requirement instead of inheriting four generic parameters it ignores.
 */
export type ConfirmableMutation = {
  mutate: (id: string, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

/** `hooks/UseConfirmedAction.ts` — a record awaiting confirmation, plus its verbs. */
export type ConfirmedAction<TRecord> = {
  /** The record the dialog is asking about, or `null` when it is closed. */
  target: TRecord | null;
  isPending: boolean;
  ask: (record: TRecord) => void;
  dismiss: () => void;
  confirm: () => void;
};
