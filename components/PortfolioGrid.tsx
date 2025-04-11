'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { PortfolioCard } from './PortfolioCard';
import { FilterBar } from './FilterBar';

interface PortfolioGridProps {
  items: PortfolioItem[];
  tipos: string[];
}

export function PortfolioGrid({ items, tipos }: PortfolioGridProps) {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  if (!items || !Array.isArray(items)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: Invalid portfolio items data</p>
      </div>
    );
  }

  const filteredItems = selectedTipo
    ? items.filter(item => item.type === selectedTipo)
    : items;

  return (
    <div>
      <FilterBar
        tipos={tipos}
        selectedTipo={selectedTipo}
        onTipoChange={setSelectedTipo}
      />
      
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found for this category.</p>
        </div>
      )}
    </div>
  );
} 