'use client';

import Hero3D from '@/components/hero3d';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/utils/coda';
import Image from 'next/image';
import { X, ArrowRight, Search, ArrowUpRight, Info } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Footer } from '@/components/footer';
import About from '@/app/about/page';
import { buttonVariants } from '@/components/ui/button';

interface ProjectCardProps {
  project: PortfolioItem;
  index: number;
  activeIndex: number;
  totalProjects: number;
  setActiveIndex: (index: number) => void;
  onProjectClick: (project: PortfolioItem) => void;
}

function ProjectCard({ project, index, activeIndex, totalProjects, setActiveIndex, onProjectClick }: ProjectCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);
  const isActive = index === activeIndex;
  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');

  const getRelativePosition = () => {
    const distance = index - activeIndex;
    if (distance > totalProjects / 2) {
      return distance - totalProjects;
    } else if (distance < -totalProjects / 2) {
      return distance + totalProjects;
    }
    return distance;
  };

  const relativePosition = getRelativePosition();

  const handleDragEnd = (e: any, info: any) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    
    if (swipe < -100) {
      setActiveIndex((activeIndex + 1) % totalProjects);
    } else if (swipe > 100) {
      setActiveIndex((activeIndex - 1 + totalProjects) % totalProjects);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onProjectClick(project);
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '100%',
        maxWidth: isMobileOrTablet ? '280px' : '400px',
        x: x,
        rotate,
        scale,
        zIndex: totalProjects - Math.abs(relativePosition),
        filter: `blur(${isActive ? 0 : 2}px)`,
        transition: 'all 0.1s cubic-bezier(0.1, 0, 0.1, 0.7)',
        boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.9)' : 'none'
      }}
      initial={{ 
        opacity: 0,
        scale: 1,
        y: 20
      }}
      animate={{ 
        opacity: isActive ? 1 : 0.95,
        scale: isActive ? 1 : 0.95,
        y: 0,
        x: relativePosition * (isMobileOrTablet ? 150 : 200),
        rotate: 0
      }}
      exit={{ 
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.1 }
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1.2
      }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.05}
      onDragEnd={handleDragEnd}
      className="relative touch-none cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.01 }}
    >
      <Link href={`/portfolio/${project.id}`}>
        <div 
          className={cn(
            "relative rounded-xl overflow-hidden bg-muted shadow-2xl",
            isMobileOrTablet ? "aspect-[3/4]" : "aspect-[4/3]"
          )}
          onClick={handleClick}
        >
          {project.thumb && (
            <motion.div
              initial={{ scale: 1.05 }}
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
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6"
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
  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success && data.items) {
          const brandingProjects = data.items
            .filter((item: PortfolioItem) => item.type.toLowerCase().includes('branding'))
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

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveIndex((activeIndex + 1) % latestProjects.length);
    } else {
      setActiveIndex((activeIndex - 1 + latestProjects.length) % latestProjects.length);
    }
  };

  const handleNavigationClick = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.preventDefault();
    e.stopPropagation();
    handleNavigation(direction);
  };
  
  if (isMobileOrTablet) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile/Tablet Hero Section with 3D Logo */}
        <section className="relative h-[80vh] md:h-[80vh] flex items-center justify-center px-4 overflow-hidden">
          {/* 3D Hero Component */}
          <div className="absolute inset-0 w-full h-full scale-100 sm:scale-110 md:scale-125 md:-translate-y-20">
            <Hero3D />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center space-y-4 z-10 md:translate-y-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t(messages, 'home.title', 'Welcome to Visant®')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
            </p>
            <div className="flex flex-col md:flex-row gap-3 mt-4">
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
                <span className="relative z-10 flex items-center gap-2">
                  {t(messages, 'home.startProject', 'Começar um projeto')}
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
              </Link>
            </div>

            {/* Scroll Down Arrow */}
            <motion.button
              onClick={() => {
                const projectsSection = document.querySelector('.projects-section');
                if (projectsSection) {
                  const projectsSectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
                  const windowHeight = window.innerHeight;
                  const scrollTo = projectsSectionTop - (windowHeight / 2) + (projectsSection.clientHeight / 2);
                  window.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                  });
                }
              }}
              className="mt-32 flex items-center justify-center w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground/70"
                >
                  <path d="m7 6 5 5 5-5" />
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background pointer-events-none z-[1]" />
        </section>

        {/* Mobile/Tablet Latest Projects Stack */}
        <div className="relative z-10 bg-background -mt-20 projects-section">
          {latestProjects.length > 0 && (
            <section className="pt-24 pb-12 md:py-12 px-8">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold text-center"
              >
                {t(messages, 'home.latestProjects', 'Latest Projects')}
              </motion.h2>
              <div className="relative h-[600px] md:h-[600px] overflow-visible -mt-10">
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
                        onProjectClick={handleProjectClick}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Navigation Arrows - Mobile */}
                <div className="md:hidden absolute -bottom-5 left-0 right-0 flex items-center justify-center gap-8 p-4 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigationClick(e, 'prev');
                    }}
                    className="p-4 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors shadow-lg active:scale-95 transform"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground/80"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigationClick(e, 'next');
                    }}
                    className="p-4 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors shadow-lg active:scale-95 transform"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground/80"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Arrows - Desktop */}
                <div className="hidden md:flex absolute inset-y-0 left-0 items-center justify-start px-4 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigationClick(e, 'prev');
                    }}
                    className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-colors active:scale-95 transform"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground/70"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                </div>

                <div className="hidden md:flex absolute inset-y-0 right-0 items-center justify-end px-4 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigationClick(e, 'next');
                    }}
                    className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-colors active:scale-95 transform"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground/70"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Mobile/Tablet About Section */}
          <div className="block lg:hidden mt-32 md:mt-40">
            <About />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with 3D Logo */}
      <section className="relative h-[80vh] md:h-[80vh] flex items-center justify-center px-2 overflow-hidden">
        {/* 3D Hero Component */}
        <div className={cn(
          "absolute inset-0 w-full h-full scale-110",
          isMobileOrTablet ? "pointer-events-none" : ""
        )}>
          <Hero3D />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center space-y-6 z-10 md:translate-y-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t(messages, 'home.title', 'Welcome to Visant®')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            {t(messages, 'home.subtitle', 'Where visionary brands are born.')}
          </p>
          <div className="flex flex-col md:flex-row gap-3 mt-6">
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
              <span className="relative z-10 flex items-center gap-2">
                {t(messages, 'home.startProject', 'Começar um projeto')}
                <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </Link>
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background pointer-events-none z-[1]" />
      </section>

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
          {/* Desktop Hint */}
          <div className="hidden md:block absolute bottom-full right-1/2 -translate-x-2 mb-10">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const projects = document.querySelector('.container');
                if (projects) {
                  projects.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative focus:outline-none"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Info className="w-5 h-5 text-foreground/60 group-hover:text-foreground/80 transition-colors" />
              </motion.div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-background/50 backdrop-blur-sm border border-primary/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-sm text-foreground/80">
                  {t(messages, 'home.footerHint', 'Click on the projects below to see more details')}
                </span>
              </div>
            </motion.button>
          </div>

          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-16">
              <span className="text-xs text-muted-foreground font-medium">
                {t(messages, 'home.latestProjects', 'Latest Projects')}:
              </span>
              <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-3 sm:gap-16">
                {latestProjects.map((project, index) => (
                  <div key={project.id} className="relative group">
                    {index > 0 && <span className="hidden sm:block absolute -left-8 top-1/2 -translate-y-1/2 text-muted-foreground/30">|</span>}
                    <Link
                      href={`/portfolio/${project.id}`}
                      className={cn(
                        "text-xs sm:text-sm transition-all px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border hover:border-primary/50 hover:bg-primary/5 flex items-center gap-1.5",
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
                      <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
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



