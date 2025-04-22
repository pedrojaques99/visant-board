'use client';

import { PortfolioGrid } from '@/components/PortfolioGrid';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useSearchParams } from 'next/navigation';
import { PortfolioItem } from '@/utils/coda';
import { Suspense } from 'react';

interface Props {
  items: PortfolioItem[];
  tipos: string[];
}

function PortfolioClientContent({ items, tipos }: Props) {
  const { messages } = useI18n();
  const searchParams = useSearchParams();

  return (
    <div className="w-full">
      <section className="w-full py-20">
        <div className="max-w-[1800px] mx-auto px-2 sm:px-5 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t(messages, 'portfolio.title', 'Portfolio')}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t(messages, 'portfolio.subtitle', 'Explore our collection of projects and client work')}
            </p>
          </div>

          <PortfolioGrid 
            items={items} 
            tipos={tipos} 
            initialType={searchParams.get('type') || undefined}
          />
        </div>
      </section>
    </div>
  );
}

export function PortfolioClient(props: Props) {
  return (
    <Suspense fallback={
      <div className="w-full py-20">
        <div className="max-w-[1800px] mx-auto px-2 sm:px-5 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    }>
      <PortfolioClientContent {...props} />
    </Suspense>
  );
} 