import type { ProjectFormValues } from "../schemas/Projects";
import type { Project } from "../types/Projects";

/**
 * Dashboard helpers. These used to run inline inside `app/[locale]/admin/page.tsx`,
 * which contradicts the rule that `app/` holds routes only, with no business
 * logic of their own.
 */

export const countPublished = (projects: Project[]) =>
  projects.filter((project) => project.status === "published").length;

/** The first `limit` projects in display order, for the dashboard's recent list. */
export const recentProjects = (projects: Project[], limit = 5) =>
  [...projects].sort((a, b) => a.order - b.order).slice(0, limit);

/**
 * Builds the `multipart/form-data` body `POST`/`PATCH /api/projects` expect,
 * from the form's flat `nameAr`/`nameEn`-split values plus the gallery files
 * tracked separately as component state (see `ProjectForm`'s `onSubmit`
 * comment, which this replaces). Bilingual fields go over as a single
 * JSON-stringified form field, not `name[ar]`/`name[en]` bracket notation —
 * that's what the backend's `normalizeProjectMultipart` middleware expects.
 *
 * `values` is a `Partial<ProjectFormValues>` so the same builder serves both
 * create (all fields present) and update (only the changed ones) — `PATCH`
 * treats an omitted `coverImage` as "keep the existing image" and omitted
 * `gallery` files as "don't add any", never as "clear the field".
 */
export const buildProjectFormData = (
  values: Partial<ProjectFormValues>,
  galleryFiles: File[],
) => {
  const formData = new FormData();

  if (values.nameAr !== undefined || values.nameEn !== undefined) {
    formData.append(
      "name",
      JSON.stringify({ ar: values.nameAr ?? "", en: values.nameEn ?? "" }),
    );
  }
  if (values.descriptionAr !== undefined || values.descriptionEn !== undefined) {
    formData.append(
      "description",
      JSON.stringify({
        ar: values.descriptionAr ?? "",
        en: values.descriptionEn ?? "",
      }),
    );
  }
  if (values.slug !== undefined) formData.append("slug", values.slug);
  if (values.categoryId !== undefined) formData.append("category", values.categoryId);
  if (values.status !== undefined) formData.append("status", values.status);
  if (values.order !== undefined) formData.append("order", String(values.order));
  if (values.links !== undefined) formData.append("links", JSON.stringify(values.links));

  if (values.coverImage instanceof File) {
    formData.append("coverImage", values.coverImage);
  }
  for (const file of galleryFiles) formData.append("gallery", file);

  return formData;
};
