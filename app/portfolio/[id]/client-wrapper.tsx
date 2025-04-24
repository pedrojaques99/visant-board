'use client';

import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { Loader2 } from 'lucide-react';

interface ClientWrapperProps {
  id: string;
  initialData: PortfolioItem;
  relatedProjects: PortfolioItem[];
}

const ClientWrapper = ({ id, initialData, relatedProjects }: ClientWrapperProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { ProjectPageClient } = await import('./client');
        if (isMounted) {
          setComponent(() => ProjectPageClient);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load project client:', err);
        if (isMounted) {
          setError('Failed to load project details');
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="px-4 py-2 rounded-md border bg-background/80">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !Component) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <Component id={id} initialData={initialData} relatedProjects={relatedProjects} />;
};

export default ClientWrapper; 