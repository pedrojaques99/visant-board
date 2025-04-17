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
  title: "Visant® Board",
  description: "Visant® Project Management Dashboard",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
