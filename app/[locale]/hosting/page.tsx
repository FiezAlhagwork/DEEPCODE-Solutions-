import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/i18n/metadata";
import { requireLocale } from "@/i18n/Locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "hosting" });

  return {
    title: t("placeholder"),
    alternates: localeAlternates(locale, "/hosting"),
  };
}

export default async function HostingPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("hosting");

  return <div>{t("placeholder")}</div>;
}
