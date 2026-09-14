import type { CategoryFormValues } from "../schemas/Categories";

// `categoryById()` lived here while categories came from a hardcoded array.
// Nothing looks a category up in memory now — the list comes from
// `useCategories()` and a single record from `useCategory(id)`.

/**
 * Reassembles the form's flat `nameAr`/`nameEn` fields into the bilingual
 * `{ ar, en }` object `POST`/`PATCH /api/categories` expect as JSON. Only
 * `values`' own keys are considered, so a partial `PATCH` body (say, `slug`
 * alone) doesn't send a `name` field at all.
 */
export const buildCategoryPayload = (values: Partial<CategoryFormValues>) => {
  const payload: { name?: { ar: string; en: string }; slug?: string } = {};

  if (values.nameAr !== undefined || values.nameEn !== undefined) {
    payload.name = { ar: values.nameAr ?? "", en: values.nameEn ?? "" };
  }
  if (values.slug !== undefined) payload.slug = values.slug;

  return payload;
};
