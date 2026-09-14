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

/** The same, for a route segment carrying a record id (`[id]`). */
export type LocaleIdRouteProps = {
  params: Promise<{ locale: string; id: string }>;
};

/** Layouts and providers that only wrap children. */
export type ChildrenProps = {
  children: ReactNode;
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
