import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import PageHero from "@/components/shared/PageHero";
import ProjectsBrowser from "@/features/projects/components/ProjectsBrowser";
import { localeAlternates } from "@/i18n/metadata";
import { requireLocale } from "@/i18n/Locale";
import type { LocaleRouteProps } from "@/types/Shared";

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: localeAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({ params }: LocaleRouteProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations("projects");

  return (
    // Same frame as the home page's sections and as the detail page — see the
    // comment there. It deliberately differs from `/hosting/vps`, which this
    // page was first modelled on and which runs a wider `max-w-7xl`.
    <div className="relative w-full overflow-x-clip px-6 py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHero
          badge={t("pageBadge")}
          title={t("pageTitle")}
          description={t("pageDescription")}
        />

        {/* The tabs and the "load more" button own state, so the browsing
            itself is a client island; the page around it stays a server
            component and keeps its metadata. */}
        <ProjectsBrowser />
      </div>
    </div>
  );
}
