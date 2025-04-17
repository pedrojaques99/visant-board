'use client';

import { motion } from 'framer-motion';
import { Counter } from '../../components/Counter';
import { TexturePattern } from '../../components/TexturePattern';
import { ServiceCard } from '../../components/ServiceCard';
import { TeamMember } from '../../components/TeamMember';
import { BrandSlider } from '../../components/BrandSlider';
import { services, team, fadeInUp } from './constants';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { getStatistics } from '@/utils/coda';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CTASection } from '@/components/cta-section';

export default function About() {
  const { messages } = useI18n();
  const [statistics, setStatistics] = useState({
    totalProjects: 0,
    totalClients: 0,
    totalBrands: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics');
        const data = await response.json();
        
        if (data.success && data.statistics) {
          setStatistics({
            totalProjects: data.statistics.totalProjects,
            totalClients: data.statistics.totalClients,
            totalBrands: data.statistics.totalBrands
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);
  
  return (
    <div className="w-full -mt-20">
      {/* Who we are */}
      <section className="min-h-[80vh] sm:min-h-screen relative flex items-center justify-center w-full">
        <div className="absolute inset-0">
          <TexturePattern className="w-full h-full opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        </div>
        <div className="max-w-[1800px] w-[90%] mx-auto grid grid-cols-1 gap-8 relative z-10 p-4 sm:p-5 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center items-center text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t(messages, 'about.title', 'Who we are')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {t(messages, 'about.description', 'Visant® is a design studio founded by Pedro Xavier and Pedro Jaques. Based in Itajaí and Balneário Camboriú, we help brands grow through clarity, consistency, and beauty.')}
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-4 max-w-3xl">
              {t(messages, 'about.descriptionMore', 'We work closely with founders, creatives, and companies that believe in the power of design.')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative min-h-[50px] rounded-2xl hidden md:block"
          />
        </div>
      </section>

      {/* What we do */}
      <section className="w-full py-16 sm:py-32">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-5 md:px-12">
          <motion.h2 
            {...fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          >
            {t(messages, 'about.whatWeDo', 'What we do')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="w-full py-16 sm:py-32">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-5 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <Counter end={statistics.totalProjects} label={t(messages, 'about.projects', 'Projects')} />
            <Counter end={statistics.totalClients} label={t(messages, 'about.clients', 'Clients')} />
            <Counter end={statistics.totalBrands} label={t(messages, 'about.brands', 'Brands')} />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <motion.h2 
          {...fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 sm:from-primary sm:via-primary/85 sm:to-primary/70"
        >
          {t(messages, 'about.trustedBy', 'Trusted by')}
        </motion.h2>
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 w-[10%] sm:w-[30%] bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-[10%] sm:w-[30%] bg-gradient-to-l from-background to-transparent z-10" />
          <BrandSlider />
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 md:px-12">
        <div className="max-w-8xl mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          >
            {t(messages, 'about.team', 'Team')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <TeamMember key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CTASection 
        variant="default"
        isWhatsApp={true}
        className="w-[95%] mx-auto px-12"
      />
    </div>
  );
} 