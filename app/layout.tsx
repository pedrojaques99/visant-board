import { Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/navigation";
import "./globals.css";
import type { Metadata } from 'next';
import { PageTransition } from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/react"
import { I18nProvider } from "@/context/i18n-context";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <main className="min-h-screen flex flex-col items-center">
              <Navigation />
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="flex flex-col gap-20 max-w-[1800px] p-5 w-full">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </div>
              </div>
            </main>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
