import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import type { ChildrenProps } from "@/types/Shared";

// Minimal chrome for Clerk's embedded sign-in/sign-up/accept-invitation
// views — no public Navbar/Footer (see `(site)`), no AdminShell (see
// `admin/`). Sibling route group to both.
export default function AuthLayout({ children }: ChildrenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-surface-0 px-4 py-12">
      <span className="text-lg font-bold tracking-tight text-ink">DEEPCODE</span>
      {children}
      <LocaleSwitcher className="h-9 rounded-lg border-hairline-strong px-3 py-0 text-xs" />
    </div>
  );
}
