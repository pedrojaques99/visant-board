'use client';

import { getPortfolioItemById } from '@/utils/coda';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: Props) {
  const { messages } = useI18n();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use API route instead of direct function call
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
      } catch (error) {
        setError('Failed to load project details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

  return (
    <main className="min-h-screen bg-background antialiased pb-12">
      <div className="border-b bg-muted/40">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Project header with share button */}
        <div className="mb-8 sm:mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              {item.title || t(messages, 'portfolio.untitledProject', 'Untitled Project')}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-muted-foreground">{item.client || t(messages, 'portfolio.noClient', 'No client specified')}</span>
              {formattedDate && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground">{formattedDate}</span>
                </>
              )}
              {item.type && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full border border-muted-foreground/20 text-muted-foreground">
                    {item.type}
                  </span>
                </>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className={cn(
              "transition-all duration-300",
              copied ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? t(messages, 'common.copied', 'Copied!') : t(messages, 'common.share', 'Share')}
          </Button>
        </div>

        {/* Project description */}
        {(item.description || item.ptbr) && (
          <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
            {item.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-foreground">{t(messages, 'portfolio.description', 'Description')}</h2>
                <p className="text-muted-foreground text-lg">{item.description}</p>
              </div>
            )}
            {item.ptbr && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">{t(messages, 'portfolio.portugueseDescription', 'Descrição')}</h2>
                <p className="text-muted-foreground text-lg">{item.ptbr}</p>
              </div>
            )}
          </div>
        )}

        {/* Project images with 1 gap */}
        {images.length > 0 ? (
          <div className="grid gap-1 mb-16">
            {images.map((imageUrl, index) => (
              <div 
                key={imageUrl} 
                className="relative w-full overflow-hidden bg-muted"
              >
                <Image
                  src={imageUrl}
                  alt={`${item.title || t(messages, 'portfolio.project', 'Project')} - Image ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={index === 0}
                  quality={90}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-border bg-muted/40 mb-16">
            <p className="text-muted-foreground">{t(messages, 'portfolio.noImages', 'No images available for this project')}</p>
          </div>
        )}

        {/* Project Video */}
        {item.video && (
          <div className="mb-16">
            <div className="relative w-full overflow-hidden bg-muted aspect-video rounded-lg">
              <iframe
                src={item.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Project Credits */}
        {item.credits && (
          <div className="mb-16 prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3 text-foreground">{t(messages, 'portfolio.credits', 'Credits')}</h2>
            <div className="text-muted-foreground text-lg whitespace-pre-wrap">{item.credits}</div>
          </div>
        )}

        {/* Call to Action */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-primary/40 to-background relative overflow-hidden rounded-2xl mt-8">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}     
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-foreground"
            >
              {t(messages, 'about.cta', 'Looking for a bold visual identity?')}
            </motion.h2>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold",
                  "hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300"
                )}
              >
                {t(messages, 'about.getInTouch', 'Get in touch')}
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
} 