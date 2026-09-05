import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";

/**
 * Narrows the raw `[locale]` route segment to a supported locale.
 *
 * Next.js types route params as plain strings, so every page and layout has to
 * validate before handing the value to next-intl. Anything unsupported 404s
 * instead of silently falling back to the default locale.
 */
export function requireLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) {
    notFound();
  }

  return value;
}
