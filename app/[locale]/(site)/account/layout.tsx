import { getTranslations, setRequestLocale } from "next-intl/server";

import AccountNav from "@/components/account/AccountNav";
import SignOutButton from "@/components/admin/SignOutButton";
import { requireLocale } from "@/i18n/Locale";
import type { ChildrenProps, LocaleRouteProps } from "@/types/Shared";

// The customer's account area. It lives inside the public site's frame — the
// navbar and footer come from `(site)/layout.tsx` — and uses the component kit
// for what goes inside, the same split the order modal uses.
//
// Signed-in-only is enforced by `proxy.ts`; there is no role gate here,
// because every account may have one. Pages that an admin should not use
// (today: "my requests") redirect on their own.
export default async function AccountLayout({
  children,
  params,
}: ChildrenProps & LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("myAccount");

  return (
    // Same frame as `/projects` and the home page's sections.
    <div className="relative w-full overflow-x-clip px-6 py-16 md:py-24">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-white md:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <SignOutButton variant="button" redirectUrl={`/${locale}`} />
        </div>

        <AccountNav />

        {children}
      </div>
    </div>
  );
}
