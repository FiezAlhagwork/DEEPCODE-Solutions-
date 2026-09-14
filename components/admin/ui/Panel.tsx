import { cn } from "@/lib/Utils";
import type { PanelHeaderProps, PanelProps } from "@/types/AdminUi";

// One surface component for every boxed region in the admin panel. Replaces the
// `rounded-xl border border-white/5 bg-[#1F1E20]` string that used to be
// copy-pasted into all three tables and both forms.

export function Panel({ children, className, flush = false }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hairline bg-surface-2",
        !flush && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-hairline px-5 py-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && (
          <p className="text-xs text-ink-faint">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
