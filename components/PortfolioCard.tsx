'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { PortfolioItem } from '@/utils/coda';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { isValidImageUrl } from '@/utils/image-helper';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hoverImageErrors, setHoverImageErrors] = useState<Record<string, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedHoverImages, setLoadedHoverImages] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const { messages } = useI18n();
  
  // Validate thumb image URL
  const thumbUrl = typeof item.thumb === 'string' 
    ? item.thumb.trim() 
    : '';
  const hasValidThumb = isValidImageUrl(thumbUrl);

  // Check if thumb is a video
  const isVideo = thumbUrl.toLowerCase().endsWith('.mp4');

  // Get all valid hover images (02 to 10)
  const hoverImages = Array.from({ length: 9 }, (_, i) => {
    const key = `image${String(i + 2).padStart(2, '0')}` as keyof typeof item;
    const url = typeof item[key] === 'string' ? item[key].trim() : '';
    return isValidImageUrl(url) ? url : null;
  }).filter((url): url is string => url !== null);

  // Validate item data
  if (!item || !item.id) {
    console.error('Invalid portfolio item (missing required fields):', item);
    return (
      <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm p-4">
        <p className="text-destructive text-sm">{t(messages, 'portfolio.invalidItem', 'Invalid portfolio item')}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // Handle video play/pause on hover
  useEffect(() => {
    if (!videoRef.current || !isVideo) return;
    videoRef.current.play().catch(console.error);
  }, [isVideo]);

  // Load hover images only when hovering
  useEffect(() => {
    if (!isHovering || hoverImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hoverImages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovering, hoverImages.length]);

  return (
    <Link href={`/portfolio/${item.id}`}>
      <div 
        className="group relative overflow-hidden rounded-xl bg-muted/40 transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setCurrentImageIndex(0);
        }}
      >
        <div className="relative w-full">
          {hasValidThumb && !imageError ? (
            <>
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={thumbUrl}
                  className="w-full object-cover transition-all duration-600"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                />
              ) : (
                <div className="relative">
                  <Image
                    src={thumbUrl}
                    alt={item.title || 'Portfolio item'}
                    width={800}
                    height={450}
                    className={`w-full object-cover transition-all duration-600 bg-transparent ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 768px) 95vw, (max-width: 1280px) 45vw, 45vw"
                    onError={(error) => {
                      const target = error.target as HTMLImageElement;
                      console.error('Image failed to load:', {
                        url: thumbUrl,
                        naturalWidth: target.naturalWidth,
                        naturalHeight: target.naturalHeight,
                        currentSrc: target.currentSrc,
                        loading: target.loading,
                        complete: target.complete,
                        error: error,
                        timestamp: new Date().toISOString(),
                      });
                      setImageError(true);
                    }}
                    onLoad={() => setIsLoaded(true)}
                    priority={true}
                    quality={60}
                    loading="eager"
                    unoptimized={true}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+OD5AQEBAR0dHSEhISFJSUlJSUlJSUlL/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                  )}
                </div>
              )}
              {isHovering && hoverImages.length > 0 && hoverImages.map((url, index) => (
                <Image
                  key={url}
                  src={url}
                  alt={`${item.title || 'Portfolio item'} - View ${index + 2}`}
                  width={800}
                  height={450}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 bg-transparent ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 95vw, (max-width: 1280px) 45vw, 45vw"
                  onError={(error) => {
                    const target = error.target as HTMLImageElement;
                    console.error('Hover image failed to load:', {
                      url,
                      index,
                      naturalWidth: target.naturalWidth,
                      naturalHeight: target.naturalHeight,
                      currentSrc: target.currentSrc,
                      loading: target.loading,
                      complete: target.complete,
                      error: error,
                      timestamp: new Date().toISOString(),
                    });
                    setHoverImageErrors(prev => ({ ...prev, [url]: true }));
                  }}
                  onLoad={() => {
                    setLoadedHoverImages(prev => ({ ...prev, [url]: true }));
                  }}
                  priority={false}
                  quality={60}
                  loading="lazy"
                  unoptimized={true}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+OD5AQEBAR0dHSEhISFJSUlJSUlJSUlL/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              ))}
            </>
          ) : (
            <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎨</div>
                <span className="text-muted-foreground text-sm">{t(messages, 'portfolio.comingSoon', 'Coming soon')}</span>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="max-w-[80%] flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-white line-clamp-2">
                {item.title || 'Untitled Project'}
              </h3>
              {item.type && (
                <span className="inline-block px-2 py-0.5 rounded-full border border-white/20 text-white text-xs font-medium whitespace-nowrap">
                  {item.type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 