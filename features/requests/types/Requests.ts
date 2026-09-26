import type { ComponentProps } from "react";

import type { Product } from "@/features/hosting/types/Hosting";
import type { LeadStatus, ListQueryParams } from "@/types/Shared";

/**
 * A customer's request for a server plan — a lead the team follows up on by
 * phone, not an order placed with the hosting provider.
 *
 * Named `PlanRequest` rather than `Request` because `Request` is the global
 * `fetch` type in every browser and in Node: a local type by that name would
 * shadow it in any file that imports both, silently.
 */

/** Same lifecycle as a contact message — see `LeadStatus`. */
export type RequestStatus = LeadStatus;
export type RequestType = "purchase" | "inquiry";

/** The requester as `GET /api/requests` populates it. */
export type RequestUser = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export type PlanRequest = {
  _id: string;
  user: RequestUser;
  productId: string;
  productName: string;
  productPrice: number;
  productBasePrice?: number;
  billingCycle?: string;
  requestType: RequestType;
  /** Normalised to E.164 by the backend before it is stored. */
  phone: string;
  notes?: string | null;
  status: RequestStatus;
  createdAt: string;
};

/**
 * `POST /api/requests`. The product fields are a snapshot of what the customer
 * was looking at; the backend stores them as sent and never re-checks them
 * against the live catalog. `productBasePrice` is left out on purpose — the
 * card shows one price, so the request records one price.
 */
export type CreateRequestPayload = {
  productId: string;
  productName: string;
  productPrice: number;
  billingCycle?: string;
  requestType: RequestType;
  phone: string;
  notes?: string;
};

/**
 * The API takes `page`/`limit` and a `status` filter, but no search — `q` from
 * `ListQueryParams` is simply never set by anything that calls this.
 */
export type RequestsQueryParams = ListQueryParams & { status?: RequestStatus };

// --- Components ------------------------------------------------------------

/**
 * `product` is `null` while the modal is closed — it stays mounted either way
 * (see `Modal`), so it needs a value to render against.
 */
export type RequestModalProps = {
  product: Product | null;
  onClose: () => void;
  /** Runs after a successful submit, before `onClose`. */
  onSubmitted: () => void;
};

export type RequestFormProps = {
  product: Product;
  /** The footer's submit button sits outside the form and reaches it by id. */
  formId: string;
  onSubmitted: () => void;
};

export type PhoneFieldProps = {
  countryId: string;
  numberId: string;
  country: string;
  onCountryChange: (iso: string) => void;
  /** Spread onto the number input — `register("phoneNumber")` in practice. */
  numberProps: ComponentProps<"input">;
  error?: string;
  disabled?: boolean;
};

export type RequestTypeFieldProps = {
  name: string;
  value: RequestType;
  onChange: (value: RequestType) => void;
  disabled?: boolean;
};

// --- Admin -----------------------------------------------------------------

/** The team's grid filter. `""` is "every status", per `useListControls`. */
export type RequestTableFilters = {
  status: "" | RequestStatus;
};

/** `request` is `null` while closed — `Modal` stays mounted either way. */
export type RequestDetailsModalProps = {
  request: PlanRequest | null;
  onClose: () => void;
  /** Hands the request over to the confirmation dialog. */
  onMarkContacted: (request: PlanRequest) => void;
};
