import { Manrope } from "next/font/google";
import "./globals.css";
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react";
import { RootLayout } from "./_components/layouts/root-layout";

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Visant® Studio",
  description: "Visant Studio - Where visionary brands are born",
  keywords: ["branding", "design", "visual identity", "project management", "dashboard", "studio", "creative", "agency", "digital", "marketing", "branding", "design", "visual identity", "project management", "dashboard", "studio", "creative", "agency", "digital", "marketing"],
  authors: [{ name: "Visant®" }],
  creator: "Visant®",
  publisher: "Visant®",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'pt_BR',
    url: defaultUrl,
    siteName: 'Visant® Studio',
    title: 'Visant® Studio',
    description: 'Visant® Studio - Where visionary brands are born',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Visant® Studio Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visant® Studio',
    description: 'Visant Studio - Where visionary brands are born',
    images: ['/assets/og-image.jpg'],
    creator: '@visant_co',
    site: '@visant_co',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <RootLayout>
          {children}
        </RootLayout>
        <Analytics />
      </body>
    </html>
  );
}
