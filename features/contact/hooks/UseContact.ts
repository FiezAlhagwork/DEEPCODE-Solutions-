import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/Api";
import { contactKeys } from "../QueryKeys";
import {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
} from "../services/Contact";
import type { ContactQueryParams, CreateContactPayload } from "../types/Contact";

/** Same test the order form uses: the backend prefixes the failed field. */
export const isContactPhoneRejection = (error: unknown): boolean =>
  error instanceof ApiError &&
  error.code === "VALIDATION_ERROR" &&
  error.message.startsWith("phone:");

/**
 * The public form's send. It shows no success toast: the form swaps itself
 * for a thank-you panel instead, which is harder to miss than a toast.
 *
 * `429` (5 an hour per IP) is matched on the status, not a code: the limiter
 * answers with express-rate-limit's plain-text default, so the `ApiError`
 * arrives with no `code`. A rejected phone is marked on its field by the form,
 * so its toast only says what went wrong in general.
 */
export const useCreateContactMessage = () => {
  const t = useTranslations("contact.form");

  return useMutation({
    mutationFn: (payload: CreateContactPayload) =>
      createContactMessage(payload),
    onError: (error) => {
      if (error instanceof ApiError && error.status === 429) {
        toast.error(t("errors.rateLimited"));
      } else if (isContactPhoneRejection(error)) {
        toast.error(t("phoneInvalid"));
      } else {
        toast.error(t("errors.genericError"));
      }
    },
  });
};

export const useContactMessages = (params?: ContactQueryParams) =>
  useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => getContactMessages(params),
  });

const PENDING_PARAMS: ContactQueryParams = {
  page: 1,
  limit: 1,
  status: "pending",
};

/**
 * How many messages are still waiting on the team — the sidebar badge and the
 * dashboard tile share it, and one request between them. It polls, like the
 * requests count, because a message arrives from a visitor rather than from
 * anything the admin does.
 */
export const usePendingContactCount = () =>
  useQuery({
    queryKey: contactKeys.list(PENDING_PARAMS),
    queryFn: () => getContactMessages(PENDING_PARAMS),
    select: (page) => page.pagination.total,
    refetchInterval: 60_000,
  });

/**
 * Takes the id alone so `useConfirmedAction` can drive its dialog. Refreshing
 * `contactKeys.all` updates the table, the badge and the tile together.
 */
export const useMarkMessageContacted = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("admin.messages.messages");

  return useMutation({
    mutationFn: (id: string) => updateContactStatus(id, "contacted"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      toast.success(t("contacted"));
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) {
        toast.error(t("genericError"));
      } else if (error.status === 404) {
        // Gone since the list was fetched — refresh so the row goes too.
        queryClient.invalidateQueries({ queryKey: contactKeys.all });
        toast.error(t("notFound"));
      } else {
        toast.error(error.message || t("genericError"));
      }
    },
  });
};
