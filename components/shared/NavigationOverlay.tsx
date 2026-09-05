"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FocusTrap } from "focus-trap-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/Utils";
import { Link } from "@/i18n/navigation";
import type { NavigationOverlayProps } from "@/types/Shared";
import LocaleSwitcher from "./LocaleSwitcher";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "servers", href: "/#server" },
  { key: "pricing", href: "/#pricing" },
  { key: "contact", href: "/#contact" },
] as const;

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const t = useTranslations("nav");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
        // Escape is handled above so the panel closes through the same path
        // as the backdrop and the links.
        escapeDeactivates: false,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      {/* The panel stays mounted so it can animate, so `inert` is what keeps
          its links out of the tab order and the accessibility tree. */}
      <div
        className={cn(
          "fixed inset-0 z-999 flex justify-start md:hidden",
          !isOpen && "pointer-events-none",
        )}
        inert={!isOpen}
      >
        <div
          aria-hidden="true"
          onClick={onClose}
          className={cn(
            "fixed inset-0 bg-black/70 cursor-pointer transition-opacity duration-200 ease-out",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          role="dialog"
          aria-modal={isOpen}
          aria-label={t("menuLabel")}
          className={cn(
            "relative z-10 flex h-full w-full max-w-sm flex-col border-e border-border/20 bg-background p-8 shadow-2xl",
            "transition-transform duration-300 ease-out will-change-transform",
            isOpen
              ? "translate-x-0"
              : "rtl:translate-x-full ltr:-translate-x-full",
          )}
        >
          <div className="mb-8 flex justify-end">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-secondary text-foreground shadow-md transition-transform active:scale-95"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mt-2 flex flex-1 flex-col items-start gap-4">
            {navLinks.map((link, i) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={onClose}
                style={{ transitionDelay: isOpen ? `${60 + i * 40}ms` : "0ms" }}
                className={cn(
                  "inline-block w-full py-1 text-xl font-semibold tracking-tight text-foreground/90 transition-[opacity,transform] duration-300 ease-out hover:text-primary",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "rtl:translate-x-4 ltr:-translate-x-4 opacity-0",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div
            style={{ transitionDelay: isOpen ? "180ms" : "0ms" }}
            className={cn(
              "mt-auto border-t border-border/30 pt-6 transition-[opacity,transform] duration-300 ease-out",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <div className="flex flex-col gap-4">
              <LocaleSwitcher
                className="w-full justify-center"
                onSwitch={onClose}
              />
              <Button asChild variant="default" className="w-full justify-center">
                <Link href="/#contact" onClick={onClose}>
                  {t("cta")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
