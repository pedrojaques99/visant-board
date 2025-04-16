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
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Footer } from '@/components/footer';

interface ProjectCardProps {
  project: PortfolioItem;
  index: number;
  activeIndex: number;
  totalProjects: number;
  setActiveIndex: (index: number) => void;
}

function ProjectCard({ project, index, activeIndex, totalProjects, setActiveIndex }: ProjectCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const isActive = index === activeIndex;

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '400px',
        x,
        rotate,
        scale,
        zIndex: totalProjects - Math.abs(index - activeIndex)
      }}
      initial={{ 
        opacity: 0,
        scale: 0.8,
        y: 50
      }}
      animate={{ 
        opacity: 1,
        scale: isActive ? 1 : 0.9,
        y: 0,
        x: (index - activeIndex) * 200,
        rotate: 0
      }}
      exit={{ 
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        type: "spring",
        bounce: 0.2,
        duration: 0.6
      }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        
        if (swipe < -100 && activeIndex < totalProjects - 1) {
          setActiveIndex(activeIndex + 1);
        } else if (swipe > 100 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
      }}
      className="relative touch-none cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.02 }}
    >
      <Link 
        href={`/portfolio/${project.id}`}
        onClick={(e) => {
          if (Math.abs(x.get()) > 10) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-2xl">
          {project.thumb && (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Image
                src={project.thumb}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
              />
            </motion.div>
          )}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 backdrop-blur-[2px]"
          >
            <motion.h3 
              className="text-xl font-medium text-white mb-2"
            >
              {project.title}
            </motion.h3>
            <motion.p 
              className="text-sm text-zinc-300"
            >
              {project.client}
            </motion.p>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { messages } = useI18n();
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  
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
  
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Hero Section with 3D Logo */}
        <section className="relative h-[70vh] flex items-center justify-center px-4">
          {/* 3D Hero Component */}
          <div className="absolute inset-0 w-full h-full">
            <Hero />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center space-y-4 z-10"
          >
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t(messages, 'home.title', 'Welcome to Visant®')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/portfolio"
                className="group relative inline-flex items-center justify-center rounded-lg bg-primary/90 px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary hover:scale-105 active:scale-100"
              >
                <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore o portfólio')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
              </Link>
              <Link
                href="/briefing"
                className="group relative inline-flex items-center justify-center rounded-lg border border-primary/30 bg-background/50 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:scale-105 active:scale-100"
              >
                <span className="relative z-10">{t(messages, 'home.startProject', 'Começar um projeto')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
              </Link>
            </div>
          </motion.div>

          {/* Mobile Interaction Hint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-0 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-xs text-muted-foreground animate-pulse">
              {t(messages, 'home.swipeHint', 'Scroll or swipe to explore')}
            </p>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background pointer-events-none z-[1]" />
        </section>

        {/* Mobile Latest Projects Stack */}
        <div className="relative z-10 bg-background">
          {latestProjects.length > 0 && (
            <section className="py-16 px-4">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold text-center mb-12"
              >
                {t(messages, 'home.latestProjects', 'Latest Branding Projects')}
              </motion.h2>
              <div className="relative h-[500px] overflow-visible touch-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {latestProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        activeIndex={activeIndex}
                        totalProjects={latestProjects.length}
                        setActiveIndex={setActiveIndex}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Scroll/Swipe hint */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-0 left-1/2 -translate-x-1/2 text-center"
                >
                  <p className="text-xs text-muted-foreground animate-pulse">
                    {t(messages, 'home.swipeHint', 'Scroll or swipe to explore')}
                  </p>
                </motion.div>
              </div>
            </section>
          )}

          {/* Mobile CTA Section */}
          <section className="relative py-32 sm:py-16 px-4 bg-gradient-to-b from-background to-primary/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-sm mx-auto text-center space-y-6 sm:space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {t(messages, 'about.cta', 'Looking for a bold visual identity?')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t(messages, 'about.ctaDescription', 'We are ready to create something amazing together.')}
              </p>
              <Link 
                href="/contact"
                className="block mt-2"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-90 px-6 py-3 rounded-lg text-sm sm:text-base font-semibold bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:bg-primary/95"
                >
                  {t(messages, 'about.getInTouch', 'Get in touch')}
                </motion.button>
              </Link>
            </motion.div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <main className="relative h-[100dvh] overflow-hidden">
      {/* Hero Section with 3D Logo */}
      <div className="absolute inset-0 -translate-y-[8vh]">
        <Hero />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background pointer-events-none z-[3]" />

      {/* Content Layer */}
      <div 
        className={cn(
          "relative z-[4] flex flex-col items-center min-h-[100dvh] justify-center -translate-y-[8vh] pointer-events-none"
        )}
      >
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
              <span className="relative z-10">{t(messages, 'portfolio.exploreOurWork', 'Explore our work')}</span>
              <div className="absolute inset-0 rounded-lg sm:rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-40" />
            </Link>
            <Link
              href="/briefing"
              className="group relative inline-flex items-center justify-center rounded-lg sm:rounded-md border border-primary/30 bg-background/50 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:scale-105 active:scale-100 pointer-events-auto"
            >
              <span className="relative z-10">{t(messages, 'home.startProject', 'Start a project')}</span>
              <div className="absolute inset-0 rounded-lg sm:rounded-md bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </Link>
          </motion.div>
        </div>

        {/* Interactive Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <p className="text-xs text-muted-foreground animate-pulse">
            {t(messages, 'home.interactionHint', 'Click and drag to interact with the 3D logo')}
          </p>
        </motion.div>
      </div>

      {/* Desktop Side Preview Modal */}
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

      {/* Desktop Fixed Footer with Latest Projects */}
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
    </main>
  );
}



