/**
 * Keyed by the Clerk user id rather than by nothing at all: the sessions list
 * belongs to one account, and signing in as somebody else must not be handed
 * the previous account's cached devices.
 */
export const accountKeys = {
  all: ["account"] as const,
  sessions: (userId?: string) => ["account", "sessions", userId] as const,
};
