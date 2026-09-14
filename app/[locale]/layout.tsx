import type { Metadata } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { requireLocale } from "@/i18n/Locale";
import { localeAlternates, siteUrl } from "@/i18n/metadata";
import ClerkTokenSync from "@/components/shared/ClerkTokenSync";
import type { ChildrenProps, LocaleRouteProps } from "@/types/Shared";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleRouteProps): Promise<Metadata> {
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
}: ChildrenProps & LocaleRouteProps) {
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
        {/* No `appearance`/`localization` here — every Clerk-rendered
            component was replaced by our own hand-built views
            (`features/auth/components/`), so nothing consumes those props
            anymore. `<ClerkProvider>` is only what makes `useAuth()`/
            `useSignIn()`/`useSignUp()` work. */}
        <ClerkProvider>
          <ClerkTokenSync />
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ClerkProvider>
        {/* Every `toast.*` call in the app — the auth views and all three
            mutation-hook families — renders through this one mount. Without it
            they are called and silently discarded, which is exactly how a
            failed sign-in looked like a button that did nothing at all. */}
        <Toaster position="top-center" dir={locale === "ar" ? "rtl" : "ltr"} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
