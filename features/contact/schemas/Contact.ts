import { z } from "zod";

import { nationalDigits } from "@/lib/Phone";

/**
 * Validation for the public contact form — a factory, because its messages
 * come from `useTranslations`. The limits are the backend's own
 * (`contact.validation.js`), so nothing that passes here is refused there for
 * length. The phone check is as loose as the order form's: the backend runs
 * libphonenumber and is the authority, and its rejection is shown under the
 * same field.
 */

export const NAME_MAX_LENGTH = 200;
export const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MAX_LENGTH = 2000;

type Translator = (
  key:
    | "nameRequired"
    | "emailInvalid"
    | "phoneRequired"
    | "phoneInvalid"
    | "messageRequired"
    | "messageTooLong",
) => string;

export const createContactSchema = (t: Translator) =>
  z.object({
    name: z.string().trim().min(1, t("nameRequired")).max(NAME_MAX_LENGTH),
    email: z
      .string()
      .trim()
      .max(EMAIL_MAX_LENGTH, t("emailInvalid"))
      .email(t("emailInvalid")),
    country: z.string().min(2),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t("phoneRequired"))
      .refine((value) => {
        const digits = nationalDigits(value);
        return digits.length >= 6 && digits.length <= 14;
      }, t("phoneInvalid")),
    message: z
      .string()
      .trim()
      .min(1, t("messageRequired"))
      .max(MESSAGE_MAX_LENGTH, t("messageTooLong")),
    /** The honeypot. Never shown, never validated. */
    website: z.string(),
  });

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
