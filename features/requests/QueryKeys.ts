import type { RequestsQueryParams } from "./types/Requests";

export const requestKeys = {
  all: ["requests"] as const,
  list: (params?: RequestsQueryParams) => ["requests", "list", params] as const,
  /**
   * A mutation key, not a query key: the order modal's footer button reads the
   * submit's pending state through `useIsMutating` with it, so the form inside
   * the modal doesn't have to report its own state upwards.
   */
  create: () => ["requests", "create"] as const,
};
