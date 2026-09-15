import type { Category } from "@/features/categories/types/Categories";
import type { ListQueryParams, LocalizedText } from "@/types/Shared";

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

/**
 * The backend's `Project`, and the only project shape in the codebase — the
 * public site and the admin panel render the same records now. It used to be
 * `AdminProject`, sitting next to a separate hand-written `Project` mock with
 * `year`/`tags`/`color` fields the API has no equivalent for; that mock is
 * gone, so the plain name is free and the public components no longer import
 * a type called "Admin…".
 */
export type Project = {
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

// --- Public site component props -------------------------------------------

export type ProjectCardProps = {
  project: Project;
};

export type ProjectListProps = {
  projects: Project[];
};

export type ProjectCoverProps = {
  src: string;
  alt: string;
};

export type ProjectGalleryProps = {
  images: ProjectGalleryImage[];
  /** Used to build each image's `alt`, since the gallery stores no caption. */
  projectName: string;
};

export type ProjectLinksProps = {
  links: ProjectLink[];
};

export type RelatedProjectsProps = {
  projects: Project[];
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
