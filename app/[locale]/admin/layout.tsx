import { auth } from "@clerk/nextjs/server";
import AdminShell from "@/components/admin/AdminShell";
import { getMyProfileWithRetry } from "@/features/auth/services/Auth";
import { landingPathForProfile } from "@/features/auth/utils/Auth";
import { redirect } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/Locale";
import QueryProvider from "@/providers/QueryProvider";
import type { ChildrenProps, LocaleRouteProps } from "@/types/Shared";

// The admin section's own chrome — no public Navbar/Footer (see the `(site)`
// route group next to this one for that).
//
// The role gate: `proxy.ts` already guarantees a signed-in session before a
// request ever reaches here (see `isAdminRoute`), but "signed in" and
// "admin/super_admin" are different questions — role lives only in the
// backend's own database, so it takes a real request to know it.
//
// The decision itself is `landingPathForProfile()`, shared with the sign-in
// and sign-up pages so the same profile can never be read as an admin in one
// place and not the other. A backend that doesn't answer is deliberately left
// to throw: `app/[locale]/error.tsx` turns it into a retry screen, which is
// far better than silently treating an unreachable server as "not an admin".
export default async function AdminLayout({
  children,
  params,
}: ChildrenProps & LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  const { userId, getToken } = await auth();
  if (!userId) redirect({ href: "/sign-in", locale });

  const token = await getToken();
  const profile = await getMyProfileWithRetry(token ?? undefined);
  if (landingPathForProfile(profile) !== "/admin") redirect({ href: "/", locale });

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
