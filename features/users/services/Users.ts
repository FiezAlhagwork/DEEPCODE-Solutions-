import { api } from "@/lib/Api";
import type { PageInfo, Paginated } from "@/types/Shared";
import type {
  AdminUser,
  AdminUserStatus,
  ChangeUserRolePayload,
  InviteUserPayload,
  InviteUserResult,
  UsersQueryParams,
} from "../types/Users";

export const getUsers = async (
  params?: UsersQueryParams,
): Promise<Paginated<AdminUser>> => {
  const { data } = await api.get<{
    success: boolean;
    data: AdminUser[];
    pagination: PageInfo;
  }>("/users", { params });
  return { data: data.data, pagination: data.pagination };
};

/** `POST /api/users` — `super_admin` only. There is no separate `/invite` path. */
export const inviteUser = async (
  payload: InviteUserPayload,
): Promise<InviteUserResult> => {
  const { data } = await api.post<{ success: boolean; data: InviteUserResult }>(
    "/users",
    payload,
  );
  return data.data;
};

/** `id` is the Mongo `_id`, not the Clerk `clerkId`. `super_admin` only. */
export const changeUserRole = async (
  id: string,
  payload: ChangeUserRolePayload,
): Promise<AdminUser> => {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    `/users/${id}/role`,
    payload,
  );
  return data.data;
};

/** Soft-delete: sets `status: "deactivated"`, never touches the Clerk account. `super_admin` only. */
export const deactivateUser = async (
  id: string,
): Promise<{ _id: string; status: AdminUserStatus }> => {
  const { data } = await api.delete<{
    success: boolean;
    data: { _id: string; status: AdminUserStatus };
  }>(`/users/${id}`);
  return data.data;
};
