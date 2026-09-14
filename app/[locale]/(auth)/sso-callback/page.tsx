import { setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import SsoCallbackView from "@/features/auth/components/SsoCallbackView";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function SsoCallbackPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  return <SsoCallbackView />;
}
