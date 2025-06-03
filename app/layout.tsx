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
  description: "Visant Studio - Criando marcas para empreendedores visionários",
  keywords: [
    "branding", "design", "identidade visual", "gestão de projetos", "dashboard",
    "estúdio criativo", "agência digital", "marketing digital", "empreendedorismo",
    "empreendedor", "negócios", "startup", "logo", "logotipo", "marca", "criação de marca",
    "consultoria de branding", "design gráfico", "projeto visual", "inovação", "criatividade",
    "identidade de marca", "posicionamento de marca", "estratégia de marca", "branding para startups",
    "branding para empresas", "branding digital", "branding pessoal", "branding corporativo"
  ],
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
        url: 'https://cndvlwjphohgfgydvgum.supabase.co/storage/v1/object/public/portfolio/Visant/WhatsApp%20Image%202022-08-09%20at%2014.21.47.jpeg',
        width: 1200,
        height: 630,
        alt: 'Visant® Studio Website and Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visant® Studio',
    description: 'Visant Studio - Criando marcas para empreendedores visionários',
    images: ['https://cndvlwjphohgfgydvgum.supabase.co/storage/v1/object/public/portfolio/Visant/WhatsApp%20Image%202022-08-09%20at%2014.21.47.jpeg'],
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