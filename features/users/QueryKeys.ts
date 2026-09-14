import type { UsersQueryParams } from "./types/Users";

export const userKeys = {
  all: ["users"] as const,
  list: (params?: UsersQueryParams) => ["users", "list", params] as const,
};
