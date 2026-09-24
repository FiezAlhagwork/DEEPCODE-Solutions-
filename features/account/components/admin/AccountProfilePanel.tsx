"use client";

import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import RoleBadge from "@/components/admin/RoleBadge";
import StatusBadge from "@/components/admin/StatusBadge";
import { FormSection } from "@/components/kit/FormLayout";
import type { AccountProfilePanelProps } from "../../types/Account";
import AccountAvatarField from "./AccountAvatarField";
import AccountProfileForm from "./AccountProfileForm";

/**
 * The editable half reads from Clerk (`useUser`) so it stays correct the
 * instant a save lands; the read-only half is passed down from the server,
 * where the page already fetched `GET /api/auth/me` for the role. Email, role
 * and status can't be changed here, so there is nothing to keep live about them
 * and no second client request to justify.
 */
export default function AccountProfilePanel({
  identity,
}: AccountProfilePanelProps) {
  const t = useTranslations("admin.account");
  const tCommon = useTranslations("admin.common");
  const { user, isLoaded } = useUser();

  return (
    <FormSection title={t("profileTitle")} description={t("profileDescription")}>
      {!isLoaded || !user ? (
        <div className="flex flex-col gap-4" aria-busy>
          <span className="sr-only">{tCommon("loading")}</span>
          <div className="h-20 animate-pulse rounded-full bg-surface-3 md:w-20" />
          <div className="h-10 animate-pulse rounded-lg bg-surface-3" />
        </div>
      ) : (
        <>
          <AccountAvatarField
            name={[user.firstName, user.lastName].filter(Boolean).join(" ")}
            imageUrl={user.imageUrl}
            hasImage={user.hasImage}
          />

          {/* Remounted per account so the fields are seeded from props rather
              than synced out of `useUser()` inside an effect. */}
          <AccountProfileForm
            key={user.id}
            firstName={user.firstName ?? ""}
            lastName={user.lastName ?? ""}
          />
        </>
      )}

      <dl className="grid grid-cols-1 gap-4 border-t border-hairline pt-4 sm:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <dt className="text-xs font-medium text-ink-muted">{t("email")}</dt>
          {/* A latin-only island, same as the auth forms' inputs. */}
          <dd dir="ltr" className="truncate text-sm text-ink">
            {identity.email}
          </dd>
          <p className="text-xs text-ink-faint">{t("emailHint")}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <dt className="text-xs font-medium text-ink-muted">{t("role")}</dt>
          <dd>
            <RoleBadge role={identity.role} />
          </dd>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <dt className="text-xs font-medium text-ink-muted">
            {t("accountStatus")}
          </dt>
          <dd>
            <StatusBadge status={identity.status} />
          </dd>
        </div>
      </dl>
    </FormSection>
  );
}
