import { redirect } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

// `/account` itself has nothing of its own yet — it opens on the only section
// there is. When an overview page exists, it replaces this redirect.
export default async function AccountPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  redirect({ href: "/account/requests", locale });
}
