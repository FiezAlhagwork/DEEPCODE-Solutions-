import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireLocale } from "@/i18n/Locale";
import { localeAlternates } from "@/i18n/metadata";
import AcceptInvitationView from "@/features/auth/components/AcceptInvitationView";
import AlreadySignedInCard from "@/features/auth/components/AlreadySignedInCard";
import type { LocaleRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "auth.acceptInvitation" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/accept-invitation"),
  };
}

// What points the invitation email at this route (rather than Clerk's generic
// `/sign-up` default) is the backend's `redirectUrl` parameter on
// `clerkClient.invitations.createInvitation(...)` — a per-invitation code
// parameter, not a Clerk Dashboard setting; there is no Dashboard option for it.
export default async function AcceptInvitationPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  // An invitation link is very often opened by someone already signed in as a
  // different account, and in single-session mode the ticket would just be
  // rejected with `session_exists` — so say so plainly and offer the way out
  // instead of letting the form fail for a reason nothing on screen explains.
  const { userId } = await auth();

  return (
    // Both children read the invitation ticket via `useSearchParams()`, which
    // opts the page out of static rendering unless wrapped here.
    <Suspense
      fallback={<Loader2 className="size-6 animate-spin text-ink-faint" aria-hidden />}
    >
      {userId ? <AlreadySignedInCard /> : <AcceptInvitationView />}
    </Suspense>
  );
}
