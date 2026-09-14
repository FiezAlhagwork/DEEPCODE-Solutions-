import type { AdminUser } from "../types/Users";

/**
 * Display name for a user row, falling back to the email's local part.
 *
 * Lives here rather than in `types/Users.ts`: that file is types only, and a
 * runtime function inside it meant the module could never be imported with
 * `import type` alone — it survived into the client bundle.
 */
export function fullName(user: AdminUser) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email.split("@")[0];
}
