"use client";

import { useState, type CSSProperties } from "react";

import { useSidebarCollapsed } from "@/hooks/UseSidebarCollapsed";
import type { AdminShellProps } from "@/types/Admin";
import AdminHeader from "./AdminHeader";
import AdminMobileSidebar from "./AdminMobileSidebar";
import AdminSidebar from "./AdminSidebar";

// The admin section's chrome — sidebar + header — parallel to what
// `components/shared/` does for the public site. Mounted once by
// `app/[locale]/admin/layout.tsx`, outside the public `(site)` group.
//
// The sidebar width lives in a single custom property set here. Both the fixed
// sidebar and the content column's margin read it, which is what makes the
// collapse animate and keeps the two from drifting apart (they used to be two
// unrelated literals, `w-64` and `ms-64`, in two different files).
export default function AdminShell({ children }: AdminShellProps) {
  const collapsed = useSidebarCollapsed();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div
      className="min-h-dvh bg-surface-0"
      style={
        {
          "--admin-sidebar-w": collapsed
            ? "var(--admin-sidebar-collapsed)"
            : "var(--admin-sidebar-expanded)",
        } as CSSProperties
      }
    >
      <AdminSidebar collapsed={collapsed} />
      <AdminMobileSidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex min-h-dvh flex-col transition-[margin] duration-200 ease-out md:ms-(--admin-sidebar-w)">
        <AdminHeader onOpenSidebar={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
