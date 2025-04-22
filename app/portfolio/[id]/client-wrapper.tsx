'use client';

import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { Loader2 } from 'lucide-react';

interface ClientWrapperProps {
  id: string;
  initialData: PortfolioItem;
}

export default function ClientWrapper({ id, initialData }: ClientWrapperProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Immediately set loading to true when component mounts or id changes
    setLoading(true);
    setError(null);
    
    const loadComponent = async () => {
      try {
        // Import the client component
        const { ProjectPageClient } = await import('./client');
        setComponent(() => ProjectPageClient);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load project client:', err);
        setError('Failed to load project details');
        setLoading(false);
      }
    };

    loadComponent();
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
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  return <Component id={id} initialData={initialData} />;
} 