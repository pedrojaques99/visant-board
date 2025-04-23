import { Suspense } from 'react';
import { getPortfolioData } from '@/utils/coda';
import { PortfolioClient } from './client';
import PortfolioLoading from './loading';
import { Metadata } from 'next';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Portfolio | Visant',
  description: 'Explore our collection of branding and visual identity projects.',
};

// Revalidate page every hour
export const revalidate = 3600;

export default async function PortfolioPage() {
  return (
    <Suspense fallback={<PortfolioLoading />}>
      <PortfolioContent />
    </Suspense>
  );
}

async function PortfolioContent() {
  const { success, items, tipos, error } = await getPortfolioData();

  if (!success || !items) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-destructive" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Error Loading Portfolio
              </h3>
              <div className="mt-2 text-sm text-destructive/80">
                {error || 'Failed to load portfolio data. Please try again later.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PortfolioClient items={items} tipos={tipos || []} />
    </div>
  );
} 