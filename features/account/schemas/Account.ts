import { z } from "zod";

/**
 * Validation for the account name form.
 *
 * A factory, like every other schema here: the messages come from
 * `useTranslations`, which only exists inside a component. The caller wraps it
 * in `useMemo` so `zodResolver` keeps a stable identity.
 *
 * Both names are required because this Clerk instance requires them at sign-up
 * (see `AcceptInvitationView`, which has to collect them for an invited user) —
 * clearing one here would put the account back into a state it can't be
 * created in.
 */

type Translator = (key: "required") => string;

export const createAccountProfileSchema = (tCommon: Translator) =>
  z.object({
    firstName: z.string().trim().min(1, tCommon("required")),
    lastName: z.string().trim().min(1, tCommon("required")),
  });

export type AccountProfileValues = z.infer<
  ReturnType<typeof createAccountProfileSchema>
>;
