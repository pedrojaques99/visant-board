import { getPortfolioData } from '@/utils/coda';
import { PortfolioGrid } from '@/components/PortfolioGrid';

export default async function PortfolioPage() {
  const result = await getPortfolioData();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Portfolio
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
            Explore our collection of projects and client work
          </p>
        </div>

        {result.success && result.items ? (
          <div className="mt-12">
            <PortfolioGrid items={result.items} tipos={(result.tipos || []) as string[]} />
          </div>
        ) : (
          <div className="mt-12 bg-destructive/10 border border-destructive/20 rounded-md p-4">
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
        )}
      </div>
    </div>
  );
} 