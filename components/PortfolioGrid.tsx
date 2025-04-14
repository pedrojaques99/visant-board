'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { PortfolioCard } from './PortfolioCard';
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';

interface PortfolioGridProps {
  items: PortfolioItem[];
  tipos: string[];
}

export function PortfolioGrid({ items, tipos }: PortfolioGridProps) {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [cardSize, setCardSize] = useState(1);
  const [showControls, setShowControls] = useState(false);

  const sizeOptions = [
    { value: 0.7, label: '70%', columns: 4 },
    { value: 0.8, label: '80%', columns: 3 },
    { value: 0.9, label: '90%', columns: 2 },
    { value: 1.0, label: '100%', columns: 1 },
  ];

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

  const currentSizeOption = sizeOptions.find(option => option.value === cardSize) || sizeOptions[3];

  return (
    <div className="space-y-6 relative">
      {/* Size controls toggle */}
      <div className="absolute top-0 right-4 z-10">
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-full border border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors bg-background/80 backdrop-blur-sm"
          aria-label="Toggle size controls"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {showControls && (
          <div className="absolute right-0 mt-2 w-48 p-3 rounded-lg border border-muted-foreground/20 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Size</span>
                <span className="text-sm text-muted-foreground">{Math.round(cardSize * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1"
                step="0.1"
                value={cardSize}
                onChange={(e) => setCardSize(parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 px-4 sm:px-6">
        {/* Filter buttons */}
        {tipos.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTipo(null)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors
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
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors
                  ${selectedTipo === tipo 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'}`}
              >
                {tipo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pinterest-style masonry grid */}
      <div className={cn(
        "[&>*]:break-inside-avoid px-3 sm:px-4",
        cardSize === 1.0 ? "space-y-8" : 
        "columns-1 sm:columns-2",
        cardSize !== 1.0 && `lg:columns-${currentSizeOption.columns}`,
        cardSize === 0.9 ? "gap-3" :
        "gap-1"
      )}>
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "transform transition-all duration-300 hover:scale-[1.01]",
              cardSize !== 1.0 && (
                cardSize === 0.9 ? "mb-3" : "mb-1"
              )
            )}
            style={{
              transform: `scale(${cardSize})`,
              transformOrigin: 'top center',
              margin: cardSize === 1.0 ? '0' : `0 ${(1 - cardSize) * 0.1}rem`
            }}
          >
            <PortfolioCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
} 