import { api } from "@/lib/Api";
import type { PageInfo, Paginated } from "@/types/Shared";
import type { CategoryFormValues } from "../schemas/Categories";
import type { Category, CategoriesQueryParams } from "../types/Categories";
import { buildCategoryPayload } from "../utils/Categories";

export const getCategories = async (
  params?: CategoriesQueryParams,
): Promise<Paginated<Category>> => {
  const { data } = await api.get<{
    success: boolean;
    data: Category[];
    pagination: PageInfo;
  }>("/categories", { params });
  return { data: data.data, pagination: data.pagination };
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await api.get<{ success: boolean; data: Category }>(
    `/categories/${id}`,
  );
  return data.data;
};

export const createCategory = async (
  values: CategoryFormValues,
): Promise<Category> => {
  const { data } = await api.post<{ success: boolean; data: Category }>(
    "/categories",
    buildCategoryPayload(values),
  );
  return data.data;
};

export const updateCategory = async (
  id: string,
  values: Partial<CategoryFormValues>,
): Promise<Category> => {
  const { data } = await api.patch<{ success: boolean; data: Category }>(
    `/categories/${id}`,
    buildCategoryPayload(values),
  );
  return data.data;
};

/** The backend rejects this with `409 CATEGORY_IN_USE` while any project still references it. */
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
