'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { Share2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ColorThief from 'colorthief';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ProjectMedia3D } from '@/components/project-media-3d';
import { PortfolioCard } from '@/components/PortfolioCard';
import { CTASection } from '@/components/cta-section';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Image from 'next/image';
import { PortfolioItem } from '@/utils/coda';

interface ColorPalette {
  dominant: string;
  secondary: string;
  accent: string;
}

interface Props {
  id: string;
  initialData: PortfolioItem;
  relatedProjects: PortfolioItem[];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Calculate relative luminance for WCAG contrast ratio
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Adjust color to meet minimum contrast ratio
function adjustColorForContrast(bgColor: string, textColor: string, minContrast: number = 4.5): string {
  const bg = bgColor.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const text = textColor.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [255, 255, 255];
  
  const bgLuminance = getLuminance(bg[0], bg[1], bg[2]);
  const textLuminance = getLuminance(text[0], text[1], text[2]);
  let contrast = getContrastRatio(bgLuminance, textLuminance);
  
  // If contrast is insufficient, adjust text color
  if (contrast < minContrast) {
    const adjustedText = textLuminance > bgLuminance 
      ? [255, 255, 255]  // Make lighter
      : [0, 0, 0];       // Make darker
    return rgbToHex(adjustedText[0], adjustedText[1], adjustedText[2]);
  }
  
  return textColor;
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

// Add a new function to ensure text contrast
function ensureTextContrast(bgColor: string, textColor: string): string {
  const bgBrightness = (parseInt(bgColor.slice(1, 3), 16) * 299 +
    parseInt(bgColor.slice(3, 5), 16) * 587 +
    parseInt(bgColor.slice(5, 7), 16) * 114) / 1000;
  
  const textBrightness = (parseInt(textColor.slice(1, 3), 16) * 299 +
    parseInt(textColor.slice(3, 5), 16) * 587 +
    parseInt(textColor.slice(5, 7), 16) * 114) / 1000;
  
  const contrast = Math.abs(bgBrightness - textBrightness);
  
  // If contrast is too low, return the opposite color
  return contrast < 128 ? (bgBrightness > 128 ? '#000000' : '#ffffff') : textColor;
}

// Add new helper function for color mixing
function mixColors(color1: string, color2: string, weight: number): string {
  const c1 = color1.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const c2 = color2.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  
  const mixed = c1.map((channel, i) => {
    const mix = Math.round(channel * weight + c2[i] * (1 - weight));
    return Math.min(255, Math.max(0, mix));
  });
  
  return rgbToHex(mixed[0], mixed[1], mixed[2]);
}

// Add new helper for alpha colors
function addAlpha(color: string, alpha: number): string {
  const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function ProjectPageClient({ id, initialData, relatedProjects }: Props) {
  const { messages, locale } = useI18n();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [item, setItem] = useState<PortfolioItem>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [show3DModal, setShow3DModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeImageColor = useCallback(async (imageUrl: string) => {
    if (!mounted) return;

    try {
      const colorThief = new ColorThief();
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const [r, g, b] = colorThief.getColor(img);
      const palette = colorThief.getPalette(img, 5);
      
      const vibrantColor = palette.reduce((most, current) => {
        const [r, g, b] = current;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
        const brightness = (r + g + b) / 3;
        const vibrancy = saturation * brightness;
        
        if (vibrancy > most.vibrancy) {
          return { color: current, vibrancy };
        }
        return most;
      }, { color: palette[0], vibrancy: 0 }).color;

      const [r3, g3, b3] = vibrantColor;

      const dominant = rgbToHex(r, g, b);
      const accent = rgbToHex(r3, g3, b3);

      const currentTheme = resolvedTheme || 'light';
      const baseBackground = currentTheme === 'dark' ? '#000000' : '#ffffff';
      const baseText = currentTheme === 'dark' ? '#ffffff' : '#000000';
      
      const bgColor = currentTheme === 'dark'
        ? mixColors(dominant, baseBackground, 0.85)
        : mixColors(dominant, baseBackground, 0.15);
      
      const textColor = currentTheme === 'dark'
        ? adjustColorForContrast(bgColor, baseText, 7)
        : adjustColorForContrast(bgColor, baseText, 5);
      
      const baseAccent = currentTheme === 'dark'
        ? mixColors(accent, '#ffffff', 0.8)
        : mixColors(accent, '#000000', 0.2);
      
      const accentWithContrast = adjustColorForContrast(bgColor, baseAccent, 4.5);
      
      const accentHover = currentTheme === 'dark'
        ? adjustColorBrightness(accentWithContrast, 1.3)
        : adjustColorBrightness(accentWithContrast, 0.7);

      setColorPalette({
        dominant: bgColor,
        secondary: textColor,
        accent: accentWithContrast
      });

      if (mounted) {
        document.documentElement.style.setProperty('--project-bg', bgColor);
        document.documentElement.style.setProperty('--project-bg-alpha', addAlpha(bgColor, 0.97));
        document.documentElement.style.setProperty('--project-text', textColor);
        document.documentElement.style.setProperty('--project-text-alpha', addAlpha(textColor, 0.85));
        document.documentElement.style.setProperty('--project-accent', accentWithContrast);
        document.documentElement.style.setProperty('--project-accent-hover', accentHover);
        document.documentElement.style.setProperty('--project-accent-alpha', addAlpha(accentWithContrast, 0.15));
        
        const mutedText = currentTheme === 'dark'
          ? adjustColorBrightness(textColor, 0.7)
          : adjustColorBrightness(textColor, 1.3);
        document.documentElement.style.setProperty('--project-muted', mutedText);
      }
      
    } catch (error) {
      console.error('Error analyzing image color:', error);
      const currentTheme = resolvedTheme || 'light';
      const fallbackColors = currentTheme === 'dark'
        ? {
            bg: '#121212',
            bgAlpha: 'rgba(18, 18, 18, 0.97)',
            text: '#ffffff',
            textAlpha: 'rgba(255, 255, 255, 0.85)',
            accent: '#52ddeb',
            accentHover: '#3ac8d6',
            accentAlpha: 'rgba(82, 221, 235, 0.15)',
            muted: 'rgba(255, 255, 255, 0.7)'
          }
        : {
            bg: '#ffffff',
            bgAlpha: 'rgba(255, 255, 255, 0.97)',
            text: '#000000',
            textAlpha: 'rgba(0, 0, 0, 0.85)',
            accent: '#0070f3',
            accentHover: '#0060c0',
            accentAlpha: 'rgba(0, 112, 243, 0.15)',
            muted: 'rgba(0, 0, 0, 0.7)'
          };
      
      setColorPalette({
        dominant: fallbackColors.bg,
        secondary: fallbackColors.text,
        accent: fallbackColors.accent
      });
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (mounted && item.thumb) {
      analyzeImageColor(item.thumb);
    }
  }, [mounted, item.thumb, analyzeImageColor]);

  // Add ESC key handler for fullscreen image
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  // Format date if available
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  
  // Collect all valid media (images and videos)
  const media = Array.from({ length: 25 }, (_, i) => {
    const key = `image${String(i + 1).padStart(2, '0')}` as keyof typeof item;
    return item[key];
  })
    .filter((url): url is string => typeof url === 'string')
    .map(url => url.trim())
    .filter(url => url.length > 0 && url.startsWith('http'))
    .map(url => ({
      url,
      type: url.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
    }));

  const breadcrumbItems = [
    { label: t(messages, 'common.home', 'Home'), href: '/' },
    { label: t(messages, 'portfolio.title', 'Portfolio'), href: '/portfolio' },
    { label: item.title || t(messages, 'portfolio.projectDetails', 'Project Details') },
  ];

  // Get the description based on current language
  const currentDescription = locale === 'pt' ? item?.ptbr : item?.description;

  return (
    <main className="min-h-screen antialiased pb-12 transition-colors duration-1000 bg-[var(--project-bg)] text-[var(--project-text)]">
      <div className="border-b border-[var(--project-accent-alpha)] bg-[var(--project-bg-alpha)]">
        <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumb 
            items={breadcrumbItems} 
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8">
        {/* Project header with share button */}
        <div className="mb-6 sm:mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              {item.title || t(messages, 'portfolio.untitledProject', 'Untitled Project')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base" style={{ color: 'var(--project-text-alpha)' }}>
              <span>{item.client || t(messages, 'portfolio.noClient', 'No client specified')}</span>
              {formattedDate && (
                <>
                  <span style={{ color: 'var(--project-accent-alpha)' }}>•</span>
                  <span>{formattedDate}</span>
                </>
              )}
              {item.type && (
                <>
                  <span style={{ color: 'var(--project-accent-alpha)' }}>•</span>
                  <Link 
                    href={`/portfolio?type=${encodeURIComponent(item.type)}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full border transition-all hover:border-accent/50 hover:bg-accent/5"
                    style={{
                      borderColor: 'var(--project-accent-alpha)',
                      color: 'var(--project-accent)',
                      backgroundColor: 'var(--project-accent-alpha)'
                    }}
                  >
                    {item.type}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {item.model3d && (
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "sm"}
                onClick={() => setShow3DModal(true)}
                className="transition-all duration-300 w-full sm:w-auto border-[var(--project-accent-alpha)] hover:border-[var(--project-accent)] hover:bg-[var(--project-accent-alpha)]"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t(messages, 'portfolio.show3D', 'Ver em 3D')}
              </Button>
            )}
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "sm"}
              onClick={handleShare}
              className={cn(
                "transition-all duration-300 w-full sm:w-auto border-[var(--project-accent-alpha)] hover:border-[var(--project-accent)] hover:bg-[var(--project-accent-alpha)]",
                copied ? "bg-[var(--project-accent)] text-[var(--project-bg)]" : ""
              )}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {copied ? 
                t(messages, 'common.copied', 'Copiado!') : 
                t(messages, 'common.share', 'Compartilhar')
              }
            </Button>
          </div>
        </div>

        {/* Project description */}
        {currentDescription && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t(messages, 'portfolio.description', locale === 'pt' ? 'Descrição' : 'Description')}
            </h2>
            <div 
              className="text-base sm:text-lg whitespace-pre-wrap break-words" 
              style={{ color: 'var(--project-text-alpha)' }}
              dangerouslySetInnerHTML={{ __html: currentDescription }}
            />
          </div>
        )}

        {/* Project 3D View Dialog */}
        <Dialog open={show3DModal} onOpenChange={setShow3DModal}>
          <DialogContent className="max-w-4xl h-[80vh] p-0 bg-[var(--project-bg)] border-[var(--project-accent-alpha)]">
            <DialogHeader className="absolute top-2 right-2 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShow3DModal(false)}
                className="p-2 h-8 w-8 rounded-full border-[var(--project-accent-alpha)] hover:border-[var(--project-accent)] hover:bg-[var(--project-accent-alpha)]"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="w-full h-full">
              <ProjectMedia3D 
                modelUrl={item.model3d || ''}
                color={colorPalette?.accent || '#52ddeb'}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Project Video */}
        {item.video && (
          <div className="mb-8 sm:mb-16">
            <div className="relative w-full overflow-hidden bg-muted aspect-video rounded-lg sm:rounded-xl shadow-lg">
              <video
                src={item.video}
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                loop
                muted
                playsInline
                autoPlay
              />
            </div>
          </div>
        )}

        {/* Project media with fullscreen capability */}
        {media.length > 0 ? (
          <div className="grid gap-2 sm:gap-1 mb-8 sm:mb-16">
            {media.map((mediaItem, index) => (
              <div 
                key={mediaItem.url} 
                className="relative w-full overflow-hidden bg-muted rounded-lg sm:rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(mediaItem.url)}
              >
                {mediaItem.type === 'video' ? (
                  <video
                    src={mediaItem.url}
                    className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
                    controls
                    loop
                    muted
                    playsInline
                    autoPlay
                  />
                ) : (
                  <Image
                    src={mediaItem.url}
                    alt={`${item.title || t(messages, 'portfolio.project', 'Project')} - Media ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={index === 0 ? 90 : 75}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzUvLy0vMC4uLzU1LzU1LzU1LzU1LzU1LzU1LzU1LzU1LzX/2wBDARUXFycdHx0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHy0dHX/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    onError={(e) => {
                      console.error('Image failed to load:', mediaItem.url);
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/fallback.jpg';
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 rounded-lg border border-[var(--project-accent-alpha)] bg-[var(--project-bg-alpha)] mb-8 sm:mb-16">
            <p style={{ color: 'var(--project-text-alpha)' }}>{t(messages, 'portfolio.noMedia', 'No media available for this project')}</p>
          </div>
        )}

        {/* Fullscreen Media Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 border-white/20 hover:border-white/40"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
            {selectedImage.toLowerCase().endsWith('.mp4') ? (
              <video
                src={selectedImage}
                className="max-h-[90vh] w-auto object-contain"
                onClick={(e) => e.stopPropagation()}
                controls
                loop
                muted
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={selectedImage}
                alt={item.title || t(messages, 'portfolio.project', 'Project')}
                width={1920}
                height={1080}
                className="max-h-[90vh] w-auto object-contain"
                onClick={(e) => e.stopPropagation()}
                quality={100}
              />
            )}
          </div>
        )}

        {/* Project Credits */}
        {item.credits && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t(messages, 'portfolio.credits', locale === 'pt' ? 'Créditos' : 'Credits')}
            </h2>
            <div 
              className="text-base sm:text-lg whitespace-pre-wrap break-words" 
              style={{ color: 'var(--project-text-alpha)' }} 
              dangerouslySetInnerHTML={{ __html: item.credits }}
            />
          </div>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl font-bold mb-8"
              style={{ color: 'var(--project-text)' }}
            >
              {t(messages, 'portfolio.relatedProjects', locale === 'pt' ? 'Projetos Relacionados' : 'Related Projects')}
            </motion.h2>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PortfolioCard item={project} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <CTASection 
          variant="dynamic"
          gradientFrom={`${colorPalette?.accent}15` || 'var(--primary)15'}
          gradientTo="var(--project-bg)"
          textColor="var(--project-text)"
          buttonColor="var(--project-accent)"
          buttonTextColor="var(--project-bg)"
          className="mt-16 rounded-xl overflow-hidden border border-[var(--project-accent-alpha)] bg-[var(--project-bg-alpha)]"
          title={t(messages, 'about.cta', 'Looking for a bold visual identity?')}
          buttonText={t(messages, 'about.getInTouch', 'Get in touch')}
          isWhatsApp={true}
        />
      </div>
    </main>
  );
} 