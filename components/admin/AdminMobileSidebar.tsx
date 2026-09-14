"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "focus-trap-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/Utils";
import type { AdminMobileSidebarProps } from "@/types/Admin";
import AdminNavLinks from "./AdminNavLinks";

// Mirrors `components/shared/NavigationOverlay.tsx`'s drawer pattern
// (focus-trap-react + `inert`) so the admin section doesn't introduce a second
// way of building a mobile drawer. Below `md` only — the desktop sidebar
// collapses to a rail instead of hiding.
export default function AdminMobileSidebar({
  isOpen,
  onClose,
}: AdminMobileSidebarProps) {
  const t = useTranslations("admin.header");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        initialFocus: () => closeButtonRef.current,
        escapeDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      {/* `overflow-hidden` clips the panel while it is parked off-canvas.
          Without it the closed drawer still counts towards the document's
          width — in RTL it sits 288px past the right edge, which is why every
          admin page could be scrolled sideways on a phone. Clipping does
          nothing once it is open, since it is then translated to 0. */}
      <div
        className={cn(
          "fixed inset-0 z-999 flex justify-start overflow-hidden md:hidden",
          !isOpen && "pointer-events-none",
        )}
        inert={!isOpen}
      >
        <div
          aria-hidden
          onClick={onClose}
          className={cn(
            "fixed inset-0 cursor-pointer bg-black/70 transition-opacity duration-200 ease-out",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          role="dialog"
          aria-modal={isOpen}
          aria-label={t("title")}
          className={cn(
            "relative z-10 flex h-full w-full max-w-72 flex-col border-e border-hairline bg-surface-1 shadow-2xl",
            "transition-transform duration-300 ease-out will-change-transform",
            isOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full",
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
            <span className="text-base font-bold tracking-tight text-ink">
              DEEPCODE
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t("closeSidebar")}
              className="flex size-9 items-center justify-center rounded-lg border border-hairline-strong text-ink-muted transition-colors hover:text-ink active:scale-95"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <AdminNavLinks onNavigate={onClose} />
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
