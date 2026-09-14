import { z } from "zod";

/**
 * Validation for the invite-user form.
 *
 * A factory rather than a constant, same as every other form schema here: the
 * messages come from `useTranslations`, which only exists inside a component.
 * The caller wraps it in `useMemo` so `zodResolver` keeps a stable identity.
 *
 * The role list deliberately omits `user` — `POST /api/users` only accepts
 * `admin` / `super_admin`, because a plain user arrives through self-signup and
 * is never invited.
 */

type Translator = (key: "required" | "invalidEmail") => string;

export const createInviteUserSchema = (tCommon: Translator) =>
  z.object({
    email: z
      .string()
      .min(1, tCommon("required"))
      .email(tCommon("invalidEmail")),
    role: z.enum(["admin", "super_admin"]),
  });

export type InviteUserFormValues = z.infer<
  ReturnType<typeof createInviteUserSchema>
>;
