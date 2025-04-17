'use client';

import { PortfolioGrid } from '@/components/PortfolioGrid';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PortfolioContent() {
  const { messages } = useI18n();
  const searchParams = useSearchParams();
  const [portfolioData, setPortfolioData] = useState<any>({ success: false, items: [], tipos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialType = searchParams.get('type');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/portfolio');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        setPortfolioData(result);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !portfolioData.success) {
    return (
      <div className="mt-8 sm:mt-10">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Error Loading Portfolio
              </h3>
              <div className="mt-2 text-sm text-destructive/80">
                {error || portfolioData.error || 'Failed to load portfolio data'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PortfolioGrid 
        items={portfolioData.items} 
        tipos={(portfolioData.tipos || []) as string[]} 
        initialType={initialType || undefined}
      />
    </div>
  );
}

export default function PortfolioPage() {
  const { messages } = useI18n();

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

          <Suspense 
            fallback={
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }
          >
            <PortfolioContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
} 