import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/Api";
import { projectKeys } from "../QueryKeys";
import type { ProjectFormValues } from "../schemas/Projects";
import {
  createProject,
  deleteProject,
  deleteProjectGalleryImage,
  getProjectById,
  getProjects,
  updateProject,
} from "../services/Projects";
import type { ProjectsQueryParams } from "../types/Projects";

export const useProjects = (params?: ProjectsQueryParams) =>
  useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params),
    placeholderData: keepPreviousData,
  });

export const useProject = (id: string) =>
  useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: id.length > 0,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      galleryFiles,
    }: {
      values: ProjectFormValues;
      galleryFiles: File[];
    }) => createProject(values, galleryFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
      galleryFiles,
    }: {
      id: string;
      values: Partial<ProjectFormValues>;
      galleryFiles: File[];
    }) => updateProject(id, values, galleryFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    },
  });
};

export const useDeleteProjectGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      imageId,
    }: {
      projectId: string;
      imageId: string;
    }) => deleteProjectGalleryImage(projectId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Image removed successfully");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    },
  });
};
