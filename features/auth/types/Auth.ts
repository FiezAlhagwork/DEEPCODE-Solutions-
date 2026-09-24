import type { Locale } from "@/i18n/routing";
import type { AdminRole, AdminUserStatus } from "@/features/users/types/Users";

/**
 * Every auth view needs the current locale to build its own redirect targets.
 *
 * `returnTo` is where to go once signed in — a locale-less internal path that
 * has already been through `safeReturnTo()`. Absent, the views keep their old
 * behaviour and head for `/admin`, where the gate sends a non-admin home.
 */
export type AuthViewProps = { locale: Locale; returnTo?: string };

/** A 6-box segmented one-time-code input, controlled like a text field. */
export type CodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
};

export type GoogleButtonProps = {
  onContinue: () => void;
  disabled?: boolean;
};

/**
 * `GET /api/auth/me`'s response — the caller's own profile plus role. A
 * discriminated union on `synced`: right after an invited account finishes
 * Clerk sign-up, the local `User` document hasn't been created yet by the
 * async webhook, so the backend reports `synced: false` (still `200`, never
 * an error) instead of a partial/undefined profile.
 */
export type MyProfile =
  | {
      synced: true;
      userId: string;
      _id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      role: AdminRole;
      status: AdminUserStatus;
    }
  | {
      synced: false;
      userId: string;
      role: null;
    };
