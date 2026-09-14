import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import type { MyProfile } from "../types/Auth";

/**
 * Where a signed-in visitor belongs, decided from their real role. This is the
 * single copy of that decision: the admin layout's gate and the sign-in /
 * sign-up pages all call it, so "who counts as an admin" is never written
 * twice and can never drift between them.
 *
 * An unsynced profile (`synced: false`, no local `User` document yet) counts
 * as "not an admin" — the caller has already retried by then, and guessing in
 * the other direction would let an unknown account into the panel.
 */
export const landingPathForProfile = (profile: MyProfile): "/admin" | "/" =>
  profile.synced && (profile.role === "admin" || profile.role === "super_admin")
    ? "/admin"
    : "/";

/**
 * Thrown by `withTimeout` when a Clerk call never settles. Carries its own
 * already-translated message, which `clerkErrorMessage` passes straight
 * through — see the note there.
 */
export class AuthTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthTimeoutError";
  }
}

/**
 * Clerk calls can hang indefinitely rather than reject. The case seen in
 * practice: `signUp.create()` waits on a Cloudflare Turnstile token, and if the
 * widget never produces one, no request is ever sent and the promise stays
 * pending forever — leaving the submit button spinning with nothing to show
 * the user. Racing every awaited Clerk call against a deadline converts that
 * dead end into an ordinary error the existing `catch`/`finally` already handle.
 *
 * Deliberately NOT used on `authenticateWithRedirect()`, whose promise is
 * *meant* never to resolve — it navigates the page away instead.
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMessage: string,
  ms = 30_000,
): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new AuthTimeoutError(timeoutMessage)), ms);
    }),
  ]);

/**
 * Clerk's classic API throws `ClerkAPIResponseError`, carrying `.errors[]`
 * where each item is `{ code, message, longMessage, meta }`. `meta` is an
 * untyped `Record<string, unknown>`, so matching a field name is a runtime
 * check, not something the type system can guarantee.
 *
 * Returns the field-specific message when Clerk attributes the error to
 * `paramName` (e.g. `"email_address"`, `"code"`), so it can be shown inline
 * via `Field`'s `error` prop instead of a generic toast.
 */
export const clerkFieldError = (error: unknown, paramName: string): string | undefined => {
  if (!isClerkAPIResponseError(error)) return undefined;
  const match = error.errors.find((item) => item.meta?.paramName === paramName);
  return match?.longMessage ?? match?.message;
};

/**
 * Falls back to a generic message for anything that isn't a recognized Clerk
 * error. That fallback used to discard the original error entirely, which made
 * every unexpected failure look identical — so anything unrecognized is logged
 * in development before the generic message goes out.
 */
export const clerkErrorMessage = (error: unknown, fallback: string): string => {
  // Already translated by the caller that built it — the generic fallback
  // would be strictly less informative than "the request timed out".
  if (error instanceof AuthTimeoutError) return error.message;
  if (isClerkAPIResponseError(error)) {
    const [first] = error.errors;
    return first?.longMessage ?? first?.message ?? fallback;
  }
  if (process.env.NODE_ENV === "development") console.error("Unrecognized auth error:", error);
  return fallback;
};
