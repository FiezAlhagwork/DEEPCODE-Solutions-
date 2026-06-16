"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationOverlay } from "./NavigationOverlay";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/#about" },
  { label: "خدماتنا", href: "/#services" },
  { label: "السيرفرات", href: "/#server" },
  { label: "التسعير", href: "/#pricing" },
  { label: "تواصل", href: "/#contact" },
];

const SCROLL_THRESHOLD = 60;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY <= 10;

      setIsAtTop(atTop);

      if (atTop) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > SCROLL_THRESHOLD
      ) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showNavbar = isVisible || isOpen || isAtTop;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
          showNavbar ? "translate-y-0" : "-translate-y-full",
          isAtTop
            ? "border-b border-transparent bg-transparent shadow-none"
            : "border-b border-white/5 bg-[#0D0D0E]/75 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md",
        )}
      >
        <nav className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary md:text-[22px]">
                DEEPCODE{" "}
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <Button variant="outline">English</Button>
              <Button variant="default">اتصل بنا</Button>
            </div>

            <button
              type="button"
              className={cn(
                "flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg border text-foreground transition-all active:scale-95 md:hidden",
                isAtTop
                  ? "border-white/10 bg-white/5"
                  : "border-border/30 bg-secondary/50",
              )}
              onClick={openMenu}
              aria-label="فتح القائمة"
              aria-expanded={isOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      <NavigationOverlay isOpen={isOpen} onClose={closeMenu} />
    </>
  );
};

export default Navbar;
