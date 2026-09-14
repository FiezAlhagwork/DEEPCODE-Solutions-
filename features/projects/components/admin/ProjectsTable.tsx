"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, FolderKanban, Pencil, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/admin/ui/Button";
import DataTable, { PrimaryCell } from "@/components/admin/ui/DataTable";
import EmptyState from "@/components/admin/ui/EmptyState";
import IconButton from "@/components/admin/ui/IconButton";
import Pagination from "@/components/admin/ui/Pagination";
import { Panel } from "@/components/admin/ui/Panel";
import SelectInput from "@/components/admin/ui/SelectInput";
import TableToolbar from "@/components/admin/ui/TableToolbar";
import TextInput from "@/components/admin/ui/TextInput";
import { ADMIN_PAGE_SIZE, ADMIN_SELECT_LIMIT } from "@/constants/Admin";
import { useCategories } from "@/features/categories/hooks/UseCategories";
import {
  useDeleteProject,
  useProjects,
} from "@/features/projects/hooks/UseProjects";
import type {
  AdminProject,
  ProjectStatus,
} from "@/features/projects/types/Projects";
import { ApiError } from "@/lib/Api";
import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import type { Column } from "@/types/AdminUi";

export default function ProjectsTable() {
  const t = useTranslations("admin.projects");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | ProjectStatus>("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ADMIN_PAGE_SIZE);
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const params = {
    page,
    limit,
    ...(q !== "" ? { q } : {}),
    ...(status !== "" ? { status } : {}),
    ...(category !== "" ? { category } : {}),
  };

  const projectsQuery = useProjects(params);
  const categoriesQuery = useCategories({ limit: ADMIN_SELECT_LIMIT });
  const deleteProject = useDeleteProject();

  const projects = projectsQuery.data?.data ?? [];
  const pagination = projectsQuery.data?.pagination;
  const categories = categoriesQuery.data?.data ?? [];
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const isFiltered = q !== "" || status !== "" || category !== "";

  function resetFilters() {
    setSearch("");
    setQ("");
    setStatus("");
    setCategory("");
    setPage(1);
  }

  const columns: Column<AdminProject>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (project) => (
        <PrimaryCell
          media={
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
          }
          title={project.name[locale]}
          subtitle={`/${project.slug}`}
        />
      ),
    },
    {
      id: "category",
      header: t("table.category"),
      className: "w-40",
      cell: (project) => (
        <span className="text-ink-muted">{project.category.name[locale]}</span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      className: "w-32",
      cell: (project) => <StatusBadge status={project.status} />,
    },
    {
      id: "order",
      header: t("table.order"),
      align: "end",
      className: "w-20",
      cell: (project) => (
        <span className="text-ink-muted">{project.order}</span>
      ),
    },
  ];

  const liveLink = (project: AdminProject) =>
    project.links.find((link) => link.type === "live")?.url;

  const loadError =
    projectsQuery.error instanceof ApiError
      ? projectsQuery.error.message
      : undefined;

  return (
    <>
      <Panel flush>
        <TableToolbar
          search={
            <TextInput
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
            />
          }
          filters={
            <>
              <SelectInput
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as "" | ProjectStatus);
                  setPage(1);
                }}
                aria-label={t("table.status")}
                className="w-36"
              >
                <option value="">{t("allStatuses")}</option>
                <option value="published">{tCommon("statusPublished")}</option>
                <option value="draft">{tCommon("statusDraft")}</option>
              </SelectInput>

              <SelectInput
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                aria-label={t("table.category")}
                className="w-44"
              >
                <option value="">{t("allCategories")}</option>
                {categories.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name[locale]}
                  </option>
                ))}
              </SelectInput>
            </>
          }
        />

        {projectsQuery.isPending && !projectsQuery.data ? (
          <div className="flex flex-col gap-3 px-4 py-6" aria-busy>
            <span className="sr-only">{tCommon("loading")}</span>
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-surface-3"
              />
            ))}
          </div>
        ) : projectsQuery.isError ? (
          <EmptyState
            icon={FolderKanban}
            title={tCommon("loadError", {
              message: loadError ?? tCommon("noResults"),
            })}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={projects}
              rowKey={(project) => project._id}
              actionsLabel={tCommon("actions")}
              empty={
                <EmptyState
                  icon={FolderKanban}
                  title={isFiltered ? tCommon("noMatches") : t("emptyTitle")}
                  description={
                    isFiltered ? tCommon("noMatchesHint") : t("emptyDescription")
                  }
                  action={
                    isFiltered ? (
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        {tCommon("clearFilters")}
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" href="/admin/projects/new">
                        {t("addNew")}
                      </Button>
                    )
                  }
                />
              }
              rowActions={(project) => {
                const live = liveLink(project);

                return (
                  <>
                    {live && (
                      <IconButton
                        size="sm"
                        href={live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("viewLive")}
                      >
                        <ExternalLink aria-hidden />
                      </IconButton>
                    )}
                    <IconButton
                      size="sm"
                      href={`/admin/projects/${project._id}`}
                      aria-label={tCommon("edit")}
                    >
                      <Pencil aria-hidden />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="danger"
                      aria-label={tCommon("delete")}
                      onClick={() => setPendingDelete(project)}
                    >
                      <Trash2 aria-hidden />
                    </IconButton>
                  </>
                );
              }}
            />

            {projects.length > 0 && pagination && (
              <Pagination
                page={pagination.page}
                limit={limit}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onLimitChange={(next) => {
                  setLimit(next);
                  setPage(1);
                }}
              />
            )}
          </>
        )}
      </Panel>

      <DeleteConfirmDialog
        open={pendingDelete !== null}
        loading={deleteProject.isPending}
        onOpenChange={(open) => {
          if (!open && !deleteProject.isPending) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteProject.mutate(pendingDelete._id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
        itemName={pendingDelete?.name[locale]}
      />
    </>
  );
}
