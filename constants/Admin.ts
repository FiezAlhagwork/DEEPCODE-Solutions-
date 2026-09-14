/**
 * Admin-wide constants. Kept apart from `constants/AdminNav.ts`, which is only
 * about navigation.
 */

/**
 * Rows per page in every admin grid. Matches the backend's own default `limit`
 * for paginated list endpoints, so the first client-side page and the first
 * server page line up once the API is wired.
 */
export const ADMIN_PAGE_SIZE = 10;

/**
 * Upper bound the backend allows on `limit`. Used when a form needs the full
 * category list for a select, rather than a paginated table page.
 */
export const ADMIN_SELECT_LIMIT = 100;
