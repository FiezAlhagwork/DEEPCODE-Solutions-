import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { routing } from "@/i18n/routing";
import type { MyProfile } from "../types/Auth";

/** Longer than any real path on this site; anything past it is not ours. */
const RETURN_TO_MAX_LENGTH = 512;

/** `/ar` or `/en` at the start of a path, followed by `/`, `?` or nothing. */
const LOCALE_PREFIX = new RegExp(
  `^/(${routing.locales.join("|")})(?=/|\\?|$)`,
);

/**
 * Validates a `?returnTo=` value before anything navigates to it — it arrives
 * from the URL, so anyone can put anything there, and redirecting to it
 * unchecked would make the sign-in page an open redirect ("sign in here" →
 * someone else's site).
 *
 * Only an internal, root-relative path passes: it must start with `/`, and not
 * with `//` or `/\`, which browsers read as "another host". The result carries
 * no locale, because every caller hands it to the locale-aware router or
 * `redirect()` from `@/i18n/navigation`, which adds one — so a stray prefix is
 * stripped rather than doubled into `/ar/ar/...`.
 */
export const safeReturnTo = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  if (value.length === 0 || value.length > RETURN_TO_MAX_LENGTH) return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  if (value.includes("\\")) return undefined;

  const path = value.replace(LOCALE_PREFIX, "") || "/";
  return path.startsWith("/") ? path : `/${path}`;
};

/**
 * `/sign-in` or `/sign-up`, carrying `returnTo` along when there is one — used
 * by the link between the two pages, the order modal and the navbar, so the
 * query-string encoding is written once.
 */
export const authPageHref = (
  page: "/sign-in" | "/sign-up",
  returnTo?: string,
): string =>
  returnTo ? `${page}?returnTo=${encodeURIComponent(returnTo)}` : page;

/**
 * `/preparing`, where a new account waits until our database has it — see
 * `PreparingAccountView`. Locale-less, like `authPageHref`; the Google flows
 * prefix the locale themselves, since Clerk navigates there directly.
 */
export const preparingHref = (returnTo?: string): string =>
  returnTo
    ? `/preparing?returnTo=${encodeURIComponent(returnTo)}`
    : "/preparing";

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
