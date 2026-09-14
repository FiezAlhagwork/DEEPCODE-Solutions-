import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` convention to `proxy`.
const intlMiddleware = createMiddleware(routing);

// Any locale, then `/admin` and everything under it.
const isAdminRoute = createRouteMatcher(["/:locale/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // "Signed in at all?" only — cheap, edge-only, no backend call. The real
    // admin/super_admin role check runs deeper, in `app/[locale]/admin/layout.tsx`,
    // because role lives in the backend's own database and is never available
    // from a Clerk session claim alone (see CLAUDE.md's Auth & Roles notes).
    const locale = req.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
    await auth.protect({
      unauthenticatedUrl: new URL(`/${locale}/sign-in`, req.url).toString(),
    });
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
