import { api } from "@/lib/Api";
import type { PageInfo, Paginated } from "@/types/Shared";
import type { ProjectFormValues } from "../schemas/Projects";
import type { Project, ProjectsQueryParams } from "../types/Projects";
import { buildProjectFormData } from "../utils/Projects";

export const getProjects = async (
  params?: ProjectsQueryParams,
): Promise<Paginated<Project>> => {
  const { data } = await api.get<{
    success: boolean;
    data: Project[];
    pagination: PageInfo;
  }>("/projects", { params });
  return { data: data.data, pagination: data.pagination };
};

/**
 * `GET /api/projects/:idOrSlug` accepts either an `_id` or a `slug` — the
 * backend tells them apart by shape, so passing an `_id` here just works.
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const { data } = await api.get<{ success: boolean; data: Project }>(
    `/projects/${id}`,
  );
  return data.data;
};

/** `values` is the full form; a new project always sends every field. */
export const createProject = async (
  values: ProjectFormValues,
  galleryFiles: File[],
): Promise<Project> => {
  const formData = buildProjectFormData(values, galleryFiles);
  const { data } = await api.post<{ success: boolean; data: Project }>(
    "/projects",
    formData,
  );
  return data.data;
};

/**
 * `values` is only the changed fields — `PATCH` leaves everything else
 * (including the existing cover image) untouched, and `gallery` files here
 * are appended after whatever is already stored, never a replacement.
 */
export const updateProject = async (
  id: string,
  values: Partial<ProjectFormValues>,
  galleryFiles: File[],
): Promise<Project> => {
  const formData = buildProjectFormData(values, galleryFiles);
  const { data } = await api.patch<{ success: boolean; data: Project }>(
    `/projects/${id}`,
    formData,
  );
  return data.data;
};

/** Hard delete — a project has no downstream references or audit-history requirement. */
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

/** Removes exactly one gallery image; the rest of the gallery is untouched. */
export const deleteProjectGalleryImage = async (
  projectId: string,
  imageId: string,
): Promise<Project> => {
  const { data } = await api.delete<{ success: boolean; data: Project }>(
    `/projects/${projectId}/gallery/${imageId}`,
  );
  return data.data;
};
