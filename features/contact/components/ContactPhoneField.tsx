"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import Field from "@/features/home/components/Field";
import Input from "@/features/home/components/Input";
import { useHydrated } from "@/hooks/UseHydrated";
import {
  countryOptions,
  dialCodeOf,
  dialPrefixPadding,
  phonePlaceholder,
} from "@/lib/Phone";
import { cn } from "@/lib/Utils";
import type { ContactPhoneFieldProps } from "../types/Contact";

// The contact form's phone number, in the public site's own field style rather
// than the kit's (the order modal's `PhoneField`): this sits on the landing
// page next to the name and email inputs, and has to look like them. Same
// behaviour though — the country is its own native select, because the
// backend only accepts a full international number and will not guess one.
export default function ContactPhoneField({
  countryId,
  numberId,
  country,
  onCountryChange,
  numberProps,
  error,
  disabled,
}: ContactPhoneFieldProps) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const hydrated = useHydrated();
  const dial = dialCodeOf(country);

  // The full list comes from `Intl.DisplayNames`, whose names and ordering
  // differ between Node and the browser — rendered on the server, it failed
  // hydration. The form sits on the server-rendered home page (the order
  // modal's picker only ever renders in the browser), so the server and the
  // first client pass show just the selected country's code, and the full
  // list takes over once hydrated.
  const options = useMemo(
    () =>
      hydrated
        ? countryOptions(locale)
        : [{ iso: country, label: `+${dial}` }],
    [hydrated, locale, country, dial],
  );

  return (
    <Field
      label={t("phone")}
      htmlFor={numberId}
      iconName="Phone"
      error={error}
      hint={t("phoneHint")}
    >
      {/* Two fifths for the country, three for the number, from `sm` up —
          wide enough for "Syria (+963)" to read in full. Stacked on a phone. */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        <select
          id={countryId}
          aria-label={t("country")}
          value={country}
          disabled={disabled}
          onChange={(event) => onCountryChange(event.target.value)}
          className={cn("input-base", "h-11 truncate py-0 sm:col-span-2")}
        >
          {options.map((option) => (
            <option key={option.iso} value={option.iso}>
              {option.label}
            </option>
          ))}
        </select>

        {/* A latin-only island, like the email input: digits read left to
            right in both locales. The selected country's code sits inside
            its left edge, so it is plain that it doesn't need typing. */}
        <div className="relative sm:col-span-3">
          <span
            aria-hidden
            dir="ltr"
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground"
          >
            +{dial}
          </span>
          <Input
            {...numberProps}
            id={numberId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={phonePlaceholder(country)}
            dir="ltr"
            disabled={disabled}
            className="text-left"
            style={{ paddingLeft: dialPrefixPadding(dial) }}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${numberId}-${error ? "error" : "hint"}`}
          />
        </div>
      </div>
    </Field>
  );
}
