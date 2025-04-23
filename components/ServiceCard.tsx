'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/i18n-context';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    icon: JSX.Element;
    href: string;
  };
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { messages } = useI18n();

  return (
    <Link href={service.href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative p-6 rounded-2xl border border-border/50 hover:border-[#52ddeb]/50 hover:bg-[#52ddeb]/5 transition-all duration-300"
      >
        <div className="relative space-y-4">
          <div className="w-10 h-10 rounded-full border border-border/50 group-hover:border-[#52ddeb]/50 flex items-center justify-center text-foreground/70 group-hover:text-[#52ddeb] transition-colors">
            {service.icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground/90 group-hover:text-[#52ddeb] transition-colors">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {service.description}
          </p>
          <div className="flex items-center gap-2 text-foreground/70 group-hover:text-[#52ddeb] transition-colors">
            <span className="text-sm font-medium">Learn more</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}; 