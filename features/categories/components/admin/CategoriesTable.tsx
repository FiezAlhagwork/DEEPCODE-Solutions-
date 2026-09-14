"use client";

import { useEffect, useState } from "react";
import { Pencil, Search, Tags, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import Button from "@/components/admin/ui/Button";
import DataTable, { PrimaryCell } from "@/components/admin/ui/DataTable";
import EmptyState from "@/components/admin/ui/EmptyState";
import IconButton from "@/components/admin/ui/IconButton";
import Pagination from "@/components/admin/ui/Pagination";
import { Panel } from "@/components/admin/ui/Panel";
import TableToolbar from "@/components/admin/ui/TableToolbar";
import TextInput from "@/components/admin/ui/TextInput";
import { ADMIN_PAGE_SIZE } from "@/constants/Admin";
import {
  useCategories,
  useDeleteCategory,
} from "@/features/categories/hooks/UseCategories";
import type { Category } from "@/features/categories/types/Categories";
import { ApiError } from "@/lib/Api";
import type { Column } from "@/types/AdminUi";

// Same shape as the projects grid, minus the filters a category has nothing to
// filter on. Searching and paging both happen on the server: filtering the
// current page in the browser would hide matches sitting on every other page
// and report "no results" for a category that plainly exists.
export default function CategoriesTable() {
  const t = useTranslations("admin.categories");
  const tForm = useTranslations("admin.categories.form");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale() as "ar" | "en";

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ADMIN_PAGE_SIZE);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  // Debounced so a request isn't fired on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const categoriesQuery = useCategories({
    page,
    limit,
    ...(q !== "" ? { q } : {}),
  });
  const deleteCategory = useDeleteCategory();

  const rows = categoriesQuery.data?.data ?? [];
  const pagination = categoriesQuery.data?.pagination;
  const loadError =
    categoriesQuery.error instanceof ApiError
      ? categoriesQuery.error.message
      : undefined;

  function resetSearch() {
    setSearch("");
    setQ("");
    setPage(1);
  }

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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
            />
          }
        />

        {categoriesQuery.isPending && !categoriesQuery.data ? (
          <div className="flex flex-col gap-3 px-4 py-6" aria-busy>
            <span className="sr-only">{tCommon("loading")}</span>
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-surface-3"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <EmptyState
            icon={Tags}
            title={tCommon("loadError", {
              message: loadError ?? tCommon("noResults"),
            })}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(category) => category._id}
              actionsLabel={tCommon("actions")}
              empty={
                <EmptyState
                  icon={Tags}
                  title={q !== "" ? tCommon("noMatches") : t("emptyTitle")}
                  description={
                    q !== "" ? tCommon("noMatchesHint") : t("emptyDescription")
                  }
                  action={
                    q !== "" ? (
                      <Button variant="outline" size="sm" onClick={resetSearch}>
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
                    onClick={() => setPendingDelete(category)}
                  >
                    <Trash2 aria-hidden />
                  </IconButton>
                </>
              )}
            />

            {rows.length > 0 && pagination && (
              <Pagination
                page={pagination.page}
                limit={limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
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

      {/* The backend refuses with 409 CATEGORY_IN_USE while a project still
          references the category; `useDeleteCategory` turns that into its own
          explanatory message rather than a generic failure. */}
      <DeleteConfirmDialog
        open={pendingDelete !== null}
        loading={deleteCategory.isPending}
        onOpenChange={(open) => {
          if (!open && !deleteCategory.isPending) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteCategory.mutate(pendingDelete._id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
        itemName={pendingDelete?.name[locale]}
      />
    </>
  );
}
