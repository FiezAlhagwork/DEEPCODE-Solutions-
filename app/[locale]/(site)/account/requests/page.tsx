import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import { landingPathForProfile } from "@/features/auth/utils/Auth";
import MyRequestsTable from "@/features/requests/components/MyRequestsTable";
import { redirect } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "myAccount.nav" });

  return { title: t("requests"), robots: { index: false } };
}

export default async function MyRequestsPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  // `GET /api/requests` hands an admin every customer's requests, and takes no
  // parameter to ask for "mine only" — so on this page an admin would see the
  // whole queue presented as "my requests". They are sent to the panel, where
  // that list belongs, whether they came by a link or typed the URL.
  //
  // `landingPathForProfile()` is the same single decision the admin gate and
  // the sign-in page use. An unsynced profile (right after sign-up) reads as
  // "not an admin", which is correct here: it can only be a new customer.
  const { getToken } = await auth();
  const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);
  if (landingPathForProfile(profile) === "/admin") {
    redirect({ href: "/admin/requests", locale });
  }

  return <MyRequestsTable />;
}
