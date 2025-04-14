'use client';

import { useState, useEffect } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { PortfolioCard } from './PortfolioCard';
import { cn } from "@/lib/utils";
import { LayoutGrid } from 'lucide-react';

interface PortfolioGridProps {
  items: PortfolioItem[];
  tipos: string[];
}

export function PortfolioGrid({ items, tipos }: PortfolioGridProps) {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [cardSize, setCardSize] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  const displayToActualSize = (display: number) => Math.min(display, 0.99);
  const actualToDisplaySize = (actual: number) => Math.min(actual, 1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getResponsiveColumns = () => {
    if (isMobile) return 1;
    return columns;
  };

  const GAP = 24; // 1.5rem in pixels

  return (
    <div className="space-y-6 relative">
      {/* Layout controls toggle */}
      <div className="absolute top-0 right-4 z-10">
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-full border border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors bg-background/80 backdrop-blur-sm"
          aria-label="Toggle layout controls"
        >
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {showControls && (
          <div className="absolute right-0 mt-2 w-56 p-4 rounded-lg border border-muted-foreground/20 bg-background/80 backdrop-blur-sm space-y-4">
            {/* Column selector - hidden on mobile */}
            {!isMobile && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Columns</span>
                  <span className="text-sm text-muted-foreground">{columns}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((col) => (
                    <button
                      key={col}
                      onClick={() => setColumns(col)}
                      className={cn(
                        "flex-1 h-8 rounded-md transition-all",
                        columns === col
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Size</span>
                <span className="text-sm text-muted-foreground">{Math.round(actualToDisplaySize(cardSize) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1"
                step="0.01"
                value={actualToDisplaySize(cardSize)}
                onChange={(e) => setCardSize(displayToActualSize(parseFloat(e.target.value)))}
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
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors border ${
                !selectedTipo 
                  ? 'border-primary text-primary hover:bg-primary/5' 
                  : 'border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40'
              }`}
            >
              All
            </button>
            {tipos.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setSelectedTipo(tipo)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors border ${
                  selectedTipo === tipo 
                    ? 'border-primary text-primary hover:bg-primary/5' 
                    : 'border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid container with consistent gap */}
      <div 
        className="px-6"
        style={{
          columnCount: getResponsiveColumns(),
          columnGap: `${GAP}px`,
        }}
      >
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="inline-block w-full break-inside-avoid"
            style={{
              transform: `scale(${displayToActualSize(cardSize)})`,
              transformOrigin: 'top center',
              marginBottom: `${GAP}px`,
            }}
          >
            <PortfolioCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
} 