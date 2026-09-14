import type { CategoriesQueryParams } from "./types/Categories";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: CategoriesQueryParams) => ["categories", "list", params] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};
