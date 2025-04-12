'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  label: string;
}

export const Counter = ({ end, duration = 2000, label }: CounterProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1.0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center relative group"
    >
      <div className="text-8xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#2F5F65FF] to-[#52ddeb]/70">+{count}</div>
      <div className="text-muted-foreground font-medium group-hover:text-[#464646FF] transition-colors duration-300">{label}</div>
    </motion.div>
  );
}; 