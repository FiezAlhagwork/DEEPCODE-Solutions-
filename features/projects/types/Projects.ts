import type { Category } from "@/features/categories/types/Categories";
import type { ListQueryParams, LocalizedText } from "@/types/Shared";

export type Project = {
  id: number;
  title: string;
  year: string;
  tags: string[];
  image: string;
  color: string;
  link: string;
};

export type ProjectCardProps = {
  project: Project;
};

export type ProjectListProps = {
  projects: Project[];
};

// --- Admin dashboard shape -------------------------------------------------
// `Project` above is the public site's current simplified mock; the admin
// dashboard is modeled on the real backend schema instead, since that is
// what it will eventually read/write once the API is wired up. The two will
// be reconciled — and the public feature migrated onto the real API — in a
// later phase (see CLAUDE.md: Projects is "structure ready, backend not
// wired"). Keeping them separate for now avoids breaking the live public
// site while the admin UI is designed against the true shape.

export type ProjectStatus = "draft" | "published";

/**
 * `_id` identifies the item for `DELETE /api/projects/:id/gallery/:imageId`,
 * and `publicId` is what Cloudinary cleanup needs; the form itself only ever
 * sends `image`/`order` when writing.
 *
 * `_id` is optional on purpose even though the API does send it for every
 * record it creates: a gallery item without one has been seen in this
 * database, and typing it as required let that case through as a `key` of
 * `undefined` (a React warning) and, far worse, a delete request to
 * `.../gallery/undefined`. Optional forces both to be handled.
 */
export type ProjectGalleryImage = {
  _id?: string;
  image: string;
  publicId?: string;
  order: number;
};

export type ProjectLink = {
  type: string;
  url: string;
};

/** `status` is honored by the API only for a caller who can already see drafts. */
export type ProjectsQueryParams = ListQueryParams & {
  category?: string;
  status?: ProjectStatus;
};

export type AdminProject = {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  coverImage: string;
  gallery: ProjectGalleryImage[];
  links: ProjectLink[];
  /**
   * The API returns the category already populated on reads, so the table can
   * render its name directly instead of joining against a separate list. Writes
   * send only the id back, in a `category` form field.
   */
  category: Category;
  status: ProjectStatus;
  order: number;
};

// --- Admin component props -------------------------------------------------

export type ProjectFormProps = {
  /** When set, the form loads that record and PATCHes it; omit for create. */
  projectId?: string;
};

/** A gallery image picked in the form, plus the object URL previewing it. */
export type GalleryItem = {
  id: string;
  file: File;
  url: string;
};
