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
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [20, 0]);

  // Sequential animation delay based on reverse index for falling effect
  const reverseIndex = totalItems - index - 1;
  const initialDelay = reverseIndex * 0.15;

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale, y: translateY }}
      initial={{ opacity: 0, y: 20 }}
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
      className="relative flex items-start gap-8 w-full max-w-3xl mx-auto py-6 group"
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
        className="flex-none w-14 pt-1 text-right"
      >
        <span className={cn(
          "text-sm font-medium tracking-wider transition-colors duration-300",
          isHighlighted ? "text-[#52ddeb]" : "text-muted-foreground/60"
        )}>
          DIA {day}
        </span>
      </motion.div>

      {/* Timeline Dot & Line */}
      <div className="relative flex flex-col items-center">
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
            "w-2.5 h-2.5 rounded-full transition-all duration-300 relative z-10",
            isHighlighted 
              ? "bg-[#52ddeb] ring-[3px] ring-[#52ddeb]/10" 
              : "bg-muted-foreground/30 group-hover:bg-[#52ddeb]/50"
          )}
        >
          {isHighlighted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full bg-[#52ddeb]/20"
            />
          )}
        </motion.div>
        
        {/* Line */}
        {!isLastDay && (
          <motion.div
            initial={{ height: 10, originY: 0 }}
            whileInView={{ height: "calc(100% + 1.5rem)" }}
            transition={{ 
              duration: 1.2,
              delay: initialDelay + 0.2,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
            className={cn(
              "absolute top-2.5 w-[2px] origin-top transition-colors duration-300",
              isHighlighted 
                ? "bg-gradient-to-b from-[#52ddeb]/30 via-[#52ddeb]/20 to-transparent" 
                : "bg-gradient-to-b from-muted-foreground/10 via-muted-foreground/5 to-transparent"
            )}
          />
        )}
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
        className="flex-1 pt-0.5"
      >
        <h3 className={cn(
          "text-base font-medium mb-2 transition-colors duration-300",
          isHighlighted ? "text-[#52ddeb]" : "text-foreground/80 group-hover:text-[#52ddeb]/90"
        )}>
          {messages.services.timeline[titleKey].title}
        </h3>
        {descriptionKey && (
          <p className={cn(
            "text-sm leading-relaxed transition-colors duration-300",
            isHighlighted ? "text-muted-foreground/90" : "text-muted-foreground/60"
          )}>
            {messages.services.timeline[titleKey].description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}; 