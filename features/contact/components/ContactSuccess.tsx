"use client";

import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { ContactSuccessProps } from "../types/Contact";

// Takes the form's place once a message is sent: a toast is gone in seconds
// and easy to miss, and the form sitting there empty again reads as though
// nothing happened. Focus moves to the heading so a screen reader announces
// the result instead of staying on a button that no longer exists.
export default function ContactSuccess({ onAgain }: ContactSuccessProps) {
  const t = useTranslations("contact.form.success");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <CircleCheck className="size-7" aria-hidden />
      </span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-medium text-white outline-none"
      >
        {t("title")}
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("description")}
      </p>
      <Button type="button" variant="outline" onClick={onAgain} className="mt-2">
        {t("again")}
      </Button>
    </div>
  );
}
