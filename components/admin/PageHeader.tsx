import type { PageHeaderProps } from "@/types/Admin";

// The title block every admin page opens with. Kept as one component so the
// pages can't each invent their own heading size and spacing.

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold tracking-tight text-ink md:text-xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
