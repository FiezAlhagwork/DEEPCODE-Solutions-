import type { AccountSession, AccountSessionView } from "../types/Account";

/**
 * Clerk's `SessionActivity` has every field optional — a session behind a VPN
 * or an ad blocker can arrive with no city, no country and no browser name at
 * all. Assembling the two display lines here keeps that "what if it's missing"
 * decision in one place instead of spread across the card's JSX.
 */

type Translator = (key: "unknownDevice" | "unknownLocation") => string;

/**
 * `"Chrome 153 · Windows"`, dropping whichever pieces Clerk didn't send.
 *
 * Only the major version is shown: Clerk reports the full four-part string
 * ("153.0.0.0"), and the three trailing zeroes say nothing to someone scanning
 * a list for which machine is which.
 */
const deviceLabel = (session: AccountSession, t: Translator) => {
  const { browserName, browserVersion, deviceType } = session.latestActivity;
  const major = browserVersion?.split(".")[0];
  const browser = [browserName, major].filter(Boolean).join(" ");
  const parts = [browser, deviceType].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : t("unknownDevice");
};

/** City and country when Clerk resolved them, otherwise the bare IP. */
const locationLabel = (session: AccountSession, t: Translator) => {
  const { city, country, ipAddress } = session.latestActivity;
  const place = [city, country].filter(Boolean).join(", ");

  return place || ipAddress || t("unknownLocation");
};

export const toAccountSessionView = (
  session: AccountSession,
  currentSessionId: string | undefined,
  t: Translator,
): AccountSessionView => ({
  id: session.id,
  device: deviceLabel(session, t),
  location: locationLabel(session, t),
  lastActiveAt: session.lastActiveAt,
  isCurrent: session.id === currentSessionId,
  isMobile: session.latestActivity.isMobile === true,
});

/**
 * `getSessions()` returns expired, ended and abandoned sessions alongside the
 * live ones. Showing them would fill the list with devices that were signed
 * out weeks ago and offer a revoke button for each — so only `active` reaches
 * the page.
 */
export const isActiveSession = (session: AccountSession) =>
  session.status === "active";
