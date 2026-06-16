"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 400;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      className={cn(
        "fixed bottom-6 inset-e-6 z-40 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full ",
        "border border-primary/30 bg-secondary/90 text-primary backdrop-blur-sm",
        "shadow-[0_0_24px_rgba(136,15,210,0.2)]",
        "transition-all duration-300 ease-out hover:border-primary/60 hover:bg-primary hover:text-primary-foreground active:scale-95",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp size={22} strokeWidth={2} aria-hidden />
    </button>
  );
}
