import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "../QueryKeys";
import { getMyProfile } from "../services/Auth";
import type { UseMyProfileOptions } from "../types/Auth";

/** How often to ask again while the account is still being set up. */
const POLL_MS = 1500;
/** 20 × 1.5s ≈ 30s — past that, something is wrong rather than slow. */
const MAX_POLLS = 20;

/**
 * The signed-in account's profile from `GET /api/auth/me`, polled until it is
 * ready to use.
 *
 * A brand-new account exists in Clerk the moment sign-up finishes, but its
 * record in our own database is created a second or two later by the
 * `user.created` webhook. Until then `/auth/me` answers `synced: false` and
 * `POST /api/requests` refuses with `409 ACCOUNT_NOT_SYNCED`. This asks again
 * every 1.5s while the profile is unsynced, and gives up after ~30s so the
 * screen can say so instead of spinning forever.
 *
 * `retry()` resets the query rather than refetching it, so the poll count
 * starts over too.
 */
export const useMyProfile = ({ enabled = true }: UseMyProfileOptions = {}) => {
  const { userId, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = authKeys.me(userId);

  const query = useQuery({
    queryKey,
    queryFn: () => getMyProfile(),
    enabled: enabled && isSignedIn === true,
    retry: 1,
    // Re-render on every poll, even when the answer is the same `synced:
    // false` — otherwise the poll count below would never be re-read and the
    // "taking longer than usual" state could not appear.
    notifyOnChangeProps: "all",
    refetchInterval: (current) => {
      if (current.state.data?.synced) return false;
      if (current.state.dataUpdateCount >= MAX_POLLS) return false;
      return POLL_MS;
    },
  });

  const profile = query.data;
  const ready = profile?.synced === true;
  // The observer result doesn't carry the fetch count; the cache entry does.
  const polls = queryClient.getQueryState(queryKey)?.dataUpdateCount ?? 0;
  const timedOut = !ready && (query.isError || polls >= MAX_POLLS);

  return {
    profile,
    ready,
    timedOut,
    retry: () => queryClient.resetQueries({ queryKey }),
  };
};
