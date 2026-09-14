"use client";

import { cn } from "@/lib/Utils";
import type { TooltipProps } from "@/types/AdminUi";

// A CSS-only tooltip: no portal, no positioning library, no extra dependency.
// It exists mainly for the collapsed sidebar rail, where the icons lose their
// labels. Shown on hover AND focus-within so keyboard users get it too.
//
// The label is decorative here — every trigger it wraps already carries its own
// `aria-label`, so the bubble is marked `aria-hidden` to avoid double-reading.

export default function Tooltip({
  label,
  side = "end",
  enabled = true,
  children,
  className,
}: TooltipProps) {
  if (!enabled) return <>{children}</>;

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="presentation"
        aria-hidden
        className={cn(
          // Hidden outright below `md`: a touch screen has no hover, so the
          // bubble can never be shown there — but while it merely sat at
          // `opacity-0` it still occupied layout, and on a trigger near the
          // edge of the screen that pushed the document wider than the
          // viewport. Every trigger carries its own `aria-label` regardless.
          "max-md:hidden",
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border",
          "border-hairline-strong bg-surface-3 px-2 py-1 text-xs font-medium text-ink",
          "opacity-0 shadow-lg transition-opacity duration-150",
          "group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          side === "end" && "top-1/2 inset-s-full ms-2 -translate-y-1/2",
          side === "start" && "top-1/2 inset-e-full me-2 -translate-y-1/2",
          side === "top" && "bottom-full inset-s-1/2 mb-2 -translate-x-1/2",
        )}
      >
        {label}
      </span>
    </span>
  );
}
