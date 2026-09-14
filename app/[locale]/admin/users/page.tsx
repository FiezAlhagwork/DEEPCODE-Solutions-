import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHeader from "@/components/admin/PageHeader";
import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import UsersPageActions from "@/features/users/components/admin/UsersPageActions";
import UsersTable from "@/features/users/components/admin/UsersTable";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export default async function AdminUsersPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("admin.users");

  // Reading the list is open to `admin`, but inviting, changing a role and
  // deactivating are all `super_admin`-only — and the backend has no guard
  // against a super admin demoting or deactivating *themselves*, which would
  // lock them out of the panel with no way back from the UI. Both facts are
  // settled here, on the server, from the same `GET /api/auth/me` the admin
  // gate uses, rather than guessed at in the browser.
  const { getToken } = await auth();
  const profile = await getMyProfileWithRetry((await getToken()) ?? undefined);
  const canManage = profile.synced && profile.role === "super_admin";
  const viewerId = profile.synced ? profile._id : undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* The invite button opens a modal, so it lives in a small client island
          rather than turning this whole page into a client component. */}
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={<UsersPageActions canManage={canManage} />}
      />

      <UsersTable canManage={canManage} viewerId={viewerId} />
    </div>
  );
}
