import type { ContactQueryParams } from "./types/Contact";

export const contactKeys = {
  all: ["contact"] as const,
  list: (params?: ContactQueryParams) => ["contact", "list", params] as const,
};
