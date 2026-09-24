import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import AccountProfilePanel from "@/features/account/components/admin/AccountProfilePanel";
import AccountSessionsPanel from "@/features/account/components/admin/AccountSessionsPanel";
import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import { redirect } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminAccountPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.account");

  // Email, role and status come from our own database, not from Clerk, and are
  // read here rather than in the browser for the same reason the users page
  // does it: one request on one route, and no second source of truth about
  // role. The editable half (photo, name) lives in Clerk and is read by the
  // client panel through `useUser()`.
  const { getToken } = await auth();
  const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);

  // Unreachable in practice — `admin/layout.tsx`'s gate already turned an
  // unsynced profile away, since `landingPathForProfile()` reads it as "not an
  // admin". Handled rather than asserted so the narrowing below is real.
  // `redirect()` throws, but next-intl types it as returning `void`, so the
  // explicit return is what tells TypeScript `profile` is synced from here on.
  if (!profile.synced) {
    redirect({ href: "/", locale });
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("title")} description={t("description")} />

      <AccountProfilePanel
        identity={{
          email: profile.email,
          role: profile.role,
          status: profile.status,
        }}
      />

      <AccountSessionsPanel />
    </div>
  );
}
