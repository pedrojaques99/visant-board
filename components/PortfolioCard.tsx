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
      <div className="bg-white rounded-lg overflow-hidden shadow-sm p-4">
        <p className="text-red-500 text-sm">Invalid portfolio item</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <Link href={`/portfolio/${item.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {hasValidImage && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.title || 'Project thumbnail'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              priority={false}
              quality={75}
            />
          ) : (
            <div 
              className="w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setShowDebug(!showDebug);
              }}
            >
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {item.title || 'Untitled Project'}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {item.client || 'No client specified'}
          </p>
          {item.type && (
            <span className="mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {item.type}
            </span>
          )}
          {process.env.NODE_ENV === 'development' && showDebug && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 