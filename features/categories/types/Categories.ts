import type { ListQueryParams, LocalizedText } from "@/types/Shared";

/**
 * Mirrors the backend's `Category` model exactly: a bilingual name and a
 * manually-entered, unique, lowercase-kebab `slug`. There is deliberately no
 * `description` — the backend doesn't store one.
 */
export type Category = {
  _id: string;
  name: LocalizedText;
  slug: string;
};

export type CategoriesQueryParams = ListQueryParams;

// --- Admin component props -------------------------------------------------

export type CategoryFormProps = {
  /** When set, the form loads that record and PATCHes it; omit for create. */
  categoryId?: string;
};
