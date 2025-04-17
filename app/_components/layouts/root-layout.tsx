'use client';

import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/navigation";
import { PageTransition } from "@/components/PageTransition";
import { I18nProvider } from "@/context/i18n-context";
import { Footer } from "@/components/footer";
import { usePathname } from 'next/navigation';
import { useMediaQuery } from "@/hooks/use-media-query";
import { type PropsWithChildren } from 'react';

interface RootLayoutProps extends PropsWithChildren {
  // Adicione props específicas do layout aqui se necessário
}

export function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');
  const isHome = pathname === '/';
  const showFooter = !isHome || (isHome && isMobileOrTablet);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <main className="min-h-screen flex flex-col">
          <Navigation />
          <div className="flex-1 w-full">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          {showFooter && <Footer />}
        </main>
      </I18nProvider>
    </ThemeProvider>
  );
} 