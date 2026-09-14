import { z } from "zod";

/**
 * Validation for the hand-built auth forms (sign-in, sign-up, accept
 * invitation). Factories, not constants — error messages come from
 * `useTranslations`, same reasoning as every other form schema in the admin
 * panel (see `features/categories/schemas/Categories.ts`).
 */

const CODE_LENGTH = 6;

type Translator = (key: "required" | "invalidEmail") => string;

export const createSignInEmailSchema = (t: Translator) =>
  z.object({
    email: z.string().min(1, t("required")).email(t("invalidEmail")),
  });

export type SignInEmailValues = z.infer<ReturnType<typeof createSignInEmailSchema>>;

export const createSignUpDetailsSchema = (t: Translator) =>
  z.object({
    firstName: z.string().min(1, t("required")),
    lastName: z.string().min(1, t("required")),
    email: z.string().min(1, t("required")).email(t("invalidEmail")),
  });

export type SignUpDetailsValues = z.infer<ReturnType<typeof createSignUpDetailsSchema>>;

/** Just the name fields — used by `AcceptInvitationView` when the invite's ticket doesn't already carry a name. */
export const createNameSchema = (t: Translator) =>
  z.object({
    firstName: z.string().min(1, t("required")),
    lastName: z.string().min(1, t("required")),
  });

export type NameValues = z.infer<ReturnType<typeof createNameSchema>>;

export const createCodeSchema = (t: Translator) =>
  z.object({
    code: z.string().length(CODE_LENGTH, t("required")),
  });

export type CodeValues = z.infer<ReturnType<typeof createCodeSchema>>;
