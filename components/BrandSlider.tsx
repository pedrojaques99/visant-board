'use client';

import { motion } from 'framer-motion';
import { brands } from '../app/about/constants';
import Image from 'next/image';

// Duplicar o array para criar um efeito infinito
const BRANDS_ROW = [...brands, ...brands];

export const BrandSlider = () => (
  <div className="relative overflow-hidden py-4">
    {/* Fade esquerdo - mais compacto no mobile */}
    <div className="absolute left-0 top-0 w-[10%] sm:w-[20%] h-full bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none" />
    
    {/* Fade direito - mais compacto no mobile */}
    <div className="absolute right-0 top-0 w-[10%] sm:w-[20%] h-full bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none" />
    
    {/* Primeira linha - movimento para a esquerda */}
    <motion.div
      animate={{ x: [0, -2000] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      }}
      className="flex gap-8 mb-8 px-8"
    >
      {BRANDS_ROW.map((brand, index) => (
        <div
          key={`row1-${index}`}
          className="flex-shrink-0 w-48 h-24 rounded-xl border border-[#52ddeb]/10 flex items-center justify-center p-4 hover:border-[#52ddeb]/30 hover:shadow-[0_0_15px_rgba(82,221,235,0.1)] transition-all duration-300"
        >
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={80}
            className="w-auto h-auto max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      ))}
    </motion.div>

    {/* Segunda linha - movimento para a direita */}
    <motion.div
      animate={{ x: [-2000, 0] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        },
      }}
      className="flex gap-8 px-8"
    >
      {BRANDS_ROW.map((brand, index) => (
        <div
          key={`row2-${index}`}
          className="flex-shrink-0 w-48 h-24 rounded-xl border border-[#52ddeb]/10 flex items-center justify-center p-4 hover:border-[#52ddeb]/30 hover:shadow-[0_0_15px_rgba(82,221,235,0.1)] transition-all duration-300"
        >
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={80}
            className="w-auto h-auto max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      ))}
    </motion.div>
  </div>
); 