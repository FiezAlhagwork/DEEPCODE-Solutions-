import { api } from "@/lib/Api";
import type { LeadStatus, PageInfo, Paginated } from "@/types/Shared";
import type {
  ContactMessage,
  ContactQueryParams,
  CreateContactPayload,
} from "../types/Contact";

/**
 * `POST /api/contact` — public, no session needed, 5 an hour per IP. The
 * response is always `data: null` with `message: "Message received."`, whether
 * the message was stored or the honeypot caught a bot: the backend no longer
 * echoes the stored document, so a bot cannot tell the two apart either.
 */
export const createContactMessage = async (
  payload: CreateContactPayload,
): Promise<null> => {
  const { data } = await api.post<{
    success: boolean;
    data: null;
    message?: string;
  }>("/contact", payload);
  return data.data;
};

/** `GET /api/contact` — `admin`/`super_admin` only. */
export const getContactMessages = async (
  params?: ContactQueryParams,
): Promise<Paginated<ContactMessage>> => {
  const { data } = await api.get<{
    success: boolean;
    data: ContactMessage[];
    pagination: PageInfo;
  }>("/contact", { params });
  return { data: data.data, pagination: data.pagination };
};

/**
 * `PATCH /api/contact/:id/status` — `admin`/`super_admin` only. The panel
 * only ever moves a message forward, to `contacted`.
 */
export const updateContactStatus = async (
  id: string,
  status: LeadStatus,
): Promise<ContactMessage> => {
  const { data } = await api.patch<{ success: boolean; data: ContactMessage }>(
    `/contact/${id}/status`,
    { status },
  );
  return data.data;
};
