import type { Product } from "@/features/hosting/types/Hosting";
import { composePhone, dialCodeOf } from "@/lib/Phone";
import type { RequestFormValues } from "../schemas/Requests";
import type { CreateRequestPayload, RequestUser } from "../types/Requests";

/**
 * The request body. The price sent is `base_price` — the one the card shows —
 * and nothing else: `your_price` never leaves the browser, and
 * `productBasePrice` is left out because only one price was on screen. Empty
 * notes are omitted rather than sent as `""`.
 */
export const buildRequestPayload = (
  product: Product,
  values: RequestFormValues,
): CreateRequestPayload => ({
  productId: product.id,
  productName: product.name,
  productPrice: product.base_price,
  ...(product.billing_cycle ? { billingCycle: product.billing_cycle } : {}),
  requestType: values.requestType,
  phone: composePhone(dialCodeOf(values.country), values.phoneNumber),
  ...(values.notes.trim() !== "" ? { notes: values.notes.trim() } : {}),
});

/** The requester's full name, or their email when Clerk has no name for them. */
export const requesterName = (user: RequestUser): string => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
};
