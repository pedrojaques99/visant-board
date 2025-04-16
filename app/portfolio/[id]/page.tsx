'use client';

import { getPortfolioItemById } from '@/utils/coda';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { Share2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ColorThief from 'colorthief';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Props {
  params: {
    id: string;
  };
}

interface ColorPalette {
  dominant: string;
  secondary: string;
  accent: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function adjustColorBrightness(color: string, factor: number): string {
  const rgb = color.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const adjusted = rgb.map(c => Math.min(255, Math.floor(c * factor)));
  return rgbToHex(adjusted[0], adjusted[1], adjusted[2]);
}

function calculateTextColor(bgColor: string): string {
  const rgb = bgColor.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

export default function ProjectPage({ params }: Props) {
  const { messages, locale } = useI18n();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const analyzeImageColor = useCallback(async (imageUrl: string) => {
    try {
      const colorThief = new ColorThief();
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const [r, g, b] = colorThief.getColor(img);
      const palette = colorThief.getPalette(img, 3);
      const [r2, g2, b2] = palette[1];
      const [r3, g3, b3] = palette[2];

      const dominant = rgbToHex(r, g, b);
      const secondary = rgbToHex(r2, g2, b2);
      const accent = rgbToHex(r3, g3, b3);

      setColorPalette({
        dominant,
        secondary,
        accent
      });

      // Apply color scheme to CSS variables
      document.documentElement.style.setProperty('--project-bg', `${adjustColorBrightness(dominant, 0.15)}`);
      document.documentElement.style.setProperty('--project-text', calculateTextColor(dominant));
      document.documentElement.style.setProperty('--project-accent', accent);
    } catch (error) {
      console.error('Error analyzing image color:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/portfolio/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.item) {
          setError('Project not found');
          return;
        }
        setItem(result.item);

        // Analyze the first image's color once data is loaded
        if (result.item.thumb) {
          await analyzeImageColor(result.item.thumb);
        }
      } catch (error) {
        setError('Failed to load project details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to reset color scheme
    return () => {
      document.documentElement.style.removeProperty('--project-bg');
      document.documentElement.style.removeProperty('--project-text');
      document.documentElement.style.removeProperty('--project-accent');
    };
  }, [params.id, analyzeImageColor]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title || 'Visant Portfolio Project',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return notFound();
  }
  
  // Format date if available
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  
  // Collect all valid images
  const images = Array.from({ length: 25 }, (_, i) => {
    const key = `image${String(i + 1).padStart(2, '0')}` as keyof typeof item;
    return item[key];
  })
    .filter((url): url is string => typeof url === 'string')
    .map(url => url.trim())
    .filter(url => url.length > 0 && url.startsWith('http'));

  const breadcrumbItems = [
    { label: t(messages, 'common.home', 'Home'), href: '/' },
    { label: t(messages, 'portfolio.title', 'Portfolio'), href: '/portfolio' },
    { label: item.title || t(messages, 'portfolio.projectDetails', 'Project Details') },
  ];

  // Get the description based on current language
  const currentDescription = locale === 'pt' ? item?.ptbr : item?.description;

  return (
    <main 
      className="min-h-screen antialiased pb-12 transition-colors duration-1000"
      style={{
        backgroundColor: 'var(--project-bg, var(--background))',
        color: 'var(--project-text, var(--foreground))'
      }}
    >
      <div className="border-b" style={{ backgroundColor: 'var(--project-accent, var(--muted))' }}>
        <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8">
        {/* Project header with share button */}
        <div className="mb-6 sm:mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              {item.title || t(messages, 'portfolio.untitledProject', 'Untitled Project')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 opacity-80 text-sm sm:text-base">
              <span>{item.client || t(messages, 'portfolio.noClient', 'No client specified')}</span>
              {formattedDate && (
                <>
                  <span className="opacity-60">•</span>
                  <span>{formattedDate}</span>
                </>
              )}
              {item.type && (
                <>
                  <span className="opacity-60">•</span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full border opacity-80">
                    {item.type}
                  </span>
                </>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "sm"}
            onClick={handleShare}
            className={cn(
              "transition-all duration-300 w-full sm:w-auto",
              copied ? "bg-[var(--project-accent)] text-[var(--project-text)]" : ""
            )}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? t(messages, 'common.copied', 'Copied!') : t(messages, 'common.share', 'Share')}
          </Button>
        </div>

        {/* Project description */}
        {currentDescription && (
          <div className="prose max-w-none mb-8 sm:mb-12" style={{ color: 'var(--project-text)' }}>
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                {t(messages, 'portfolio.description', locale === 'pt' ? 'Descrição' : 'Description')}
              </h2>
              <p className="text-base sm:text-lg opacity-80">{currentDescription}</p>
            </div>
          </div>
        )}

        {/* Project Video - Show First */}
        {item.video && (
          <div className="mb-8 sm:mb-16">
            <div className="relative w-full overflow-hidden bg-muted aspect-video rounded-lg sm:rounded-xl shadow-lg">
              <iframe
                src={item.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Project images with responsive gap */}
        {images.length > 0 ? (
          <div className="grid gap-2 sm:gap-1 mb-8 sm:mb-16">
            {images.map((imageUrl, index) => (
              <div 
                key={imageUrl} 
                className="relative w-full overflow-hidden bg-muted rounded-lg sm:rounded-none"
              >
                <Image
                  src={imageUrl}
                  alt={`${item.title || t(messages, 'portfolio.project', 'Project')} - Image ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                  priority={index === 0}
                  quality={90}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 rounded-lg border border-border bg-muted/40 mb-8 sm:mb-16">
            <p className="text-muted-foreground">{t(messages, 'portfolio.noImages', 'No images available for this project')}</p>
          </div>
        )}

        {/* Project Credits */}
        {item.credits && (
          <div className="mb-8 sm:mb-16 prose max-w-none">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              {t(messages, 'portfolio.credits', locale === 'pt' ? 'Créditos' : 'Credits')}
            </h2>
            <div className="text-base sm:text-lg opacity-80 whitespace-pre-wrap">{item.credits}</div>
          </div>
        )}

        {/* Call to Action */}
        <section 
          className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden rounded-xl sm:rounded-2xl mt-8"
          style={{ 
            background: `linear-gradient(to bottom, ${colorPalette?.accent || 'var(--primary)'}, var(--project-bg))`,
            color: 'var(--project-text)'
          }}
        >
          <div className="absolute inset-0 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}     
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8"
            >
              {t(messages, 'about.cta', locale === 'pt' ? 'Procurando uma identidade visual marcante?' : 'Looking for a bold visual identity?')}
            </motion.h2>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                style={{ 
                  backgroundColor: colorPalette?.accent || 'var(--primary)',
                  color: 'var(--project-text)'
                }}
              >
                {t(messages, 'about.getInTouch', locale === 'pt' ? 'Entre em contato' : 'Get in touch')}
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
} 