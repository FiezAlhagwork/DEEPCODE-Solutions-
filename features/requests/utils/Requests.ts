import type { Product } from "@/features/hosting/types/Hosting";
import { COUNTRY_DIAL_CODES, DEFAULT_COUNTRY } from "../constants/Countries";
import type { RequestFormValues } from "../schemas/Requests";
import type {
  CountryOption,
  CreateRequestPayload,
} from "../types/Requests";

/** Left-to-right mark — invisible, but pins the direction of what follows it. */
const LRM = String.fromCharCode(0x200e);

/**
 * The phone picker's options in the viewer's language, the default country
 * first and the rest alphabetical. Names come from `Intl.DisplayNames`, so no
 * country name lives in `messages/`; a runtime that can't name a code falls
 * back to the code itself rather than dropping the country.
 */
export const countryOptions = (locale: string): CountryOption[] => {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  const nameOf = (iso: string) => {
    try {
      return names.of(iso) ?? iso;
    } catch {
      return iso;
    }
  };

  const options = COUNTRY_DIAL_CODES.map(({ iso, dial }) => ({
    iso,
    dial,
    // U+200E (left-to-right mark) before the "+": in an Arabic label the sign
    // is a neutral character, so without it "(+963)" renders as "(963+)".
    label: `${nameOf(iso)} (${LRM}+${dial})`,
  }));

  return options.sort((a, b) => {
    if (a.iso === DEFAULT_COUNTRY) return -1;
    if (b.iso === DEFAULT_COUNTRY) return 1;
    return a.label.localeCompare(b.label, locale);
  });
};

export const dialCodeOf = (iso: string): string =>
  COUNTRY_DIAL_CODES.find((country) => country.iso === iso)?.dial ??
  COUNTRY_DIAL_CODES.find((country) => country.iso === DEFAULT_COUNTRY)!.dial;

/**
 * What was typed, reduced to the national number: formatting (spaces, dashes,
 * brackets) goes, and so does the leading trunk `0` people type out of habit
 * — `0944 123 456` is how a Syrian number is written at home, but the `0` is
 * not part of it once `+963` is in front.
 */
export const nationalDigits = (raw: string): string =>
  raw.replace(/\D/g, "").replace(/^0+/, "");

/**
 * `+<dial><national>`, the full international form the backend requires (it
 * rejects anything without a leading `+`, and does not guess a country).
 *
 * Someone who pastes a number that already carries the country code —
 * `+963 944…` or `00963 944…` — would otherwise end up with it twice; when the
 * raw input was international and starts with the selected code, the code is
 * taken off before it is put back on.
 */
export const composePhone = (dial: string, raw: string): string => {
  const trimmed = raw.trim();
  const international = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = raw.replace(/\D/g, "");

  if (international) {
    digits = digits.replace(/^00/, "");
    if (digits.startsWith(dial)) digits = digits.slice(dial.length);
  }

  return `+${dial}${digits.replace(/^0+/, "")}`;
};

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

