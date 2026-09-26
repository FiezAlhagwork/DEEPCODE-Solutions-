import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PreparingAccountView from "@/features/auth/components/PreparingAccountView";
import { authPageHref, safeReturnTo } from "@/features/auth/utils/Auth";
import { requireLocale } from "@/i18n/Locale";
import { redirect } from "@/i18n/navigation";
import type { LocaleRouteProps, LocaleSearchRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "auth.preparing" });

  return { title: t("title"), robots: { index: false } };
}

// Where every new account lands after sign-up (email, Google or an
// invitation) — see `PreparingAccountView` for why the stop exists. It is
// only for someone signed in; anyone else is sent to sign in first, with the
// same `returnTo` carried along.
export default async function PreparingPage({
  params,
  searchParams,
}: LocaleSearchRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const returnTo = safeReturnTo((await searchParams).returnTo);

  const { userId } = await auth();
  if (!userId) {
    redirect({ href: authPageHref("/sign-in", returnTo), locale });
  }

  return <PreparingAccountView returnTo={returnTo} />;
}
