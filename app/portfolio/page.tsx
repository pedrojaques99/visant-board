import { getPortfolioData } from '@/utils/coda';
import { PortfolioGrid } from '@/components/PortfolioGrid';

// Add region configuration for Vercel deployment
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

export default async function PortfolioPage() {
  const result = await getPortfolioData();

  return (
    <div className="w-full">
      <section className="w-full py-20">
        <div className="max-w-[1800px] mx-auto px-5 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#52ddeb] to-[#52ddeb]/70">
              Portfolio
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of projects and client work
            </p>
          </div>

          {result.success && result.items ? (
            <div className="w-full">
              <PortfolioGrid items={result.items} tipos={(result.tipos || []) as string[]} />
            </div>
          ) : (
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
                      {result.error}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 