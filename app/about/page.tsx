'use client';

import { motion } from 'framer-motion';
import { Counter } from '../../components/Counter';
import { TexturePattern } from '../../components/TexturePattern';
import { ServiceCard } from '../../components/ServiceCard';
import { TeamMember } from '../../components/TeamMember';
import { BrandSlider } from '../../components/BrandSlider';
import { services, team, fadeInUp } from './constants';

export default function About() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Who we are */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-[#52ddeb]/5 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#52ddeb] to-[#52ddeb]/70">
              Who we are
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Visant® is a design studio founded by Pedro Xavier and Pedro Jaques.
              Based in Itajaí and Balneário Camboriú, we help brands grow through clarity, consistency, and beauty.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mt-4">
              We work closely with founders, creatives, and companies that believe in the power of design.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative min-h-[400px] rounded-2xl"
          >
            <TexturePattern />
          </motion.div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#52ddeb] to-[#52ddeb]/70"
          >
            What we do
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Counter end={50} label="Projects" />
            <Counter end={30} label="Clients" />
            <Counter end={25} label="Brands" />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <motion.h2 
          {...fadeInUp}
          className="text-4xl md:text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#52ddeb] to-[#52ddeb]/70"
        >
          Trusted by
        </motion.h2>
        <div className="max-w-7xl mx-auto">
          <BrandSlider />
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-8xl mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#52ddeb] to-[#52ddeb]/70"
          >
            Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMember key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-48 px-6 md:px-12 bg-gradient-to-b from-[#52ddeb]/40 to-black relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="max-w-8xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}     
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-white"
          >
            Looking for a bold visual identity?
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#52ddeb] text-black px-8 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            Get in touch
          </motion.button>
        </div>
      </section>
    </main>
  );
} 