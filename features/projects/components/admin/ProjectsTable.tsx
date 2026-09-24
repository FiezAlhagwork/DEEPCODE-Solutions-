"use client";

import Image from "next/image";
import {
  ExternalLink,
  FolderKanban,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/kit/Button";
import DataTable, { PrimaryCell } from "@/components/kit/DataTable";
import EmptyState from "@/components/kit/EmptyState";
import IconButton from "@/components/kit/IconButton";
import Pagination from "@/components/kit/Pagination";
import { Panel } from "@/components/kit/Panel";
import SelectInput from "@/components/kit/SelectInput";
import TableState from "@/components/kit/TableState";
import TableToolbar from "@/components/kit/TableToolbar";
import TextInput from "@/components/kit/TextInput";
import { ADMIN_SELECT_LIMIT } from "@/constants/Admin";
import { useCategories } from "@/features/categories/hooks/UseCategories";
import {
  useDeleteProject,
  useProjects,
} from "@/features/projects/hooks/UseProjects";
import type {
  Project,
  ProjectTableFilters,
} from "@/features/projects/types/Projects";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useListControls } from "@/hooks/UseListControls";
import { cloudinaryLoader } from "@/lib/CloudinaryLoader";
import type { Column } from "@/types/Kit";

export default function ProjectsTable() {
  const t = useTranslations("admin.projects");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";

  const list = useListControls<ProjectTableFilters>({
    status: "",
    category: "",
  });

  const projectsQuery = useProjects(list.params);
  const categoriesQuery = useCategories({ limit: ADMIN_SELECT_LIMIT });
  const deleteProject = useDeleteProject();
  const remove = useConfirmedAction(deleteProject, (p: Project) => p._id);

  const projects = projectsQuery.data?.data ?? [];
  const pagination = projectsQuery.data?.pagination;
  const categories = categoriesQuery.data?.data ?? [];
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const columns: Column<Project>[] = [
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

  const liveLink = (project: Project) =>
    project.links.find((link) => link.type === "live")?.url;

  return (
    <>
      <Panel flush>
        <TableToolbar
          search={
            <TextInput
              icon={Search}
              value={list.search}
              onChange={(event) => list.setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
            />
          }
          filters={
            <>
              <SelectInput
                value={list.filters.status}
                onChange={(event) =>
                  list.setFilter(
                    "status",
                    // The options below are the only values this can produce.
                    event.target.value as ProjectTableFilters["status"],
                  )
                }
                aria-label={t("table.status")}
                className="w-36"
              >
                <option value="">{t("allStatuses")}</option>
                <option value="published">{tCommon("statusPublished")}</option>
                <option value="draft">{tCommon("statusDraft")}</option>
              </SelectInput>

              <SelectInput
                value={list.filters.category}
                onChange={(event) =>
                  list.setFilter("category", event.target.value)
                }
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

        <TableState
          isLoading={projectsQuery.isPending && !projectsQuery.data}
          error={projectsQuery.error}
          icon={FolderKanban}
        >
          <DataTable
            columns={columns}
            rows={projects}
            rowKey={(project) => project._id}
            actionsLabel={tCommon("actions")}
            empty={
              <EmptyState
                icon={FolderKanban}
                title={list.isFiltered ? tCommon("noMatches") : t("emptyTitle")}
                description={
                  list.isFiltered
                    ? tCommon("noMatchesHint")
                    : t("emptyDescription")
                }
                action={
                  list.isFiltered ? (
                    <Button variant="outline" size="sm" onClick={list.reset}>
                      {tCommon("clearFilters")}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      href="/admin/projects/new"
                    >
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
                    onClick={() => remove.ask(project)}
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
              limit={list.limit}
              total={total}
              totalPages={totalPages}
              onPageChange={list.setPage}
              onLimitChange={list.setLimit}
            />
          )}
        </TableState>
      </Panel>

      <DeleteConfirmDialog
        open={remove.target !== null}
        loading={remove.isPending}
        onOpenChange={(open) => {
          if (!open) remove.dismiss();
        }}
        onConfirm={remove.confirm}
        itemName={remove.target?.name[locale]}
      />
    </>
  );
}
