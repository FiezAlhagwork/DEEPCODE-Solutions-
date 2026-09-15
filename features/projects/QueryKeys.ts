import type { ProjectsQueryParams } from "./types/Projects";

export const projectKeys = {
  all: ["projects"] as const,
  list: (params?: ProjectsQueryParams) => ["projects", "list", params] as const,
  /**
   * Separate from `list` because an infinite query stores an accumulated
   * `{ pages, pageParams }` under its key, not a single page — sharing a key
   * with `list` would hand one shape to code expecting the other. It still
   * starts with `"projects"`, so `invalidateQueries({ queryKey: all })`
   * refreshes both.
   */
  infinite: (params?: ProjectsQueryParams) =>
    ["projects", "infinite", params] as const,
  detail: (id: string) => ["projects", "detail", id] as const,
};
