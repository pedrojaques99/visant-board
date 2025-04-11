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
  const imageUrl = typeof item.image01 === 'string' 
    ? item.image01.trim() 
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
    <Link href={`/portfolio/${item.id}`} className="group block">
      <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {hasValidImage && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.title || 'Project thumbnail'}
              fill
              className="object-cover group-hover:scale-95 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              onError={() => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              priority={false}
              quality={75}
            />
          ) : (
            <div 
              className="w-full h-full bg-muted flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setShowDebug(!showDebug);
              }}
            >
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
              {item.type}
            </span>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {item.title || 'Untitled Project'}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {item.client || 'No client specified'}
          </p>
          {process.env.NODE_ENV === 'development' && showDebug && (
            <div className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              <pre className="text-muted-foreground">{JSON.stringify(item, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 