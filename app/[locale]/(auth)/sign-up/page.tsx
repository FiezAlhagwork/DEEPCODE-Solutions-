import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import { localeAlternates } from "@/i18n/metadata";
import { redirect } from "@/i18n/navigation";
import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import { landingPathForProfile } from "@/features/auth/utils/Auth";
import SignUpView from "@/features/auth/components/SignUpView";
import type { LocaleRouteProps } from "@/types/Shared";

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

export default async function SignUpPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  // Same single-session reason as `sign-in/page.tsx`: `signUp.create()` and
  // `authenticateWithRedirect()` both throw `session_exists` for a visitor who
  // already has a session, so there is nothing this form could accomplish.
  const { userId, getToken } = await auth();
  if (userId) {
    const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);
    redirect({ href: landingPathForProfile(profile), locale });
  }

  return <SignUpView locale={locale} />;
}
