import { useEffect, useState } from "react";

import { ADMIN_PAGE_SIZE } from "@/constants/Admin";
import type { ListControls } from "@/types/Admin";

/**
 * The search/paging/filter state behind every admin grid, in one place.
 *
 * All three tables (projects, categories, users) were carrying the same six
 * pieces of state, the same debounce effect and the same `params` assembly.
 * The duplication that mattered was not the line count: each filter's
 * `onChange` also had to remember `setPage(1)` by hand, and forgetting it
 * leaves a user on page 3 looking at "no results" for a filter whose matches
 * are all on page 1. `setFilter` and `setLimit` own that reset here, so the
 * mistake is no longer available to make.
 *
 * Deliberately *not* used by the public `ProjectsBrowser`: that one runs on
 * `useInfiniteQuery` with a single category tab and no search or paging, so it
 * shares the words but none of the behaviour.
 */

const SEARCH_DEBOUNCE_MS = 300;

export function useListControls<TFilters extends Record<string, string>>(
  initialFilters: TFilters,
): ListControls<TFilters> {
  // Frozen on the first render: callers pass an object literal, which is a new
  // value every render and would make `reset` depend on whichever one it last
  // happened to close over.
  const [defaults] = useState(initialFilters);

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<TFilters>(defaults);
  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(ADMIN_PAGE_SIZE);

  // Debounced so a request isn't fired on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  function setFilter<K extends keyof TFilters>(key: K, value: TFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function setLimit(next: number) {
    setLimitState(next);
    setPage(1);
  }

  function reset() {
    setSearch("");
    setQ("");
    setFilters(defaults);
    setPage(1);
  }

  // `""` is the UI's "no filter"; the API wants the key absent instead, since
  // `?status=` fails its validation rather than matching everything.
  const active = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== ""),
  ) as ListControls<TFilters>["params"];

  return {
    search,
    setSearch,
    filters,
    setFilter,
    page,
    setPage,
    limit,
    setLimit,
    params: { page, limit, ...(q !== "" ? { q } : {}), ...active },
    isFiltered: q !== "" || Object.keys(active).length > 0,
    reset,
  };
}
