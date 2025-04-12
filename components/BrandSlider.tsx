'use client';

import { motion } from 'framer-motion';
import { brands } from '../app/about/constants';

export const BrandSlider = () => (
  <div className="relative">
    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10" />
    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10" />
    <motion.div
      animate={{ x: [0, -1000] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        },
      }}
      className="flex gap-6"
    >
      {[...brands, ...brands].map((brand, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-48 h-24 rounded-xl border border-[#52ddeb]/10 flex items-center justify-center text-muted-foreground hover:text-[#52ddeb] hover:border-[#52ddeb]/30 hover:shadow-[0_0_15px_rgba(82,221,235,0.1)] transition-all duration-300"
        >
          {brand}
        </div>
      ))}
    </motion.div>
  </div>
); 