import type { Category, Type } from "./types/Hosting";

export const productKeys = {
  all: ["products"] as const,
  list: (type?: Type, category?: Category) =>
    ["products", type, category] as const,
};
