"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { Button } from "@/components/ui/button";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "من نحن", href: "#about" },
  { label: "خدماتنا", href: "#services" },
  { label: "فريقنا", href: "#team" },
];

const navVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
    },
  }),
};

const drawerVariants = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};
export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-999 flex justify-start" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 cursor-pointer"
            />

            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-sm h-full bg-background/95  border-l border-border/20 shadow-2xl flex flex-col p-8 z-10"
              style={{
                willChange: "transform",
              }}
            >
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  aria-label="إغلاق القائمة"
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary border border-border/30 text-foreground shadow-md transition-colors hover:bg-secondary/80"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col items-start gap-4 mt-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    custom={i}
                    variants={navVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full"
                  >
                    <a
                      href={link.href}
                      className="inline-block text-xl font-semibold text-foreground/90 hover:text-primary transition-colors tracking-tight py-1"
                      onClick={onClose}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="mt-auto pt-6 border-t border-border/30"
              >
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full justify-center">
                    English
                  </Button>
                  <Button variant="default" className="w-full justify-center">
                    اتصل بنا
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
