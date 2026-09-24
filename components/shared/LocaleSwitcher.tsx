"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/Utils";
import type { LocaleSwitcherProps } from "@/types/Shared";

export default function LocaleSwitcher({
  className,
  onSwitch,
  compact = false,
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Two locales only, so "the other one" is unambiguous.
  const nextLocale =
    routing.locales.find((candidate) => candidate !== locale) ??
    routing.defaultLocale;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(compact && "h-9 gap-1.5 px-3 text-xs max-md:w-auto", className)}
      disabled={isPending}
      lang={nextLocale}
      aria-label={t("switchLanguage")}
      onClick={() => {
        onSwitch?.();
        // Stays on the same route, only the locale prefix changes.
        startTransition(() => {
          router.replace(pathname, { locale: nextLocale });
        });
      }}
    >
      {compact ? (
        <>
          <Languages className="size-4" aria-hidden />
          {/* A locale code, not prose — the same two letters in both
              languages, so it is not routed through `messages/`. */}
          <span dir="ltr">{nextLocale.toUpperCase()}</span>
        </>
      ) : (
        t("switchLanguage")
      )}
    </Button>
  );
}
