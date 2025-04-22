'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { useRef } from 'react';
import { useI18n } from '@/context/i18n-context';

type TimelineKey = 'closing' | 'alignment' | 'strategy' | 'refinement' | 'delivery';

interface TimelineItemProps {
  day: string;
  titleKey: TimelineKey;
  descriptionKey?: string;
  isHighlighted?: boolean;
  index: number;
}

export const TimelineItem = ({ day, titleKey, descriptionKey, isHighlighted, index }: TimelineItemProps) => {
  const { messages } = useI18n();
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"]
  });

  const lineVariants = {
    initial: { 
      height: 0,
      opacity: 0,
    },
    animate: {
      height: "calc(100% + 40px)",
      opacity: 1,
      transition: {
        height: { 
          duration: 0.8,
          ease: "circOut"
        },
        opacity: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }
    }
  };

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.45, 0.32, 0.9]
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-3xl mx-auto px-4 md:px-0"
    >
      {/* Left Content */}
      <div className="flex items-center gap-2 md:w-[140px] text-right mb-4 md:mb-0">
        <Calendar className={cn(
          "w-5 h-5",
          isHighlighted ? "text-[#52ddeb]" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isHighlighted ? "text-[#52ddeb]" : "text-muted-foreground"
        )}>
          {day}
        </span>
      </div>

      {/* Line Container */}
      <div className="relative w-[2px] h-[calc(100%+40px)] mx-6">
        {/* Background Line (Always Visible) */}
        <div className={cn(
          "absolute inset-0",
          isHighlighted 
            ? "bg-gradient-to-b from-[#52ddeb]/20 to-transparent"
            : "bg-gradient-to-b from-[#52ddeb]/10 to-transparent"
        )} />
        
        {/* Animated Line */}
        <motion.div
          variants={lineVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className={cn(
            "absolute inset-0",
            isHighlighted 
              ? "bg-gradient-to-b from-[#52ddeb] to-transparent"
              : "bg-gradient-to-b from-[#52ddeb]/30 to-transparent"
          )}
        />

        {/* Animated Effects */}
        <div className={cn(
          "absolute inset-0",
          "after:absolute after:inset-0 after:animate-pulse after:bg-gradient-to-b after:from-[#52ddeb]/10 after:to-transparent",
          isHighlighted && "before:absolute before:inset-0 before:animate-glow before:bg-gradient-to-b before:from-[#52ddeb]/20 before:to-transparent"
        )} />
      </div>

      {/* Right Content */}
      <div className="flex-1 md:max-w-[calc(100%-180px)]">
        <h3 className={cn(
          "text-base md:text-lg font-medium mb-2 transition-colors duration-300",
          isHighlighted ? "text-[#52ddeb]" : "text-foreground group-hover:text-[#52ddeb]/80"
        )}>
          {messages.services.timeline[titleKey].title}
        </h3>
        {descriptionKey && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {messages.services.timeline[titleKey].description}
          </p>
        )}
      </div>
    </motion.div>
  );
}; 