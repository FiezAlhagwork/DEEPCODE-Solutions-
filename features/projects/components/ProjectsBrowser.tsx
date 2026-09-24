"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/features/categories/hooks/UseCategories";
import { useInfiniteProjects } from "@/features/projects/hooks/UseProjects";
import type { Locale } from "@/i18n/routing";
import ProjectList from "./ProjectList";

/** The value of the "all" tab. Empty would collide with a real category id. */
const ALL = "all";

/** One request's worth of projects; "load more" appends another. */
const PAGE_SIZE = 24;

// The projects archive, built on the same `Tabs` primitive as the VPS page so
// the two browse experiences on this site look like one thing.
//
// Switching a tab changes the request, not a filter over data already held:
// the API takes `category`, and filtering the page in memory would hide every
// project that happens to sit on a later page.
export default function ProjectsBrowser() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const [category, setCategory] = useState(ALL);

  // One request for the tab strip; a site is never going to have enough
  // categories to page through.
  const categoriesQuery = useCategories({ page: 1, limit: 100 });
  const categories = categoriesQuery.data?.data ?? [];

  // `status` for the same reason as the home section: this request carries the
  // signed-in admin's token, and the backend hands drafts to anyone holding
  // one. The public archive must answer the same for everybody.
  const projectsQuery = useInfiniteProjects({
    limit: PAGE_SIZE,
    status: "published",
    ...(category !== ALL ? { category } : {}),
  });

  const projects =
    projectsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const isLoading = projectsQuery.isPending && !projectsQuery.data;

  return (
    <>
      {categories.length > 0 && (
        <Tabs
          value={category}
          onValueChange={setCategory}
          // The strip scrolls on its own when there are more categories than
          // fit; the page itself must never scroll sideways. `overflow-y-hidden`
          // because `overflow-x-auto` alone turns the other axis to `auto` too,
          // which can draw a stray vertical scrollbar. The horizontal one stays
          // on purpose: it is the only hint that more categories exist.
          className="mb-10 w-full overflow-x-auto overflow-y-hidden pb-1"
        >
          <TabsList className="mx-auto w-fit">
            <TabsTrigger value={ALL}>{t("allCategories")}</TabsTrigger>
            {categories.map((item) => (
              <TabsTrigger key={item._id} value={item._id}>
                {item.name[locale]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-busy
        >
          <span className="sr-only">{t("loading")}</span>
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-3xl bg-white/5 md:h-80"
            />
          ))}
        </div>
      ) : projectsQuery.isError ? (
        <p className="text-center text-sm text-muted-foreground">
          {t("loadError")}
        </p>
      ) : projects.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          {category === ALL ? t("empty") : t("emptyCategory")}
        </p>
      ) : (
        <>
          {/* Keyed by the active tab so the entry animation replays on a
              switch instead of the new set appearing already settled. */}
          <ProjectList key={category} projects={projects} />

          {projectsQuery.hasNextPage && (
            <div className="mt-12 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                disabled={projectsQuery.isFetchingNextPage}
                onClick={() => projectsQuery.fetchNextPage()}
              >
                {projectsQuery.isFetchingNextPage
                  ? t("loading")
                  : t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
