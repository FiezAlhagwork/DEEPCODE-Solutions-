import { cn } from "@/lib/Utils";
import type { EmptyStateProps } from "@/types/AdminUi";

// Replaces the bare dashed box the tables used to render. An empty table is a
// dead end unless it says why it's empty and offers the way out, so `action`
// is where the "add the first one" button goes.

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="flex size-11 items-center justify-center rounded-full border border-hairline bg-surface-3 text-ink-faint">
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && (
          <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
