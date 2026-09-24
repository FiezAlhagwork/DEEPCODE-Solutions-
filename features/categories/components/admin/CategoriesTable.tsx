"use client";

import { Pencil, Search, Tags, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import Button from "@/components/kit/Button";
import DataTable, { PrimaryCell } from "@/components/kit/DataTable";
import EmptyState from "@/components/kit/EmptyState";
import IconButton from "@/components/kit/IconButton";
import Pagination from "@/components/kit/Pagination";
import { Panel } from "@/components/kit/Panel";
import TableState from "@/components/kit/TableState";
import TableToolbar from "@/components/kit/TableToolbar";
import TextInput from "@/components/kit/TextInput";
import {
  useCategories,
  useDeleteCategory,
} from "@/features/categories/hooks/UseCategories";
import type { Category } from "@/features/categories/types/Categories";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useListControls } from "@/hooks/UseListControls";
import type { Column } from "@/types/Kit";

// Same shape as the projects grid, minus the filters a category has nothing to
// filter on. Searching and paging both happen on the server: filtering the
// current page in the browser would hide matches sitting on every other page
// and report "no results" for a category that plainly exists.
export default function CategoriesTable() {
  const t = useTranslations("admin.categories");
  const tForm = useTranslations("admin.categories.form");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";

  // No filters of its own — a category has nothing to filter on — so the
  // controls are just search and paging.
  const list = useListControls({});

  const categoriesQuery = useCategories(list.params);
  const deleteCategory = useDeleteCategory();
  const remove = useConfirmedAction(deleteCategory, (c: Category) => c._id);

  const rows = categoriesQuery.data?.data ?? [];
  const pagination = categoriesQuery.data?.pagination;

  const columns: Column<Category>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (category) => (
        <PrimaryCell
          media={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface-3 text-ink-faint">
              <Tags className="size-4" aria-hidden />
            </span>
          }
          title={category.name[locale]}
          subtitle={`/${category.slug}`}
        />
      ),
    },
    {
      // The primary cell shows the name in the current locale; this column
      // carries the other language, so both halves of a bilingual record are
      // visible without opening the form.
      id: "otherLanguage",
      header: locale === "ar" ? tForm("nameEn") : tForm("nameAr"),
      className: "w-56",
      cell: (category) => (
        <span className="text-ink-muted" dir={locale === "ar" ? "ltr" : "rtl"}>
          {locale === "ar" ? category.name.en : category.name.ar}
        </span>
      ),
    },
  ];

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
        />

        <TableState
          isLoading={categoriesQuery.isPending && !categoriesQuery.data}
          error={categoriesQuery.error}
          icon={Tags}
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(category) => category._id}
            actionsLabel={tCommon("actions")}
            empty={
              <EmptyState
                icon={Tags}
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
                      href="/admin/categories/new"
                    >
                      {t("addNew")}
                    </Button>
                  )
                }
              />
            }
            rowActions={(category) => (
              <>
                <IconButton
                  size="sm"
                  href={`/admin/categories/${category._id}`}
                  aria-label={tCommon("edit")}
                >
                  <Pencil aria-hidden />
                </IconButton>
                <IconButton
                  size="sm"
                  variant="danger"
                  aria-label={tCommon("delete")}
                  onClick={() => remove.ask(category)}
                >
                  <Trash2 aria-hidden />
                </IconButton>
              </>
            )}
          />

          {rows.length > 0 && pagination && (
            <Pagination
              page={pagination.page}
              limit={list.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={list.setPage}
              onLimitChange={list.setLimit}
            />
          )}
        </TableState>
      </Panel>

      {/* The backend refuses with 409 CATEGORY_IN_USE while a project still
          references the category; `useDeleteCategory` turns that into its own
          explanatory message rather than a generic failure. */}
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
