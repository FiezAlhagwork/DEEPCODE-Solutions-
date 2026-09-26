import type { ComponentProps } from "react";

import type { LeadStatus, ListQueryParams } from "@/types/Shared";

/**
 * A message sent through the public "contact us" form — a lead the team
 * follows up on, like a server-plan request, but with no account behind it:
 * the sender may never have signed up, so it carries their details instead of
 * a `user` reference.
 */
export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  /** Normalised to E.164 by the backend before it is stored. */
  phone: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

/**
 * `POST /api/contact`. `website` is the honeypot: a hidden field a person
 * never fills, so a value means a bot. It is only sent when something is in
 * it, and the backend answers a caught bot with an ordinary-looking `201`.
 */
export type CreateContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website?: string;
};

/** `GET /api/contact` takes paging and a status filter, but no search. */
export type ContactQueryParams = ListQueryParams & { status?: LeadStatus };

// --- Components ------------------------------------------------------------

export type ContactPhoneFieldProps = {
  countryId: string;
  numberId: string;
  country: string;
  onCountryChange: (iso: string) => void;
  /** Spread onto the number input — `register("phoneNumber")` in practice. */
  numberProps: ComponentProps<"input">;
  error?: string;
  disabled?: boolean;
};

export type ContactSuccessProps = {
  onAgain: () => void;
};

// --- Admin -----------------------------------------------------------------

/** The team's grid filter. `""` is "every status", per `useListControls`. */
export type ContactTableFilters = {
  status: "" | LeadStatus;
};

/** `message` is `null` while closed — `Modal` stays mounted either way. */
export type MessageDetailsModalProps = {
  message: ContactMessage | null;
  onClose: () => void;
  /** Hands the message over to the confirmation dialog. */
  onMarkContacted: (message: ContactMessage) => void;
};
