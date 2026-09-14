import type { ListQueryParams } from "@/types/Shared";

export type AdminRole = "super_admin" | "admin" | "user";
export type AdminUserStatus = "active" | "deactivated";

/**
 * Matches the backend's `User` model — the source of truth for roles. Clerk only
 * supplies identity (`clerkId`, email, name, picture); the role lives in the
 * app's own database and is changed through `PATCH /api/users/:id/role`.
 *
 * Note there is no single `name` field: the API returns `firstName`/`lastName`
 * separately, and either can be missing for an invited account that never
 * completed its profile.
 */
export type AdminUser = {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: AdminRole;
  status: AdminUserStatus;
  createdAt: string;
  updatedAt: string;
};

export type UsersQueryParams = ListQueryParams & { role?: AdminRole };

/** `POST /api/users` only ever invites `admin` or `super_admin` — a plain `user` self-signs up. */
export type InviteUserPayload = {
  email: string;
  role: Extract<AdminRole, "admin" | "super_admin">;
};

/**
 * The invite endpoint's response is a Clerk invitation object, not an
 * `AdminUser` — the invited person has no app-database record until they
 * accept and their account is provisioned.
 */
export type InviteUserResult = {
  id: string;
  emailAddress: string;
  publicMetadata: { role: AdminRole };
  status: string;
};

export type ChangeUserRolePayload = { role: AdminRole };

// --- Admin component props -------------------------------------------------

/**
 * Both flags come from the server (`app/[locale]/admin/users/page.tsx` reads
 * `GET /api/auth/me`), not from a client-side guess:
 *
 * - `canManage` — inviting, changing a role and deactivating are all
 *   `super_admin`-only on the backend, while the list itself is open to
 *   `admin` too, so a plain admin would otherwise see three buttons that can
 *   only ever answer `403`.
 * - `viewerId` — the backend has no guard against a super admin demoting or
 *   deactivating themselves, which would lock them out of the panel with no
 *   way back in from the UI. The table withholds both actions on their own row.
 */
export type UsersTableProps = {
  canManage: boolean;
  viewerId?: string;
};

export type UsersPageActionsProps = {
  canManage: boolean;
};

export type InviteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type ChangeRoleModalProps = {
  user: AdminUser | null;
  onClose: () => void;
};
