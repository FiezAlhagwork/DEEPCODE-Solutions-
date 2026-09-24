import { api } from "@/lib/Api";
import type { PageInfo, Paginated } from "@/types/Shared";
import type {
  CreateRequestPayload,
  PlanRequest,
  RequestsQueryParams,
} from "../types/Requests";

/**
 * `GET /api/requests`. What comes back depends on who asks, decided on the
 * server: a customer gets only their own requests, an `admin`/`super_admin`
 * gets everyone's — no query parameter changes that. It is why an admin who
 * opens the customer's "my requests" page is sent to the panel instead.
 */
export const getRequests = async (
  params?: RequestsQueryParams,
): Promise<Paginated<PlanRequest>> => {
  const { data } = await api.get<{
    success: boolean;
    data: PlanRequest[];
    pagination: PageInfo;
  }>("/requests", { params });
  return { data: data.data, pagination: data.pagination };
};

/**
 * `POST /api/requests`. Any signed-in account may call it, capped at 10 a day
 * per account. The response's `user` is the raw id, not the populated object
 * the list returns — nothing here reads it, so it is typed as the list shape
 * only where the list is involved.
 */
export const createRequest = async (
  payload: CreateRequestPayload,
): Promise<{ _id: string }> => {
  const { data } = await api.post<{ success: boolean; data: { _id: string } }>(
    "/requests",
    payload,
  );
  return data.data;
};

