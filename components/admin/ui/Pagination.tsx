"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/Utils";
import type { PaginationProps } from "@/types/AdminUi";
import IconButton from "./IconButton";

// Driven by the backend's pagination envelope: `{ page, limit, total, totalPages }`
// sits as a sibling of `data` on every list endpoint, so this component takes
// exactly those four numbers and nothing derived client-side.

const LIMIT_OPTIONS = [10, 25, 50] as const;

/** First/last, the current page and its neighbours, with gaps marked `null`. */
function pageWindow(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const visible = [...pages]
    .filter((candidate) => candidate >= 1 && candidate <= totalPages)
    .sort((a, b) => a - b);

  return visible.flatMap((current, index) => {
    const previous = visible[index - 1];
    return previous !== undefined && current - previous > 1
      ? [null, current]
      : [current];
  });
}

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  className,
}: PaginationProps) {
  const t = useTranslations("admin.pagination");

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-4 py-3",
        className,
      )}
    >
      <p className="text-xs text-ink-faint">
        {t("showing", {
          from: String(from),
          to: String(to),
          total: String(total),
        })}
      </p>

      <div className="flex items-center gap-3">
        {onLimitChange && (
          <label className="flex items-center gap-2 text-xs text-ink-faint">
            {t("perPage")}
            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="h-7 rounded-md border border-hairline-strong bg-surface-1 px-2 text-xs text-ink outline-none focus-visible:border-primary/50"
            >
              {LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-1">
          <IconButton
            size="sm"
            aria-label={t("previous")}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden />
          </IconButton>

          {pageWindow(page, totalPages).map((candidate, index) =>
            candidate === null ? (
              <span
                key={`gap-${index}`}
                aria-hidden
                className="px-1 text-xs text-ink-faint"
              >
                …
              </span>
            ) : (
              <button
                key={candidate}
                type="button"
                onClick={() => onPageChange(candidate)}
                aria-current={candidate === page ? "page" : undefined}
                className={cn(
                  "h-7 min-w-7 rounded-md px-2 text-xs font-medium tabular-nums transition-colors",
                  candidate === page
                    ? "bg-primary/15 text-primary"
                    : "text-ink-muted hover:bg-surface-3 hover:text-ink",
                )}
              >
                {candidate}
              </button>
            ),
          )}

          <IconButton
            size="sm"
            aria-label={t("next")}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="rtl:rotate-180" aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
