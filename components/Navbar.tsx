"use client";

import { useCallback, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationOverlay } from "./NavigationOverlay";

const navLinks = [
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "فريقنا", href: "#team" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <header className="z-50 bg-[#0D0D0E]">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <span className="text-xl md:text-[22px] text-primary font-bold ">
                DEEPCODE{" "}
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline">English</Button>
              <Button variant="default">اتصل بنا</Button>
            </div>

            <button
              type="button"
              className="md:hidden flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg border border-border/30 bg-secondary/50 text-foreground transition-transform active:scale-95"
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
