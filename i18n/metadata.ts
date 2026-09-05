import { routing } from "./routing";

// Set NEXT_PUBLIC_SITE_URL in .env.local and on the server so hreflang and
// canonical links are emitted as absolute production URLs instead of localhost.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
);

/**
 * Canonical + hreflang alternates for one route, in every locale.
 * `pathname` is the route without the locale prefix, e.g. "/hosting/vps".
 */
export function localeAlternates(locale: string, pathname = "/") {
  const path = pathname === "/" ? "" : pathname;

  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries(
      routing.locales.map((candidate) => [candidate, `/${candidate}${path}`])
    ),
  };
}
