import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/Api";
import { requestKeys } from "../QueryKeys";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../services/Requests";
import type {
  CreateRequestPayload,
  RequestsQueryParams,
} from "../types/Requests";

/** Translated toasts, same as the categories, users and account hooks. */
const useRequestMessages = () => useTranslations("requests.messages");

type RequestMessages = ReturnType<typeof useRequestMessages>;

/** Same pause `getMyProfileWithRetry` uses for the same webhook gap. */
const NOT_SYNCED_RETRY_MS = 1500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The backend's validation messages are English and prefixed with the field
 * that failed (`"phone: Invalid phone number…"`). The phone is the one field
 * a customer can get wrong in a way only the server can tell — a number with
 * the right length that doesn't exist in that country — so it is picked out
 * and shown under the field, translated.
 */
export const isPhoneRejection = (error: unknown): boolean =>
  error instanceof ApiError &&
  error.code === "VALIDATION_ERROR" &&
  error.message.startsWith("phone:");

/**
 * Three failures get an explanation instead of the backend's sentence:
 *
 * - `429`, the 10-a-day cap. It is matched on the **status**: the limiter
 *   answers with express-rate-limit's default plain-text body, not the API's
 *   JSON envelope, so the `ApiError` arrives with no `code` at all.
 * - `409 ACCOUNT_NOT_SYNCED`, only once the automatic retry has also failed.
 * - a rejected phone number, which the form also marks on the field.
 *
 * Anything else shows the backend's own message, which names the failed rule.
 */
export const requestErrorMessage = (
  error: unknown,
  t: RequestMessages,
): string => {
  if (!(error instanceof ApiError)) return t("genericError");
  if (error.status === 429) return t("rateLimited");
  if (error.code === "ACCOUNT_NOT_SYNCED") return t("notSynced");
  if (isPhoneRejection(error)) return t("invalidPhone");
  return error.message || t("genericError");
};

export const useRequests = (params?: RequestsQueryParams) =>
  useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => getRequests(params),
  });

/**
 * How many requests are still waiting on the team — the sidebar badge and the
 * dashboard tile both read it. One row is fetched and `pagination.total` read,
 * like every other dashboard count; the two callers share the key, so they
 * share one request.
 *
 * The one query in the panel that polls: a new request arrives from a
 * customer, not from anything the admin does, so nothing else would ever
 * invalidate it. A minute is often enough for a lead that is followed up by
 * phone.
 */
const PENDING_PARAMS: RequestsQueryParams = {
  page: 1,
  limit: 1,
  status: "pending",
};

export const usePendingRequestsCount = () =>
  useQuery({
    queryKey: requestKeys.list(PENDING_PARAMS),
    queryFn: () => getRequests(PENDING_PARAMS),
    select: (page) => page.pagination.total,
    refetchInterval: 60_000,
  });

/** Translated toasts for the team's side, apart from the customer's. */
const useAdminRequestMessages = () =>
  useTranslations("admin.requests.messages");

/**
 * Takes the id alone so it satisfies `ConfirmableMutation` and
 * `useConfirmedAction` can drive its dialog, like deleting a project or
 * deactivating a user. Invalidating `requestKeys.all` refreshes the table, the
 * sidebar badge and the dashboard tile together.
 */
export const useMarkContacted = () => {
  const queryClient = useQueryClient();
  const t = useAdminRequestMessages();

  return useMutation({
    mutationFn: (id: string) => updateRequestStatus(id, "contacted"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      toast.success(t("contacted"));
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) {
        toast.error(t("genericError"));
      } else if (error.status === 404) {
        // Gone since the list was fetched — refresh so the row goes too.
        queryClient.invalidateQueries({ queryKey: requestKeys.all });
        toast.error(t("notFound"));
      } else {
        toast.error(error.message || t("genericError"));
      }
    },
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const t = useRequestMessages();

  return useMutation({
    mutationKey: requestKeys.create(),
    mutationFn: async (payload: CreateRequestPayload) => {
      try {
        return await createRequest(payload);
      } catch (error) {
        // Someone who signs up in order to place this very request can beat
        // Clerk's `user.created` webhook here, and the backend has nothing to
        // attribute the request to yet. That gap closes on its own within a
        // second or two, so one quiet retry turns the most likely first-order
        // failure into a success instead of an error message.
        if (error instanceof ApiError && error.code === "ACCOUNT_NOT_SYNCED") {
          await wait(NOT_SYNCED_RETRY_MS);
          return createRequest(payload);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      toast.success(t("submitted"));
    },
    onError: (error) => {
      toast.error(requestErrorMessage(error, t));
    },
  });
};
