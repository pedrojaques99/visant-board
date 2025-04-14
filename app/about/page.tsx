'use client';

import { motion } from 'framer-motion';
import { Counter } from '../../components/Counter';
import { TexturePattern } from '../../components/TexturePattern';
import { ServiceCard } from '../../components/ServiceCard';
import { TeamMember } from '../../components/TeamMember';
import { BrandSlider } from '../../components/BrandSlider';
import { services, team, fadeInUp } from './constants';
import { cn } from '@/lib/utils';

export default function About() {
  return (
    <div className="w-full -mt-20">
      {/* Who we are */}
      <section className="min-h-[80vh] sm:min-h-screen relative flex items-center justify-center w-full">
        <div className="absolute inset-0">
          <TexturePattern className="w-full h-full opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        </div>
        <div className="max-w-[1800px] w-full mx-auto grid grid-cols-1 gap-8 sm:gap-16 relative z-10 p-4 sm:p-5 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center items-center text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Who we are
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Visant® is a design studio founded by Pedro Xavier and Pedro Jaques.
              Based in Itajaí and Balneário Camboriú, we help brands grow through clarity, consistency, and beauty.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-4 max-w-3xl">
              We work closely with founders, creatives, and companies that believe in the power of design.
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
            What we do
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
            <Counter end={50} label="Projects" />
            <Counter end={30} label="Clients" />
            <Counter end={25} label="Brands" />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <motion.h2 
          {...fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
        >
          Trusted by
        </motion.h2>
        <div className="max-w-7xl mx-auto">
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
            Team
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <TeamMember key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 sm:py-48 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-primary/40 to-background relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="max-w-8xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}     
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-foreground"
          >
            Looking for a bold visual identity?
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold",
              "hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300"
            )}
          >
            Get in touch
          </motion.button>
        </div>
      </section>
    </div>
  );
} 