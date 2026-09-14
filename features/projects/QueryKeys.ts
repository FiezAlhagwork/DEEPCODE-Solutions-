import type { ProjectsQueryParams } from "./types/Projects";

export const projectKeys = {
  all: ["projects"] as const,
  list: (params?: ProjectsQueryParams) => ["projects", "list", params] as const,
  detail: (id: string) => ["projects", "detail", id] as const,
};
