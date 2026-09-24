import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` convention to `proxy`.
const intlMiddleware = createMiddleware(routing);

// Any locale, then `/admin` or the customer's own `/account` area and
// everything under them. Both need a session; only `/admin` also needs a role,
// and that is checked deeper, not here.
const isProtectedRoute = createRouteMatcher([
  "/:locale/admin(.*)",
  "/:locale/account(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // "Signed in at all?" only — cheap, edge-only, no backend call. The real
    // admin/super_admin role check runs deeper, in `app/[locale]/admin/layout.tsx`,
    // because role lives in the backend's own database and is never available
    // from a Clerk session claim alone (see CLAUDE.md's Auth & Roles notes).
    const [, locale = routing.defaultLocale, ...rest] =
      req.nextUrl.pathname.split("/");

    // Sends the visitor back to the page they asked for once signed in. The
    // path is locale-less on purpose — the sign-in page validates it with
    // `safeReturnTo()` and hands it to the locale-aware router, which adds the
    // locale itself.
    const returnTo = `/${rest.join("/")}${req.nextUrl.search}`;
    const signIn = new URL(`/${locale}/sign-in`, req.url);
    signIn.searchParams.set("returnTo", returnTo);

    await auth.protect({ unauthenticatedUrl: signIn.toString() });
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
