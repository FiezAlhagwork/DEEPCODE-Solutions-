"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/Utils";
import type { RequestType, RequestTypeFieldProps } from "../types/Requests";

const TYPES: readonly RequestType[] = ["purchase", "inquiry"];

const HINT_KEYS = {
  purchase: "purchaseHint",
  inquiry: "inquiryHint",
} as const;

// Two native radios dressed as cards: the browser still owns the grouping,
// arrow-key movement and what a screen reader announces, and the card is just
// the label around each one. The choice lives here rather than as two buttons
// on the product card, which is already full.
export default function RequestTypeField({
  name,
  value,
  onChange,
  disabled,
}: RequestTypeFieldProps) {
  const t = useTranslations("requests.form");

  return (
    <fieldset className="flex flex-col gap-1.5" disabled={disabled}>
      <legend className="mb-1.5 text-xs font-medium text-ink-muted">
        {t("type")}
      </legend>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TYPES.map((type) => (
          <label
            key={type}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors",
              "has-focus-visible:ring-2 has-focus-visible:ring-primary/30",
              value === type
                ? "border-primary/50 bg-primary/10"
                : "border-hairline-strong bg-surface-1 hover:bg-surface-3",
            )}
          >
            <input
              type="radio"
              name={name}
              value={type}
              checked={value === type}
              onChange={() => onChange(type)}
              className="mt-0.5 accent-primary"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">{t(type)}</span>
              <span className="text-xs text-ink-faint">{t(HINT_KEYS[type])}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
