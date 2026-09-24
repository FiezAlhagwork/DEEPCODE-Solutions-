import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import { localeAlternates } from "@/i18n/metadata";
import { redirect } from "@/i18n/navigation";
import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import {
  landingPathForProfile,
  safeReturnTo,
} from "@/features/auth/utils/Auth";
import SignUpView from "@/features/auth/components/SignUpView";
import type { LocaleRouteProps, LocaleSearchRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "auth.signUp" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/sign-up"),
  };
}

export default async function SignUpPage({
  params,
  searchParams,
}: LocaleSearchRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  // Where to go once signed in — the product a visitor was about to order,
  // say. Validated here, once, so nothing downstream handles a raw URL value.
  const returnTo = safeReturnTo((await searchParams).returnTo);

  // Same single-session reason as `sign-in/page.tsx`: `signUp.create()` and
  // `authenticateWithRedirect()` both throw `session_exists` for a visitor who
  // already has a session, so there is nothing this form could accomplish.
  const { userId, getToken } = await auth();
  if (userId) {
    const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);
    // Same `returnTo` precedence as the sign-in page.
    redirect({ href: returnTo ?? landingPathForProfile(profile), locale });
  }

  return <SignUpView locale={locale} returnTo={returnTo} />;
}
