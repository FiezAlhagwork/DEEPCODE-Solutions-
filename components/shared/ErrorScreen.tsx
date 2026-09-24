"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/kit/Button";
import type { ErrorScreenProps } from "@/types/Shared";

// A failed server render used to surface Next's raw "A server error occurred"
// page — which tells the visitor nothing and offers them nothing. The common
// cause here is simply that the backend isn't answering, which is usually
// momentary, so retrying in place is the first thing on offer and going home
// is the escape hatch when it isn't.

export default function ErrorScreen({
  title,
  description,
  retryLabel,
  homeLabel,
  onRetry,
}: ErrorScreenProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-hairline bg-surface-3 text-warning">
        <AlertTriangle className="size-5" aria-hidden />
      </span>

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold text-ink">{title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
        <Button variant="ghost" href="/">
          {homeLabel}
        </Button>
      </div>
    </div>
  );
}
