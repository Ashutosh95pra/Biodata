import { Fraunces, Hind } from "next/font/google";
import "./globals.css";
import { site } from "../lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const hind = Hind({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  robots: {
    index: false,
    follow: false
  },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "profile",
    images: [
      {
        url: "/photo.jpg",
        width: 1200,
        height: 630,
        alt: "Portrait"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/photo.jpg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${hind.variable}`}>{children}</body>
    </html>
  );
}
