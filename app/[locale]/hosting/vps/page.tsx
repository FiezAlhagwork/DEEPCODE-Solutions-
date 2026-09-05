import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HostingHero from "@/features/hosting/components/HostingHero";
import VpsCategoryTabs from "@/features/hosting/components/VpsCategoryTabs";
import { localeAlternates } from "@/i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hosting.vpsPage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/hosting/vps"),
  };
}

export default async function VpsPage({ params }: Props) {
  const { locale } = await params;
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
