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
  
  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success && data.items) {
          // Get the 3 most recent projects
          const sortedProjects = data.items.sort((a: PortfolioItem, b: PortfolioItem) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }).slice(0, 3);
          setLatestProjects(sortedProjects);
        }
      } catch (error) {
        console.error('Error fetching latest projects:', error);
      }
    };

    fetchLatestProjects();
  }, []);
  
  return (
    <main className="relative flex-1 h-screen overflow-hidden">
      {/* Hero Section with 3D Logo */}
      <div className="absolute inset-0 w-full h-full -translate-y-[15vh]">
        <Hero />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen pointer-events-none -translate-y-[15vh]">
        <div className="max-w-2xl w-full space-y-5 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t(messages, 'home.title', 'Welcome to Visant®')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <a
              href="/portfolio"
              className="group relative inline-flex items-center justify-center rounded-md bg-primary/90 px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore o portfólio')}</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
            </a>
            <a
              href="/briefing"
              className="group relative inline-flex items-center justify-center rounded-md border border-primary/30 bg-background/50 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'home.startProject', 'Começar um projeto')}</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </a>
          </div>
        </div>

        {/* Interactive Hint */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center opacity-30">
          <p className="text-sm text-muted-foreground animate-pulse">
            {t(messages, 'home.interactionHint', 'Click and drag to interact with the 3D logo')}
          </p>
        </div>
      </div>

      {/* Fixed Footer with Latest Projects */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 pointer-events-auto z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center gap-20">
          <span className="text-xs text-muted-foreground font-medium">
            {t(messages, 'home.latestProjects', 'Latest Projects')}:
          </span>
          <div className="flex items-center gap-20">
            {latestProjects.map((project, index) => (
              <div key={project.id} className="relative group">
                {index > 0 && <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30">•</span>}
                <Link
                  href={`/portfolio/${project.id}`}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {project.title}
                </Link>
                {/* Thumbnail Preview */}
                {project.thumb && (
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <div className="relative w-[200px] h-[120px] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={project.thumb}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}



