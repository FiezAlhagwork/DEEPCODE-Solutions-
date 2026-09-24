"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import SelectInput from "@/components/kit/SelectInput";
import TextInput from "@/components/kit/TextInput";
import type { PhoneFieldProps } from "../types/Requests";
import { countryOptions } from "../utils/Requests";

// The backend only accepts a full international number and will not guess a
// country, so the country is its own control rather than something the
// customer has to remember to type. A native `<select>`, like every select in
// the kit: on a phone it opens the OS picker, which beats any listbox we could
// hand-roll for a list of 200-odd countries.
export default function PhoneField({
  countryId,
  numberId,
  country,
  onCountryChange,
  numberProps,
  error,
  disabled,
}: PhoneFieldProps) {
  const t = useTranslations("requests.form");
  const locale = useLocale();
  const options = useMemo(() => countryOptions(locale), [locale]);

  const hintId = `${numberId}-hint`;
  const errorId = `${numberId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={numberId} className="text-xs font-medium text-ink-muted">
        {t("phone")}
        <span aria-hidden className="ms-1 text-danger">
          *
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <SelectInput
          id={countryId}
          aria-label={t("country")}
          value={country}
          disabled={disabled}
          onChange={(event) => onCountryChange(event.target.value)}
          className="sm:w-56 sm:shrink-0"
        >
          {options.map((option) => (
            <option key={option.iso} value={option.iso}>
              {option.label}
            </option>
          ))}
        </SelectInput>

        {/* A latin-only island, like the email inputs: digits read left to
            right in both locales. */}
        <TextInput
          {...numberProps}
          id={numberId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          dir="ltr"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
        />
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : (
        <p id={hintId} className="text-xs text-ink-faint">
          {t("phoneHint")}
        </p>
      )}
    </div>
  );
}
