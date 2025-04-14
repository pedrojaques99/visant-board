'use client';

import Hero from '@/components/hero';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/utils/coda';
import Image from 'next/image';

export default function Home() {
  const { messages } = useI18n();
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [activeProjectImage, setActiveProjectImage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success && data.items) {
          // Filter for branding projects and get the 4 most recent
          const brandingProjects = data.items
            .filter((item: PortfolioItem) => item.title.toLowerCase().includes('branding'))
            .sort((a: PortfolioItem, b: PortfolioItem) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 4);
          setLatestProjects(brandingProjects);
        }
      } catch (error) {
        console.error('Error fetching latest projects:', error);
      }
    };

    fetchLatestProjects();
  }, []);
  
  return (
    <main className="relative flex-1 h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-500 z-[5] p-4 sm:p-8 md:p-12 lg:p-20">
        {activeProjectImage && latestProjects.map(project => (
          project.id === activeProjectImage && (
            <div key={project.id} className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
                <Image
                  src={project.image02}
                  alt={`${project.title} - Image 1`}
                  fill
                  className="object-cover opacity-90"
                  priority
                />
              </div>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
                <Image
                  src={project.image03}
                  alt={`${project.title} - Image 2`}
                  fill
                  className="object-cover opacity-90"
                  priority
                />
              </div>
              <div className="relative col-span-1 sm:col-span-2 rounded-2xl sm:rounded-3xl overflow-hidden">
                <Image
                  src={project.image04}
                  alt={`${project.title} - Image 3`}
                  fill
                  className="object-cover opacity-90"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background pointer-events-none" />
            </div>
          )
        ))}
      </div>

      {/* Hero Section with 3D Logo */}
      <div className="absolute inset-0 w-full h-full -translate-y-[10vh] sm:-translate-y-[15vh] z-[1]">
        <Hero />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen pointer-events-none -translate-y-[10vh] sm:-translate-y-[15vh]">
        <div className="max-w-[90%] sm:max-w-2xl w-full space-y-4 sm:space-y-5 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t(messages, 'home.title', 'Welcome to Visant®')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
            <a
              href="/portfolio"
              className="group relative inline-flex items-center justify-center rounded-md bg-primary/90 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore o portfólio')}</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
            </a>
            <a
              href="/briefing"
              className="group relative inline-flex items-center justify-center rounded-md border border-primary/30 bg-background/50 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'home.startProject', 'Começar um projeto')}</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </a>
          </div>
        </div>

        {/* Interactive Hint */}
        <div className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 text-center opacity-30">
          <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
            {t(messages, 'home.interactionHint', 'Click and drag to interact with the 3D logo')}
          </p>
        </div>
      </div>

      {/* Fixed Footer with Latest Projects */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 pointer-events-auto z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-16">
            <span className="text-xs text-muted-foreground font-medium">
              {t(messages, 'home.latestProjects', 'Latest Branding Projects')}:
            </span>
            <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3 sm:gap-16">
              {latestProjects.map((project, index) => (
                <div key={project.id} className="relative group">
                  {index > 0 && <span className="hidden sm:block absolute -left-8 top-1/2 -translate-y-1/2 text-muted-foreground/30">•</span>}
                  <Link
                    href={`/portfolio/${project.id}`}
                    className="text-xs sm:text-sm hover:text-primary transition-all px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5"
                    onMouseEnter={() => {
                      if (project.image02 && project.image03 && project.image04) {
                        setActiveProjectImage(project.id);
                      }
                    }}
                    onMouseLeave={() => setActiveProjectImage(null)}
                  >
                    {project.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



