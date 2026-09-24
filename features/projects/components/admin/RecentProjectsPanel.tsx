"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/kit/Button";
import { Panel } from "@/components/kit/Panel";
import { useProjects } from "@/features/projects/hooks/UseProjects";
import { ApiError } from "@/lib/Api";
import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import { Link } from "@/i18n/navigation";

export default function RecentProjectsPanel() {
  const t = useTranslations("admin.dashboard");
  const tProjects = useTranslations("admin.projects");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";
  const { data, isPending, isError, error } = useProjects({
    page: 1,
    limit: 5,
  });

  const recent = data?.data ?? [];
  const loadError = error instanceof ApiError ? error.message : undefined;

  return (
    <Panel flush>
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">{t("recentProjects")}</h2>
        <Button variant="ghost" size="sm" href="/admin/projects">
          {t("viewAll")}
          <ArrowRight className="rtl:rotate-180" aria-hidden />
        </Button>
      </div>

      {isPending && !data ? (
        <div className="flex flex-col gap-3 px-4 py-4" aria-busy>
          <span className="sr-only">{tCommon("loading")}</span>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-surface-3"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="px-4 py-10 text-center text-sm text-ink-faint">
          {tCommon("loadError", { message: loadError ?? tCommon("noResults") })}
        </p>
      ) : (
        <>
          <ul className="divide-y divide-hairline">
            {recent.map((project) => (
              <li key={project._id}>
                <Link
                  href={`/admin/projects/${project._id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-3/60"
                >
                  <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md border border-hairline bg-surface-3">
                    <Image
                      loader={cloudinaryLoader}
                      src={project.coverImage}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-ink">
                      {project.name[locale]}
                    </span>
                    <span className="truncate text-xs text-ink-faint" dir="ltr">
                      /{project.slug}
                    </span>
                  </span>
                  <span className="ms-auto flex shrink-0 items-center gap-3">
                    <span className="max-sm:hidden text-xs text-ink-muted">
                      {project.category.name[locale]}
                    </span>
                    <StatusBadge status={project.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {recent.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-ink-faint">
              {tProjects("emptyTitle")}
            </p>
          )}
        </>
      )}
    </Panel>
  );
}
