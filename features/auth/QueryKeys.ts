export const authKeys = {
  /** Keyed by the Clerk user id, so a different account never reads another's cache. */
  me: (userId: string | null | undefined) => ["auth", "me", userId] as const,
};
