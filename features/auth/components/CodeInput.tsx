"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/Utils";
import type { CodeInputProps } from "../types/Auth";

const LENGTH = 6;

/**
 * Six separate boxes rather than one text field — no OTP component existed
 * anywhere in the codebase, and this is what "professional, modern" looks
 * like for a code entry step (auto-advance, backspace navigation, full-code
 * paste), not a single input styled to look segmented.
 */
export default function CodeInput({
  id,
  value,
  onChange,
  disabled,
  invalid,
}: CodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigitAt(index: number, digit: string) {
    const next = value.padEnd(LENGTH, " ").split("");
    next[index] = digit || " ";
    onChange(next.join("").trimEnd());
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigitAt(index, digit);
    if (digit && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <div dir="ltr" role="group" className="flex justify-center gap-2">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[index] ?? ""}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-10 rounded-lg border border-hairline-strong bg-surface-1 text-center",
            "text-lg font-semibold text-ink outline-none transition-colors",
            "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20",
            "aria-[invalid=true]:border-danger/60 aria-[invalid=true]:ring-danger/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      ))}
    </div>
  );
}
