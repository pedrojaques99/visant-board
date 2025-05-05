'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useI18n } from '@/context/i18n-context';

type TimelineKey = 'closing' | 'alignment' | 'strategy' | 'refinement' | 'delivery';

interface TimelineItemProps {
  day: string;
  titleKey: TimelineKey;
  descriptionKey: TimelineKey;
  index: number;
  totalItems: number;
}

export const TimelineItem = ({ day, titleKey, descriptionKey, index, totalItems }: TimelineItemProps) => {
  const { messages } = useI18n();
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"]
  });

  const isHighlighted = day === "1" || day === "15";
  const isLastDay = day === "15";
  const isFirstDay = day === "1";

  // Enhanced animations
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0.1, 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.1], [0, 0]);
  const translateX = useTransform(scrollYProgress, [0, 0.1], [0, 0]);
  
  // Enhanced line progress effect for the main timeline
  const progressHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const progressOpacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 5]);
  
  // Sequential animation delay based on index
  const initialDelay = index * 0.15;

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale, y: translateY }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          delay: initialDelay,
          ease: "easeOut"
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8 w-full max-w-3xl mx-auto py-4 sm:py-5 md:py-6 group min-h-[120px] sm:min-h-[100px]"
    >
      {/* Left Side - Day Number */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.3,
            delay: initialDelay + 0.2,
            ease: "easeOut"
          }
        }}
        viewport={{ once: true }}
        className="flex-none w-full sm:w-16 md:w-24 pt-1 text-left sm:text-right relative mb-2 sm:mb-0"
      >
        {/* Background Shape */}
        <div className={cn(
          "absolute left-0 sm:left-auto sm:right-0 top-1/2 -translate-y-1/2 w-12 sm:w-14 md:w-16 aspect-[2/1] rounded-lg",
          isHighlighted 
            ? "bg-[#52ddeb]/10 border border-[#52ddeb]/20" 
            : "bg-muted-foreground/5 border border-muted-foreground/10"
        )} />
        {/* Day Number */}
        <span className={cn(
          "relative inline-block text-xs sm:text-sm font-medium tracking-wider transition-colors duration-300 px-3 py-1 rounded-md",
          isHighlighted 
            ? "text-[#52ddeb] bg-[#52ddeb]/5 border border-[#52ddeb]/20" 
            : "text-muted-foreground/60 bg-muted-foreground/5 border border-muted-foreground/10"
        )}>
          DIA {day}
        </span>
      </motion.div>

      {/* Timeline Line & Dot */}
      <div className="relative flex flex-col items-center hidden sm:flex">
        {/* Main Timeline Line */}
        <div className={cn(
          "absolute h-[10vh] w-[2px] bg-gradient-to-b from-transparent via-muted-foreground/5 to-transparent",
        )}>
          {/* Active Progress Line */}
          <motion.div
            style={{ 
              height: progressHeight,
              opacity: progressOpacity
            }}
            className={cn(
              "absolute top-0 w-full",
              "bg-gradient-to-b from-[#52ddeb] via-[#52ddeb]/20 to-[#52ddeb]/10"
            )}
          />
        </div>

        {/* Dot */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ 
            scale: 1,
            transition: {
              duration: 0.3,
              delay: initialDelay + 0.1,
              ease: "easeOut"
            }
          }}
          viewport={{ once: true }}
          className={cn(
            "relative w-3 h-3 rounded-full transition-all duration-300 z-10",
            isHighlighted 
              ? "bg-[#52ddeb] ring-[4px] ring-[#52ddeb]/20" 
              : "bg-[#52ddeb]/50 ring-2 ring-[#52ddeb]/10"
          )}
        >
          {/* Inner Glow */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            isHighlighted
              ? "bg-[#52ddeb] animate-pulse-subtle"
              : "bg-[#52ddeb]/30"
          )} />
          
          {/* Outer Glow */}
          {isHighlighted && (
            <div className="absolute -inset-2 rounded-full bg-[#52ddeb]/10 animate-pulse" />
          )}

          {/* Progress Indicator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 0.2, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className={cn(
              "absolute inset-0 rounded-full",
              isHighlighted
                ? "bg-[#52ddeb]/30"
                : "bg-[#52ddeb]/10"
            )}
          />
        </motion.div>
      </div>

      {/* Right Side - Content */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.3,
            delay: initialDelay + 0.3,
            ease: "easeOut"
          }
        }}
        viewport={{ once: true }}
        className="flex-1 pt-0.5 min-h-[60px]"
      >
        <h3 className={cn(
          "text-sm sm:text-base font-medium mb-2 transition-colors duration-300",
          isHighlighted ? "text-[#52ddeb]" : "text-foreground/80 group-hover:text-[#52ddeb]/90"
        )}>
          {messages.services.timeline[titleKey].title}
        </h3>
        {descriptionKey && (
          <p className={cn(
            "text-xs sm:text-sm leading-relaxed transition-colors duration-300",
            isHighlighted ? "text-muted-foreground/90" : "text-muted-foreground/60"
          )}>
            {messages.services.timeline[titleKey].description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}; 