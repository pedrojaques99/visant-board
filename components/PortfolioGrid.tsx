'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { PortfolioCard } from './PortfolioCard';

interface PortfolioGridProps {
  items: PortfolioItem[];
  tipos: string[];
}

export function PortfolioGrid({ items, tipos }: PortfolioGridProps) {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  const filteredItems = selectedTipo
    ? items.filter((item) => item.type === selectedTipo)
    : items;

  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No portfolio items found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter buttons */}
      {tipos.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedTipo(null)}
            className={`px-6 py-3 rounded-full text-base font-medium transition-colors
              ${!selectedTipo 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'}`}
          >
            All
          </button>
          {tipos.map((tipo) => (
            <button
              key={tipo}
              onClick={() => setSelectedTipo(tipo)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-colors
                ${selectedTipo === tipo 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'}`}
            >
              {tipo}
            </button>
          ))}
        </div>
      )}

      {/* Pinterest-style masonry grid */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6 [&>*]:break-inside-avoid">
        {filteredItems.map((item) => (
          <div key={item.id} className="mb-6 transform transition-transform hover:scale-[1.01]">
            <PortfolioCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
} 