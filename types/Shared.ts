import * as LucideIcons from "lucide-react";
import type { Messages } from "next-intl";
import type { ReactNode } from "react";

export type NavigationOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type LocaleSwitcherProps = {
  className?: string;
  onSwitch?: () => void;
  /**
   * Two-letter code of the other language (`EN` / `AR`) with an icon, instead
   * of its full name — the public navbar's version. The accessible name stays
   * the full, translated one either way.
   */
  compact?: boolean;
};

/** One link in the public navbar and its mobile drawer; `key` resolves against `nav`. */
export type SiteNavLink = {
  key: keyof Messages["nav"];
  href: string;
};

/** `key` resolves against the `footer.links` message namespace. */
export type FooterLink = {
  key: keyof Messages["footer"]["links"];
  href: string;
};

/** Social network names are brand names, so they stay untranslated. */
export type FooterSocialLink = {
  label: string;
  href: string;
  iconName: keyof typeof LucideIcons;
};

/** `key` resolves against the `contact.info` message namespace. */
export type ContactInfoData = {
  key: keyof Messages["contact"]["info"];
  iconName: keyof typeof LucideIcons;
};

/**
 * Bilingual content field shape, matching how the backend stores `name` and
 * `description` on `Project`/`Category` (`{ ar, en }`) — used by the admin
 * dashboard, which edits both languages of a record at once. Unlike the rest
 * of the site's copy, this text is user-authored data, not UI chrome, so it
 * is never routed through `messages/*.json`.
 */
export type LocalizedText = {
  ar: string;
  en: string;
};

/**
 * The envelope every paginated list endpoint returns. `pagination` is a sibling
 * of `data`, never nested inside it, and `total` is the count across all pages —
 * which is why dashboard counts must read it rather than `data.length`.
 */
export type PageInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  pagination: PageInfo;
};

/**
 * The query params every admin list endpoint accepts at minimum. Each
 * feature's own `*QueryParams` type intersects this with whatever filters
 * that resource adds (`category`/`status` for projects, `role` for users).
 */
export type ListQueryParams = {
  page?: number;
  limit?: number;
  q?: string;
};

/**
 * Props every route file under `app/[locale]/` receives. `params` is a promise
 * in Next 16, and `locale` stays `string` — it is narrowed by `requireLocale()`
 * rather than typed as the locale union, which would break the route validator
 * `next build` generates.
 */
export type LocaleRouteProps = {
  params: Promise<{ locale: string }>;
};

/**
 * A locale route that also reads its query string — the auth pages, for
 * `?returnTo=`. Values are untyped on purpose: anything can arrive in a URL, so
 * each one is validated where it is used rather than trusted here.
 */
export type LocaleSearchRouteProps = LocaleRouteProps & {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** The same, for a route segment carrying a record id (`[id]`). */
export type LocaleIdRouteProps = {
  params: Promise<{ locale: string; id: string }>;
};

/**
 * The same, for a public route addressed by slug (`[slug]`) — the projects
 * detail page. A slug rather than an id because it is a URL people see and
 * share, and the API looks a project up by either.
 */
export type LocaleSlugRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Layouts and providers that only wrap children. */
export type ChildrenProps = {
  children: ReactNode;
};

/** `components/shared/PageHero.tsx` — the header on the hosting and projects pages. */
export type PageHeroProps = {
  badge: string;
  title: string;
  description: string;
};

/** Options for `lib/Images.ts`'s `compressImage`. */
export type CompressImageOptions = {
  /** Longest edge in pixels the result is allowed to have. Defaults to 1920. */
  maxEdge?: number;
  /** WebP quality, 0–1. Defaults to 0.82. */
  quality?: number;
};

// --- Route-level status screens -------------------------------------------

/** The props Next hands an `error.tsx` boundary. `digest` is its own server-side error id. */
export type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** What a `loading.tsx` renders: a spinner, plus a line of copy when the wait has a specific reason worth naming. */
export type PendingScreenProps = {
  message?: string;
};

/**
 * What `app/[locale]/error.tsx` renders. `onRetry` is Next's own `reset()`,
 * which re-renders the failed segment — so a backend that was merely down for
 * a moment recovers without a full page reload.
 */
export type ErrorScreenProps = {
  title: string;
  description: string;
  retryLabel: string;
  homeLabel: string;
  onRetry: () => void;
};

// --- Customer account area -------------------------------------------------

/**
 * One section of the customer's `/account` area. `key` resolves against the
 * `myAccount.nav` message namespace, the same way `AdminNavItem` does against
 * `admin.sidebar`. Only "my requests" exists today; the area is built as a
 * list so the next section is one entry.
 */
export type AccountNavItem = {
  key: keyof Messages["myAccount"]["nav"];
  href: string;
  icon: typeof LucideIcons.Inbox;
};

/**
 * The navbar's sign-in link / avatar. `inline` sits in the desktop bar;
 * `block` is the full-width version in the mobile drawer, where `onNavigate`
 * closes the drawer on the way out.
 */
export type AccountEntryProps = {
  variant?: "inline" | "block";
  onNavigate?: () => void;
};

/** The navbar's avatar menu for a signed-in visitor. */
export type AccountMenuProps = {
  name: string;
  email?: string;
  imageUrl: string;
};
