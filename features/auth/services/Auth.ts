import { api } from "@/lib/Api";
import type { MyProfile } from "../types/Auth";

/**
 * `GET /api/auth/me` — the only gate is being signed in at all; it never
 * returns `403`/`404`, so callers don't need error-branching to detect "not
 * an admin" (see `MyProfile`'s `synced` flag instead).
 *
 * `token` is passed explicitly rather than relying on `lib/Api.ts`'s
 * client-side interceptor, because this also runs from Server Components
 * (`app/[locale]/admin/layout.tsx`) where `window.Clerk` doesn't exist —
 * there, the caller gets the token from `auth().getToken()` and passes it in.
 */
export const getMyProfile = async (token?: string): Promise<MyProfile> => {
  const { data } = await api.get<{ success: boolean; data: MyProfile }>(
    "/auth/me",
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
  return data.data;
};

/**
 * The same call, retried once after a short delay when the profile comes back
 * unsynced. That gap is real rather than theoretical: an invited account's
 * local `User` document is created by an async Clerk webhook *after* sign-up
 * finishes, so the very first check right after the redirect can land before
 * it exists — and a brand-new admin would be read as "not an admin" and sent
 * to the wrong place on their first ever visit.
 *
 * One retry is the deliberate limit: enough for the common case, without
 * turning every single sign-in into a guaranteed multi-second wait.
 */
export const getMyProfileWithRetry = async (token?: string): Promise<MyProfile> => {
  const profile = await getMyProfile(token);
  if (profile.synced) return profile;

  await new Promise((resolve) => setTimeout(resolve, 1500));
  return getMyProfile(token);
};
