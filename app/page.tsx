'use client';

import Hero from '@/components/hero';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/utils/coda';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const { messages } = useI18n();
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success && data.items) {
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

  const handleProjectClick = (project: PortfolioItem) => {
    if (project.id === activeProject?.id) {
      setActiveProject(null);
      setIsPreviewOpen(false);
    } else {
      setActiveProject(project);
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setActiveProject(null), 300);
  };
  
  return (
    <main className="relative flex-1 h-screen overflow-hidden">
      {/* Hero Section with 3D Logo - Hidden on Mobile */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full -translate-y-[10vh] sm:-translate-y-[15vh] z-[2]">
          <Hero />
        </div>
      )}

      {/* Content Layer */}
      <div className={cn(
        "relative z-[4] flex flex-col items-center",
        isMobile 
          ? "min-h-screen justify-start pt-16 sm:pt-32 px-4" 
          : "h-screen justify-center -translate-y-[10vh] sm:-translate-y-[15vh]",
        "pointer-events-none"
      )}>
        <div className="w-full max-w-[90%] sm:max-w-2xl space-y-4 sm:space-y-5 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
          >
            {t(messages, 'home.title', 'Welcome to Visant®')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground"
          >
            {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2"
          >
            <Link
              href="/portfolio"
              className="group relative inline-flex items-center justify-center rounded-lg sm:rounded-md bg-primary/90 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore o portfólio')}</span>
              <div className="absolute inset-0 rounded-lg sm:rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
            </Link>
            <Link
              href="/briefing"
              className="group relative inline-flex items-center justify-center rounded-lg sm:rounded-md border border-primary/30 bg-background/50 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'home.startProject', 'Começar um projeto')}</span>
              <div className="absolute inset-0 rounded-lg sm:rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </Link>
          </motion.div>

          {/* Social Media Icons - Mobile Only */}
          {isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="fixed bottom-32 left-0 right-0 flex items-center justify-center gap-8 pointer-events-auto"
            >
              <Link
                href="https://wa.me/your_number_here"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 active:scale-100 opacity-70 hover:opacity-100"
              >
                <Image
                  src="/assets/icons/whatsapp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
              <Link
                href="https://instagram.com/your_handle_here"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 active:scale-100 opacity-70 hover:opacity-100"
              >
                <Image
                  src="/assets/icons/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Interactive Hint - Hidden on Mobile */}
        {!isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
              {t(messages, 'home.interactionHint', 'Click and drag to interact with the 3D logo')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile Latest Projects as Cards */}
      {isMobile && latestProjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 p-4 pointer-events-auto z-[2]"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
            {t(messages, 'home.latestProjects', 'Latest Branding Projects')}
          </h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x snap-mandatory">
            {latestProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.id}`}
                className="flex-none w-[280px] snap-start transform transition-transform active:scale-95"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-lg">
                  {project.thumb && (
                    <Image
                      src={project.thumb}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="280px"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-sm font-medium text-white line-clamp-2 mb-1">
                      {project.title}
                    </span>
                    <span className="text-xs text-zinc-300">
                      {t(messages, 'common.showDetails', 'Show details')} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Desktop Side Preview Modal */}
      {!isMobile && (
        <div 
          className={cn(
            "fixed right-4 top-16 bottom-20 w-[280px] transition-all duration-300 ease-in-out z-[2]",
            activeProject 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-8 pointer-events-none"
          )}
        >
          <div className="relative h-90 bg-background/95 backdrop-blur-md rounded-xl border border-border/50 overflow-hidden shadow-2xl">
            <div className="h-full p-2 space-y-2 overflow-y-auto scrollbar-none">
              {activeProject?.image02 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-[5/3]"
                >
                  <Image
                    src={activeProject.image02}
                    alt={`${activeProject.title} - Detail 1`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </motion.div>
              )}
              {activeProject?.image03 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-[5/3]"
                >
                  <Image
                    src={activeProject.image03}
                    alt={`${activeProject.title} - Detail 2`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </motion.div>
              )}
              {activeProject?.image04 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-[5/3]"
                >
                  <Image
                    src={activeProject.image04}
                    alt={`${activeProject.title} - Detail 3`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </motion.div>
              )}
              {activeProject?.image05 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-[5/3]"
                >
                  <Image
                    src={activeProject.image05}
                    alt={`${activeProject.title} - Detail 4`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Footer with Latest Projects */}
      {!isMobile && (
        <div className="fixed bottom-0 left-0 right-0 pointer-events-auto z-[2]">
          <div className="bg-background/80 backdrop-blur-sm border-t border-border/50">
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
                        className={cn(
                          "text-xs sm:text-sm transition-all px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border hover:border-primary/50 hover:bg-primary/5",
                          activeProject?.id === project.id 
                            ? "border-primary text-primary bg-primary/5" 
                            : "border-border/50 text-foreground hover:text-primary"
                        )}
                        onMouseEnter={() => {
                          if (project.image02 && project.image03 && project.image04) {
                            setActiveProject(project);
                          }
                        }}
                        onMouseLeave={() => setActiveProject(null)}
                      >
                        {project.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



