import { Manrope } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from 'next';
import { Analytics } from "@vercel/analytics/react";
import { RootLayout } from "./_components/layouts/root-layout";
import { SpeedInsights } from "@vercel/speed-insights/next"

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const defaultUrl = "https://www.visant.co";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

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
    locale: 'pt_BR',
    alternateLocale: 'en_US',
    url: defaultUrl,
    siteName: 'Visant® Studio',
    title: 'Visant® Studio',
    description: 'Visant® Studio - Criando marcas para empreendedores visionários',
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
    description: 'Visant Studio - Criando marcas para empreendedores visionários',
    images: ['https://www.visant.co/assets/og-image.jpg'],
    creator: '@visant_co',
    site: '@visant_co',
  },
  robots: {
    index: true,
    follow: true,
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
        <SpeedInsights />
          <RootLayout>
            {children}
          </RootLayout>
        <Analytics />
      </body>
    </html>
  );
}