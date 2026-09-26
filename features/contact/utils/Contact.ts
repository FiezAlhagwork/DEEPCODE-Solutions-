import { composePhone, dialCodeOf } from "@/lib/Phone";
import type { ContactFormValues } from "../schemas/Contact";
import type { CreateContactPayload } from "../types/Contact";

/**
 * The request body: trimmed text, the phone built into the `+<dial><number>`
 * form the backend requires, and the honeypot only when something is in it.
 */
export const buildContactPayload = (
  values: ContactFormValues,
): CreateContactPayload => ({
  name: values.name.trim(),
  email: values.email.trim(),
  phone: composePhone(dialCodeOf(values.country), values.phoneNumber),
  message: values.message.trim(),
  ...(values.website !== "" ? { website: values.website } : {}),
});
