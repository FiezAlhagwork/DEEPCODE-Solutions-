import type { useUser } from "@clerk/nextjs";

import type { AdminRole, AdminUserStatus } from "@/features/users/types/Users";

/**
 * The signed-in admin's own account page. Unlike every other feature here, its
 * data comes from the Clerk SDK in the browser rather than from `lib/Api.ts` —
 * see `hooks/UseAccount.ts` for why that is deliberate.
 */

/**
 * Clerk's resource types (`UserResource`, `SessionWithActivitiesResource`) are
 * exported from `@clerk/shared`, which is only a transitive dependency of
 * `@clerk/nextjs` — importing from it directly would repeat the `framer-motion`
 * mistake recorded in the decisions log. Deriving them from the hook we
 * actually call keeps the dependency graph honest and pins these types to the
 * exact SDK surface this feature uses.
 */
export type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export type AccountSession = Awaited<
  ReturnType<ClerkUser["getSessions"]>
>[number];

/** The read-only half of the page, resolved on the server from `GET /api/auth/me`. */
export type AccountIdentity = {
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
};

export type AccountProfilePanelProps = {
  identity: AccountIdentity;
};

/**
 * The name form is remounted with a `key` once Clerk has loaded, so it receives
 * its initial values as props instead of copying them out of `useUser()` inside
 * an effect — which `react-hooks/set-state-in-effect` rejects.
 */
export type AccountProfileFormProps = {
  firstName: string;
  lastName: string;
};

export type AccountAvatarFieldProps = {
  name: string;
  imageUrl: string;
  /** False while Clerk is serving its own generated avatar — nothing to remove. */
  hasImage: boolean;
};

/**
 * One session reduced to the strings its card prints. Every field on Clerk's
 * `SessionActivity` is optional, and choosing what to show when they are
 * missing is display logic the card shouldn't re-derive per line.
 */
export type AccountSessionView = {
  id: string;
  device: string;
  location: string;
  lastActiveAt: Date;
  isCurrent: boolean;
  isMobile: boolean;
};

export type AccountSessionCardProps = {
  session: AccountSessionView;
  onRevoke: (session: AccountSessionView) => void;
  /** True while this card's own revoke is in flight. */
  isRevoking: boolean;
  /**
   * The reference point for "last active N minutes ago". Owned by the panel so
   * the whole list ticks off one timer, and passed explicitly because
   * `relativeTime` without it falls back to `Date.now()` and logs an
   * `ENVIRONMENT_FALLBACK` error on every render.
   */
  now: Date;
};
