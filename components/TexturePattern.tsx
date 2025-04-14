'use client';

import { cn } from '../lib/utils';

interface TexturePatternProps {
  className?: string;
}

export const TexturePattern = ({ className }: TexturePatternProps) => (
  <div className={cn("relative w-full h-full overflow-hidden rounded-2xl group", className)}>
    <div className="absolute inset-0 bg-gradient-to-br from-[#52ddeb]/5 to-[#52ddeb]/10 group-hover:from-[#52ddeb]/10 group-hover:to-[#52ddeb]/20 transition-all duration-700" />
    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-[#52ddeb]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${Math.random() * 50 + 20}px`,
            height: '1px',
            boxShadow: '0 0 8px #52ddeb'
          }}
        />
      ))}
    </div>
  </div>
); 