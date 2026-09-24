"use client";

import { Tags } from "lucide-react";
import { useTranslations } from "next-intl";

import { Panel } from "@/components/kit/Panel";
import { useCategories } from "@/features/categories/hooks/UseCategories";

// Only the count is needed, so it asks for a single row and reads
// `pagination.total` — which is the count across every page, unlike
// `data.length`, which would only ever be the size of the page fetched.
export default function CategoryStats() {
  const t = useTranslations("admin.dashboard");
  const { data, isPending } = useCategories({ page: 1, limit: 1 });

  return (
    <Panel className="flex items-center gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-3 text-primary">
        <Tags className="size-4.5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xl font-semibold tabular-nums text-ink">
          {isPending && !data ? "…" : (data?.pagination.total ?? "—")}
        </span>
        <span className="truncate text-xs text-ink-faint">
          {t("stats.categories")}
        </span>
      </div>
    </Panel>
  );
}
