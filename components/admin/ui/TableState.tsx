"use client";

import { useTranslations } from "next-intl";

import { ApiError } from "@/lib/Api";
import type { TableStateProps } from "@/types/AdminUi";
import EmptyState from "./EmptyState";

/** Enough rows to fill the grid while it loads, without pretending to know the page size. */
const SKELETON_ROWS = 5;

// The loading and error states shared by every admin grid. The "no rows" state
// is not here on purpose: that one needs the table's own copy and call to
// action, so it stays with `DataTable`'s `empty` prop.
export default function TableState({
  isLoading,
  error,
  icon,
  children,
}: TableStateProps) {
  const t = useTranslations("admin.common");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 py-6" aria-busy>
        <span className="sr-only">{t("loading")}</span>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-lg bg-surface-3"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={icon}
        // Anything that isn't an `ApiError` has no message worth showing, so
        // the generic line stands in rather than leaking an internal string.
        title={t("loadError", {
          message: error instanceof ApiError ? error.message : t("noResults"),
        })}
      />
    );
  }

  return <>{children}</>;
}
