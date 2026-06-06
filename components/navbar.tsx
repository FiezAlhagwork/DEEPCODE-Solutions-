"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationOverlay } from "./NavigationOverlay";

const navLinks = [
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "فريقنا", href: "#team" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="z-50 bg-[#0D0D0E]">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <span className="text-xl md:text-[22px] text-primary font-bold ">
                DEEPCODE{" "}
                {/* <span className="text-white font-bold font-(family-name:--font-cairo)">
                  Solutions
                </span> */}
              </span>
            </a>

            {/* Desktop Nav */}
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

            {/* Language & CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline">English</Button>
              <Button variant="default">اتصل بنا</Button>
            </div>

            {/* Animated Hamburger Button */}
            <motion.button
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/50 border border-border/30 text-foreground"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      <NavigationOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
