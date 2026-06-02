"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "فريقنا", href: "#team" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className=" z-50 bg-[#0D0D0E] ">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg md:text-[22px]  text-primary font-normal  font-(family-name:--font-black_ops_one) ">
              DEEPCODE{" "}
              <span className="text-white font-bold font-(family-name:--font-cairo)">
                Solutions
              </span>
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
            <Button variant="default" className="">
              اتصل بنا
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/50">
                <Button variant="outline" className="w-fit">English</Button>
                <Button variant="default" className="w-fit">
                  اتصل بنا
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
