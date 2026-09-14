import { cn } from "@/lib/Utils";
import type { DataTableProps, PrimaryCellProps } from "@/types/AdminUi";

// The dense data grid the whole admin panel shares. One definition, so the
// three tables can't drift apart the way the hand-rolled ones did.
//
// Layout notes:
// - **Below `lg` this is not a table at all**: the same rows render as stacked
//   cards. The table used to be forced to `min-w-2xl` (672px) inside a
//   horizontally scrolling box, which measured as 194px of document overflow on
//   a 390px screen and made every grid something you had to drag sideways to
//   read. A card per record has room for every column, so nothing is hidden and
//   nothing scrolls — the list just runs down the page.
// - The switch is at `lg`, not `md`, because the sidebar is already taking
//   16rem by then: a 768px tablet leaves ~470px of content for a table whose
//   columns need ~670px, so it overflowed there too. `lg` is the first width
//   where the table genuinely fits beside the sidebar.
// - On desktop there is no scroll container, which is what lets the header
//   stick to the viewport (an `overflow-x-auto` ancestor would capture the
//   sticky and neutralise it).
// - Row actions are revealed on hover on desktop, but stay permanently visible
//   on the cards, since a touch screen has no hover state to reveal them with.

const alignClass = {
  start: "text-start",
  end: "text-end",
  center: "text-center",
} as const;

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowActions,
  actionsLabel,
  empty,
  stickyOffset = "lg:top-14",
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) return <>{empty}</>;

  const [primary, ...secondary] = columns;

  return (
    <>
      {/* --- below md: one card per record, no scroll container ------------ */}
      <ul className="flex flex-col gap-3 p-4 lg:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            className="flex flex-col gap-3 rounded-lg border border-hairline bg-surface-1 p-3"
          >
            {primary && <div>{primary.cell(row)}</div>}

            {secondary.length > 0 && (
              <dl className="flex flex-col gap-1.5 border-t border-hairline pt-3">
                {secondary.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <dt className="text-xs text-ink-faint">{column.header}</dt>
                    <dd className="min-w-0 text-end text-ink">
                      {column.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {rowActions && (
              <div className="flex items-center justify-end gap-1 border-t border-hairline pt-3">
                {rowActions(row)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* --- md and up: the table, unchanged ------------------------------- */}
      <div className="hidden w-full lg:block">
        <table className="w-full border-collapse text-sm">
          <thead className={cn("bg-surface-2 lg:sticky lg:z-10", stickyOffset)}>
            <tr className="border-b border-hairline">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 text-[0.6875rem] font-semibold tracking-wider text-ink-faint uppercase",
                    alignClass[column.align ?? "start"],
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="w-px px-4 py-2.5">
                  <span className="sr-only">{actionsLabel}</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="group/row border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-3/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 py-3 align-middle",
                      alignClass[column.align ?? "start"],
                      column.align === "end" && "tabular-nums",
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
                {rowActions && (
                  <td className="w-px px-4 py-3 align-middle">
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 transition-opacity",
                        // Dimmed rather than hidden: invisible actions are
                        // undiscoverable. The cards above show theirs outright,
                        // since a touch screen has no hover to reveal them with.
                        "opacity-60 group-hover/row:opacity-100 group-focus-within/row:opacity-100",
                      )}
                    >
                      {rowActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * The two-line primary cell used as the first column of every grid: a thumbnail
 * (or any leading visual), a strong title, and a muted secondary line.
 */
export function PrimaryCell({ media, title, subtitle }: PrimaryCellProps) {
  return (
    <div className="flex items-center gap-3">
      {media}
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-ink">{title}</span>
        {subtitle && (
          <span className="truncate text-xs text-ink-faint" dir="ltr">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
