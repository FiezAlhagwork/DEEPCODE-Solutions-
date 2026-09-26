import type { NavCountBadgeProps } from "@/types/Admin";

// The count beside a sidebar entry, or a dot on its icon when the rail is
// collapsed. Nothing at all at zero: a permanent "0" teaches the eye to skip
// the badge. Each feature's badge fetches its own number and renders this.
export default function NavCountBadge({
  count,
  label,
  collapsed = false,
}: NavCountBadgeProps) {
  if (!count) return null;

  if (collapsed) {
    return (
      <span
        aria-label={label}
        role="img"
        className="absolute inset-e-2 top-2 size-2 rounded-full bg-primary ring-2 ring-surface-1"
      />
    );
  }

  return (
    <span
      aria-label={label}
      role="img"
      className="ms-auto rounded-full bg-primary px-1.5 py-0.5 text-[0.6875rem] leading-none font-semibold text-primary-foreground tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
