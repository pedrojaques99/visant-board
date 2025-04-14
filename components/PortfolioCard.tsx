'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PortfolioItem } from '@/utils/coda';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Validate image URL
  const imageUrl = typeof item.thumb === 'string' 
    ? item.thumb.trim() 
    : '';
  const hasValidImage = imageUrl.length > 0 && imageUrl.startsWith('http');

  // Validate item data
  if (!item || !item.id) {
    console.error('Invalid portfolio item:', item);
    return (
      <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm p-4">
        <p className="text-destructive text-sm">Invalid portfolio item</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <Link href={`/portfolio/${item.id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-muted/40 transition-all duration-300 hover:shadow-xl">
        {/* Image container with dynamic aspect ratio */}
        <div className="relative w-full">
          {hasValidImage && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.title || 'Portfolio item'}
              width={3840}
              height={2160}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 95vw, (max-width: 1280px) 45vw, 45vw"
              onError={() => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              priority={false}
              quality={90}
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Overlay with project info */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
            <h3 className="text-2xl font-semibold text-foreground line-clamp-2 mb-3">
              {item.title || 'Untitled Project'}
            </h3>
            {item.type && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-medium">
                {item.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 