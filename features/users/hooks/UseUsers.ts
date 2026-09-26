import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/Api";
import { userKeys } from "../QueryKeys";
import {
  changeUserRole,
  deactivateUser,
  getUsers,
  inviteUser,
} from "../services/Users";
import type {
  ChangeUserRolePayload,
  InviteUserPayload,
  UsersQueryParams,
} from "../types/Users";

/** Translated, same as the categories hooks — see the Decisions Log. */
const useUserMessages = () => useTranslations("admin.users.messages");

type UserMessages = ReturnType<typeof useUserMessages>;

/**
 * Two backend refusals get an explanation instead of their raw English
 * sentence: `403 FORBIDDEN` (every write here is `super_admin`-only, while the
 * list is open to `admin` too) and `404 USER_NOT_FOUND` (the row was
 * deactivated from somewhere else since the list was cached).
 *
 * `502 CLERK_INVITE_FAILED` is deliberately *not* special-cased: its message is
 * Clerk's own long message, which names the actual reason — an invitation
 * already pending, an email that already has an account — and is far more
 * useful than anything generic we could write. Only a non-`ApiError` falls
 * through to the blanket line.
 */
export const userErrorMessage = (
  error: unknown,
  t: UserMessages,
): string => {
  if (!(error instanceof ApiError)) return t("genericError");
  if (error.code === "FORBIDDEN") return t("forbidden");
  if (error.code === "USER_NOT_FOUND") return t("notFound");
  // Both `409`s. The panel already withholds the actions on the viewer's own
  // row, so these are the backend's backstop showing through, not a path the
  // UI offers.
  if (error.code === "CANNOT_MODIFY_SELF") return t("cannotModifySelf");
  if (error.code === "LAST_SUPER_ADMIN") return t("lastSuperAdmin");
  return error.message || t("genericError");
};

export const useUsers = (params?: UsersQueryParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  const t = useUserMessages();

  return useMutation({
    mutationFn: (payload: InviteUserPayload) => inviteUser(payload),
    onSuccess: () => {
      // An invitation creates no local `User` document — that happens when the
      // invitee accepts and Clerk's webhook lands — so the list won't change
      // yet. Invalidated anyway so a row that appeared meanwhile isn't missed.
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(t("invited"));
    },
    onError: (error) => {
      toast.error(userErrorMessage(error, t));
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  const t = useUserMessages();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ChangeUserRolePayload;
    }) => changeUserRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(t("roleUpdated"));
    },
    onError: (error) => {
      toast.error(userErrorMessage(error, t));
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const t = useUserMessages();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      // `GET /api/users` only ever returns active accounts, so the row leaves
      // the list on the next fetch — that disappearance is the confirmation.
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(t("deactivated"));
    },
    onError: (error) => {
      toast.error(userErrorMessage(error, t));
    },
  });
};
