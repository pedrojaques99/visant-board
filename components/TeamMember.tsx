'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { getVersionedImageUrl } from '@/utils/image-helper';

interface TeamMemberProps {
  member: {
    name: string;
    role: string;
    image: string;
  };
  index: number;
}

export const TeamMember = ({ member, index }: TeamMemberProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getVersionedImageUrl(member.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#52ddeb]/5 to-[#52ddeb]/10 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-[#52ddeb] blur-xl" />
      <div className="p-8 rounded-2xl border border-[#52ddeb]/10 group-hover:border-[#52ddeb]/30 transition-colors duration-500 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#52ddeb]/20 group-hover:border-[#52ddeb]/40 transition-colors duration-300">
          <Image
            src={imageUrl}
            alt={member.name}
            fill
            priority={member.name === 'You'}
            className="object-cover"
            sizes="128px"
            loading="eager"
            unoptimized={true}
            onError={() => setImageError(true)}
          />
        </div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#52ddeb] transition-colors duration-300">{member.name}</h3>
        <p className="text-muted-foreground">{member.role}</p>
      </div>
    </motion.div>
  );
}; 