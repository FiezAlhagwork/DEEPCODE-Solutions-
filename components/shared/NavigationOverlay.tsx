"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/#about" },
  { label: "خدماتنا", href: "/#services" },
  { label: "الميزات", href: "/#server" },
  { label: "التسعير", href: "/#pricing" },
  { label: "تواصل", href: "/#contact" },
];

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
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
    <div
      className={cn(
        "fixed inset-0 z-999 flex justify-start md:hidden",
        !isOpen && "pointer-events-none",
      )}
      dir="rtl"
      aria-hidden={!isOpen}
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
        aria-label="قائمة التنقل"
        className={cn(
          "relative z-10 flex h-full w-full max-w-sm flex-col border-l border-border/20 bg-background p-8 shadow-2xl",
          "transition-transform duration-300 ease-out will-change-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-secondary text-foreground shadow-md transition-transform active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-2 flex flex-1 flex-col items-start gap-4">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${60 + i * 40}ms` : "0ms" }}
              className={cn(
                "inline-block w-full py-1 text-xl font-semibold tracking-tight text-foreground/90 transition-[opacity,transform] duration-300 ease-out hover:text-primary",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0",
              )}
            >
              {link.label}
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
            <Button variant="outline" className="w-full justify-center">
              English
            </Button>
            <Button variant="default" className="w-full justify-center">
              اتصل بنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
