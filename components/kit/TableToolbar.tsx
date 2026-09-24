import { cn } from "@/lib/Utils";
import type { TableToolbarProps } from "@/types/Kit";

// Search + filters strip that sits above a grid, inside the same panel so the
// controls read as part of the table rather than floating above it.

export default function TableToolbar({
  search,
  filters,
  trailing,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-3",
        className,
      )}
    >
      {search && <div className="min-w-45 flex-1">{search}</div>}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      )}
      {trailing && <div className="ms-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
}
