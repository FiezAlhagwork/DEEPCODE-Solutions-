"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LocaleSwitcherProps = {
  className?: string;
  onSwitch?: () => void;
};

export default function LocaleSwitcher({
  className,
  onSwitch,
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
      className={className}
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
      {t("switchLanguage")}
    </Button>
  );
}
