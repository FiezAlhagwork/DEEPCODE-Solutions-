import { cn } from "@/lib/Utils";
import type { BadgeProps, BadgeTone } from "@/types/Kit";

// Status/role pills. `dot` renders the small leading indicator used in the
// projects grid, where a coloured dot reads faster than a filled pill.

const tones: Record<BadgeTone, string> = {
  neutral: "border-hairline-strong bg-surface-3 text-ink-muted",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
  brand: "border-primary/30 bg-primary/12 text-primary",
};

const dotTones: Record<BadgeTone, string> = {
  neutral: "bg-ink-faint",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  brand: "bg-primary",
};

export default function Badge({
  tone = "neutral",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
        "text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", dotTones[tone])}
        />
      )}
      {children}
    </span>
  );
}
