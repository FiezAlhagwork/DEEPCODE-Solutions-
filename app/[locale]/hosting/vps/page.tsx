import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HostingHero from "@/features/hosting/components/HostingHero";
import VpsCategoryTabs from "@/features/hosting/components/VpsCategoryTabs";
import { localeAlternates } from "@/i18n/metadata";
import { requireLocale } from "@/i18n/Locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "hosting.vpsPage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/hosting/vps"),
  };
}

export default async function VpsPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("hosting.vpsPage");

  return (
    <div className="relative overflow-hidden px-6 py-14 bg-[#0D0D0E] ">
      <div className="mx-auto  max-w-7xl  ">
        <HostingHero
          badge={t("badge")}
          title={t("title")}
          description={t("description")}
        />

        <VpsCategoryTabs />
      </div>
    </div>
  );
}
