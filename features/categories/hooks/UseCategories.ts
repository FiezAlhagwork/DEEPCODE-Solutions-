import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/Api";
import { projectKeys } from "@/features/projects/QueryKeys";
import { categoryKeys } from "../QueryKeys";
import type { CategoryFormValues } from "../schemas/Categories";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/Categories";
import type { CategoriesQueryParams } from "../types/Categories";

/**
 * Unlike the projects and users hooks, these toasts are translated. A custom
 * hook is still a hook, so `useTranslations` works here exactly as it does in
 * a component — the original reason for hardcoding English ("a hook file can't
 * reach a translator") simply wasn't true. See the Decisions Log.
 */
const useCategoryMessages = () => useTranslations("admin.categories.messages");

type CategoryMessages = ReturnType<typeof useCategoryMessages>;

/**
 * Two backend failures are hit by accident rather than by mistake, and both
 * deserve an explanation of what to do next instead of the raw English
 * sentence the API sends: deleting a category some project still points at
 * (`409 CATEGORY_IN_USE`), and reusing a slug (`409 DUPLICATE_KEY` — slug is
 * the only unique field on a category, so the code alone identifies it).
 *
 * Anything else falls back to the backend's own message, which is specific
 * (a failed validation rule, say) and therefore more useful than a blanket
 * "something went wrong". Only a non-`ApiError` — a thrown string, a bug in
 * our own code — gets the generic line.
 */
export const categoryErrorMessage = (
  error: unknown,
  t: CategoryMessages,
): string => {
  if (!(error instanceof ApiError)) return t("genericError");
  if (error.code === "CATEGORY_IN_USE") return t("inUse");
  if (error.code === "DUPLICATE_KEY") return t("duplicateSlug");
  return error.message || t("genericError");
};

export const useCategories = (params?: CategoriesQueryParams) =>
  useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
  });

export const useCategory = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: id.length > 0,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const t = useCategoryMessages();

  return useMutation({
    mutationFn: (values: CategoryFormValues) => createCategory(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(t("created"));
    },
    onError: (error) => {
      toast.error(categoryErrorMessage(error, t));
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const t = useCategoryMessages();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<CategoryFormValues>;
    }) => updateCategory(id, values),
    onSuccess: () => {
      // Project rows show the populated category name — a rename here would
      // otherwise sit stale in an already-cached project list.
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(t("updated"));
    },
    onError: (error) => {
      toast.error(categoryErrorMessage(error, t));
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const t = useCategoryMessages();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(categoryErrorMessage(error, t));
    },
  });
};
