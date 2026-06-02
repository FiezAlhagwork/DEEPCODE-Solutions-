import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Black_Ops_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "حلول ديب كود | وجهتك الآمنة لحضور رقمي متكامل",
  description:
    "نحول أفكارك إلى تجارب رقمية استثنائية تلبي احتياجات عملائك وتدعم نجاحك وتطورك في عالم الاعمال",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${black_one_ops.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
