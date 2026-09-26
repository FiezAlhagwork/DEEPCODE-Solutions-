import { z } from "zod";

import { nationalDigits } from "@/lib/Phone";

/**
 * Validation for the order form — a factory, like every other schema here,
 * because its messages come from `useTranslations`.
 *
 * The phone check is deliberately loose: 6-14 digits once formatting and a
 * leading trunk `0` are stripped. The authority is the backend, which runs the
 * full number through libphonenumber and rejects anything invalid for its
 * country; this only catches the obvious slips (empty, three digits, letters)
 * without shipping a phone-number library to every visitor of the hosting
 * pages. A backend rejection is still shown under the same field.
 */

export const NOTES_MAX_LENGTH = 1000;

type Translator = (key: "phoneRequired" | "phoneInvalid" | "notesTooLong") => string;

export const createRequestSchema = (t: Translator) =>
  z.object({
    requestType: z.enum(["purchase", "inquiry"]),
    country: z.string().min(2),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t("phoneRequired"))
      .refine((value) => {
        const digits = nationalDigits(value);
        return digits.length >= 6 && digits.length <= 14;
      }, t("phoneInvalid")),
    notes: z.string().trim().max(NOTES_MAX_LENGTH, t("notesTooLong")),
  });

export type RequestFormValues = z.infer<ReturnType<typeof createRequestSchema>>;
