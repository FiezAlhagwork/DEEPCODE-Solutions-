"use client";

import { FolderKanban, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import { Panel } from "@/components/kit/Panel";
import { useProjects } from "@/features/projects/hooks/UseProjects";

export default function ProjectStats() {
  const t = useTranslations("admin.dashboard");
  const all = useProjects({ page: 1, limit: 5 });
  const published = useProjects({ page: 1, limit: 1, status: "published" });

  const stats = [
    {
      key: "projects" as const,
      value: all.data?.pagination.total,
      icon: FolderKanban,
      pending: all.isPending && !all.data,
    },
    {
      key: "published" as const,
      value: published.data?.pagination.total,
      icon: Layers,
      pending: published.isPending && !published.data,
    },
  ];

  return (
    <>
      {stats.map(({ key, value, icon: Icon, pending }) => (
        <Panel key={key} className="flex items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-3 text-primary">
            <Icon className="size-4.5" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-xl font-semibold tabular-nums text-ink">
              {pending ? "…" : (value ?? "—")}
            </span>
            <span className="truncate text-xs text-ink-faint">
              {t(`stats.${key}`)}
            </span>
          </div>
        </Panel>
      ))}
    </>
  );
}
