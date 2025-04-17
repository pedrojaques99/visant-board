'use client';

import { getPortfolioItemById } from '@/utils/coda';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { Share2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ColorThief from 'colorthief';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ProjectMedia3D } from '@/components/project-media-3d';
import { PortfolioCard } from '@/components/PortfolioCard';
import { CTASection } from '@/components/cta-section';

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

export default function ProjectPage({ params }: Props) {
  const { messages, locale } = useI18n();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [show3D, setShow3D] = useState(false);

  const analyzeImageColor = useCallback(async (imageUrl: string) => {
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
      const palette = colorThief.getPalette(img, 5); // Aumentado para 5 cores para mais opções
      
      // Encontrar a cor mais vibrante do palette para usar como accent
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

      // Calculate background color with proper contrast
      const bgColor = adjustColorBrightness(dominant, 0.15);
      const textColor = adjustColorForContrast(bgColor, '#ffffff');
      
      // Ensure accent color has good contrast with background
      const accentWithContrast = adjustColorForContrast(bgColor, accent, 4.5);
      
      // Create a lighter/darker version of accent for hover states
      const accentHover = calculateTextColor(accentWithContrast) === '#ffffff' 
        ? adjustColorBrightness(accentWithContrast, 1.2)
        : adjustColorBrightness(accentWithContrast, 0.8);

      setColorPalette({
        dominant: bgColor,
        secondary: textColor,
        accent: accentWithContrast
      });

      // Apply color scheme to CSS variables with guaranteed contrast
      document.documentElement.style.setProperty('--project-bg', bgColor);
      document.documentElement.style.setProperty('--project-text', textColor);
      document.documentElement.style.setProperty('--project-accent', accentWithContrast);
      document.documentElement.style.setProperty('--project-accent-hover', accentHover);
    } catch (error) {
      console.error('Error analyzing image color:', error);
      // Fallback to safe, high-contrast colors
      const fallbackColors = {
        bg: '#1a1a1a',
        text: '#ffffff',
        accent: '#52ddeb'
      };
      setColorPalette({
        dominant: fallbackColors.bg,
        secondary: fallbackColors.text,
        accent: fallbackColors.accent
      });
      document.documentElement.style.setProperty('--project-bg', fallbackColors.bg);
      document.documentElement.style.setProperty('--project-text', fallbackColors.text);
      document.documentElement.style.setProperty('--project-accent', fallbackColors.accent);
      document.documentElement.style.setProperty('--project-accent-hover', '#3ac8d6');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current project and related projects in parallel
        const [projectResponse, allProjectsResponse] = await Promise.all([
          fetch(`/api/portfolio/${params.id}`),
          fetch('/api/portfolio')
        ]);
        
        if (!mounted) return;

        if (!projectResponse.ok) {
          throw new Error(`Failed to fetch project: ${projectResponse.status}`);
        }
        
        const result = await projectResponse.json();
        
        if (!result.success || !result.item) {
          setError('Project not found');
          return;
        }

        setItem(result.item);

        // Pre-load thumbnail image for color analysis
        if (result.item.thumb) {
          const img = document.createElement('img');
          img.crossOrigin = 'Anonymous';
          img.src = result.item.thumb;
        }

        // Process related projects if available
        if (allProjectsResponse.ok) {
          const allProjects = await allProjectsResponse.json();
          if (allProjects.success && allProjects.items) {
            const related = allProjects.items
              .filter((p: any) => p.type === result.item.type && p.id !== result.item.id)
              .slice(0, 3);
            setRelatedProjects(related);
          }
        }

        // Analyze colors after setting the item
        if (result.item.thumb) {
          await analyzeImageColor(result.item.thumb);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load project details');
          console.error(error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      document.documentElement.style.removeProperty('--project-bg');
      document.documentElement.style.removeProperty('--project-text');
      document.documentElement.style.removeProperty('--project-accent');
      document.documentElement.style.removeProperty('--project-accent-hover');
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
      <div 
        className="border-b bg-background" 
      >
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
                  <Link 
                    href={`/portfolio?type=${encodeURIComponent(item.type)}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full border opacity-80 hover:opacity-100 transition-all"
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
                onClick={() => setShow3D(!show3D)}
                className="transition-all duration-300 w-full sm:w-auto"
              >
                {show3D ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {show3D ? 
                  t(messages, 'portfolio.hide3D', locale === 'pt' ? 'Ocultar 3D' : 'Hide 3D') : 
                  t(messages, 'portfolio.view3D', locale === 'pt' ? 'Ver em 3D' : 'View 3D')
                }
              </Button>
            )}
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
        </div>

        {/* Project description */}
        {currentDescription && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t(messages, 'portfolio.description', locale === 'pt' ? 'Descrição' : 'Description')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">{currentDescription}</p>
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

        {/* Project 3D View */}
        {item.model3d && show3D && (
          <div className="mb-8 sm:mb-16">
            <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl">
              <div className="h-[400px] sm:h-[500px]">
                <ProjectMedia3D 
                  modelUrl={item.model3d}
                  color={colorPalette?.accent || '#52ddeb'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Project images with responsive gap */}
        {images.length > 0 ? (
          <div className="grid gap-2 sm:gap-1 mb-8 sm:mb-16">
            {images.map((imageUrl, index) => (
              <div 
                key={imageUrl} 
                className="relative w-full overflow-hidden bg-muted rounded-lg sm:rounded-lg"
              >
                <Image
                  src={imageUrl}
                  alt={`${item.title || t(messages, 'portfolio.project', 'Project')} - Image ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={index === 0 ? 90 : 75}
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
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t(messages, 'portfolio.credits', locale === 'pt' ? 'Créditos' : 'Credits')}
            </h2>
            <div className="text-base sm:text-lg text-muted-foreground whitespace-pre-wrap">{item.credits}</div>
          </div>
        )}

        {/* Call to Action */}
        <CTASection 
          variant="dynamic"
          gradientFrom={colorPalette?.accent || 'var(--primary)'}
          gradientTo="var(--project-bg)"
          textColor="var(--project-text)"
          buttonColor={colorPalette?.accent || 'var(--primary)'}
          buttonTextColor="var(--project-text)"
          className="mt-8"
        />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="max-w-7xl mx-auto mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl font-bold mb-8"
            >
              {t(messages, 'portfolio.relatedProjects', locale === 'pt' ? 'Projetos Relacionados' : 'Related Projects')}
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <PortfolioCard item={project} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
} 