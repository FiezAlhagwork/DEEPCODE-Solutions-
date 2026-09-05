import type { Metadata } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { routing } from "@/i18n/routing";
import { requireLocale } from "@/i18n/Locale";
import { localeAlternates, siteUrl } from "@/i18n/metadata";

// One font per locale, picked in globals.css off `html[lang]`. Space Grotesk
// carries the English pages; the Arabic pages stay entirely on Cairo, which
// keeps its Latin subset so digits, prices and brand names inside Arabic text
// look the way they always have.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: siteUrl,
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale),
    icons: {
      icon: { url: "/photo_2026-05-24_12-23-18.jpg", type: "image/jpeg" },
      apple: "/photo_2026-05-24_12-23-18.jpg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode }> & LocaleParams) {
  const locale = requireLocale((await params).locale);

  // Required for static rendering: makes the locale available to every
  // next-intl call further down the tree.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${spaceGrotesk.variable} ${cairo.variable}`}
    >
      <body className="font-sans antialiased bg-[#0D0D0E]">
        <NextIntlClientProvider>
          <Navbar />
          <QueryProvider>{children}</QueryProvider>
          <Footer />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
