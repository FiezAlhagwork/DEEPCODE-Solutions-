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
import SignInView from "@/features/auth/components/SignInView";
import type { LocaleRouteProps, LocaleSearchRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "auth.signIn" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/sign-in"),
  };
}

export default async function SignInPage({
  params,
  searchParams,
}: LocaleSearchRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  // Where to go once signed in — the product a visitor was about to order,
  // say. Validated here, once, so nothing downstream handles a raw URL value.
  const returnTo = safeReturnTo((await searchParams).returnTo);

  // This Clerk instance runs in single-session mode, so every sign-in call an
  // already-signed-in visitor makes — the email form and the Google button
  // alike — is rejected with `session_exists` before it can do anything. A
  // form that cannot succeed is worse than no form, so they get sent straight
  // to wherever their role actually belongs: `landingPathForProfile()` decides,
  // the same function the admin gate uses, so a non-admin lands on the public
  // site directly instead of bouncing off `/admin` on the way.
  const { userId, getToken } = await auth();
  if (userId) {
    const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);
    // Outside any try/catch on purpose: `redirect()` works by throwing, and a
    // catch around it would swallow the redirect itself.
    // A `returnTo` wins over the role default: someone already signed in who
    // follows an "order this server" link should land on that server, not be
    // detoured through the panel or the home page.
    redirect({ href: returnTo ?? landingPathForProfile(profile), locale });
  }

  return <SignInView locale={locale} returnTo={returnTo} />;
}
