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
  title: "DEEP CODE Solution | وجهتك الآمنة لحضور رقمي متكامل",
  description:
    "نحول أفكارك إلى تجارب رقمية استثنائية تلبي احتياجات عملائك وتدعم نجاحك وتطورك في عالم الاعمال",
  icons: {
    icon: [
      {
        url: "/photo_2026-05-24_12-23-18.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/photo_2026-05-24_12-23-18.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/photo_2026-05-24_12-23-18.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/photo_2026-05-24_12-23-18.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${black_one_ops.variable} `}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
