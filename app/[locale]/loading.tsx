import PendingScreen from "@/components/shared/PendingScreen";

// The only boundary that covers `admin/layout.tsx`'s role check, for the same
// structural reason `error.tsx` sits here: a segment's own `loading.tsx`
// renders *inside* that segment's layout, so it can't stand in for the layout's
// own await. Copy is intentionally neutral — this also shows on public-site
// navigations, where "verifying your account" would be the wrong thing to say.
// The specific wording lives in the sign-in / sign-up loading files instead.
export default function LocaleLoading() {
  return <PendingScreen />;
}
