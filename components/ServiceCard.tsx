'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useEffect, useState } from 'react';

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { messages } = useI18n();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading state if preferred
  }

  // Convert the title to a valid translation key format
  const titleKey = service.title.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, ''); // Remove any non-letter characters

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#52ddeb]/5 to-[#52ddeb]/10 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[#52ddeb] blur-xl" />
      <div className="p-8 rounded-2xl border border-[#52ddeb]/10 group-hover:border-[#52ddeb]/30 transition-colors duration-500">
        <div className="text-3xl mb-6 text-[#52ddeb]/80 group-hover:text-[#52ddeb] transition-colors duration-300">{service.icon}</div>
        <h3 className="text-2xl font-bold mb-4 group-hover:text-[#52ddeb] transition-colors duration-300">
          {t(messages, `services.${titleKey}.title`, service.title)}
        </h3>
        <p className="text-muted-foreground whitespace-pre-wrap break-words">
          {t(messages, `services.${titleKey}.description`, service.description)}
        </p>
      </div>
    </motion.div>
  );
}; 