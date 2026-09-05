import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Black_Ops_One } from "next/font/google";
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

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});
const black_one_ops = Black_Ops_One({
  subsets: ["cyrillic-ext", "latin"],
  variable: "--font-black_ops_one",
  weight: ["400"],
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
      className={`${cairo.variable} ${black_one_ops.variable} `}
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
