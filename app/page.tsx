'use client';

import Hero from '@/components/hero';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

export default function Home() {
  const { messages } = useI18n();
  
  return (
    <main className="relative flex-1 min-h-screen overflow-hidden">
      {/* Hero Section with 3D Logo */}
      <div className="absolute inset-0 w-full h-full">
        <Hero />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
        <div className="max-w-2xl w-full space-y-8 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t(messages, 'home.title', 'Welcome to Visant®')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <a
              href="/portfolio"
              className="group relative inline-flex items-center justify-center rounded-md bg-primary/90 px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore our work')}</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
            </a>
          </div>
        </div>

        {/* Interactive Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center opacity-60">
          <p className="text-sm text-muted-foreground animate-pulse">
            {t(messages, 'home.interactionHint', 'Click and drag to interact with the 3D logo')}
          </p>
        </div>
      </div>
    </main>
  );
}



