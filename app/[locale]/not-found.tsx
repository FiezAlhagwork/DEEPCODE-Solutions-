import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-white md:text-4xl">
        {t("title")}
      </h1>

      <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("description")}
      </p>

      <Button href="/" variant="default" className="mt-2">
        {t("cta")}
      </Button>
    </main>
  );
}
