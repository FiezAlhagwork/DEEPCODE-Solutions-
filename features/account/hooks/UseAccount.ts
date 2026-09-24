import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { clerkErrorMessage } from "@/features/auth/utils/Auth";
import { compressImage } from "@/lib/Images";
import { accountKeys } from "../QueryKeys";
import type { AccountProfileValues } from "../schemas/Account";
import type { AccountSession } from "../types/Account";

/**
 * The one feature here whose data does not come from `lib/Api.ts`. A profile
 * photo, a display name and the list of signed-in devices all live in Clerk,
 * not in our backend, so there is no service layer to write — the five-layer
 * pattern's steps 1-3 have no subject.
 *
 * TanStack Query is still worth keeping: `QueryProvider` is already mounted in
 * the admin layout, and it hands us the loading/error states, the refetch and
 * the invalidate-after-mutation that every other panel in this section gets for
 * free. Only the source of the data is different, and that is recorded in
 * CLAUDE.md as a deliberate exception rather than left to look like an oversight.
 *
 * Nothing on this page needs backend work: the backend's Clerk webhook already
 * handles `user.updated` and writes `imageUrl`/`firstName`/`lastName` into our
 * own `User` document, so an edit made here reaches the users table on its own
 * (asynchronously — the table can lag by a second or two).
 */

/** Translated toasts, same as the categories and users hooks. */
const useAccountMessages = () => useTranslations("admin.account.messages");

/** Avatars render at 96px at the very largest; 1920 would be pure upload cost. */
const AVATAR_MAX_EDGE = 512;

export const useAccountSessions = () => {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: accountKeys.sessions(user?.id),
    queryFn: () => user!.getSessions(),
    enabled: isLoaded && user !== null && user !== undefined,
    // The cached items are Clerk resource instances carrying a live `revoke()`
    // method, and `useRevokeSession` reads one straight back out of this cache
    // to call it. Structural sharing exists to recycle plain data objects; it
    // has no business rebuilding these.
    structuralSharing: false,
  });
};

/**
 * Takes a session **id** rather than the resource, which is what makes it a
 * `ConfirmableMutation` and lets `useConfirmedAction` drive the confirm dialog
 * exactly as it does for the users table's deactivate.
 *
 * `useReverification` is deliberately not wired around this. It exists in the
 * SDK, but its default behaviour renders Clerk's own modal — the one kind of UI
 * this project has now rejected twice. If this instance ever does demand
 * reverification, the error surfaces as a translated message and we build the
 * step on `features/auth/components/CodeInput.tsx`, which already exists.
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const t = useAccountMessages();
  const key = accountKeys.sessions(user?.id);

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const sessions = queryClient.getQueryData<AccountSession[]>(key);
      const session = sessions?.find((item) => item.id === sessionId);
      // Only reachable if the list was refetched out from under the open
      // dialog; `onError` turns it into the generic message rather than a crash.
      if (!session) throw new Error("Session is no longer in the cache");

      return session.revoke();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success(t("sessionRevoked"));
    },
    onError: (error) => {
      toast.error(clerkErrorMessage(error, t("genericError")));
    },
  });
};

export const useUpdateAccountProfile = () => {
  const { user } = useUser();
  const t = useAccountMessages();

  return useMutation({
    mutationFn: (values: AccountProfileValues) => user!.update(values),
    onSuccess: () => {
      // No cache to invalidate: `useUser()` re-renders from Clerk's own store,
      // so the header avatar and the breadcrumb update on their own.
      toast.success(t("profileUpdated"));
    },
    onError: (error) => {
      toast.error(clerkErrorMessage(error, t("genericError")));
    },
  });
};

/**
 * `null` removes the picture, which puts Clerk's own generated avatar back.
 *
 * Compression runs inside the mutation on purpose, so `isPending` covers both
 * the encode and the upload with one flag — a separate `preparing` state would
 * leave a window where the button is live and the file isn't ready.
 */
export const useUpdateAccountImage = () => {
  const { user } = useUser();
  const t = useAccountMessages();

  return useMutation({
    mutationFn: async (file: File | null) => {
      // `compressImage` never throws: an SVG, an animated GIF or a decode
      // failure all come back as the original file, so a valid picture is
      // never refused just because it couldn't be shrunk.
      const prepared =
        file === null
          ? null
          : await compressImage(file, { maxEdge: AVATAR_MAX_EDGE });

      await user!.setProfileImage({ file: prepared });
      // Clerk returns the new `ImageResource`, not the updated user. Reloading
      // is what makes `imageUrl` and `hasImage` correct everywhere at once —
      // without it the header would keep showing the old picture, which looks
      // exactly like an upload that silently failed.
      await user!.reload();
    },
    onSuccess: (_result, file) => {
      toast.success(file === null ? t("photoRemoved") : t("photoUpdated"));
    },
    onError: (error) => {
      toast.error(clerkErrorMessage(error, t("genericError")));
    },
  });
};
