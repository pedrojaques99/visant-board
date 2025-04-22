'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { TimelineItem } from '@/components/TimelineItem';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useRef } from 'react';
import { Clock, Sparkles, Target, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

type FeatureKey = 'optimizedTime' | 'focusedGoal' | 'uniqueResult';

interface Feature {
  icon: JSX.Element;
  titleKey: FeatureKey;
}

const timelineItems = [
  {
    day: "01",
    titleKey: "closing",
    descriptionKey: "closing",
    isHighlighted: true
  },
  {
    day: "02",
    titleKey: "alignment",
    descriptionKey: "alignment",
    isHighlighted: false
  },
  {
    day: "04",
    titleKey: "strategy",
    descriptionKey: "strategy",
    isHighlighted: true
  },
  {
    day: "10",
    titleKey: "refinement",
    descriptionKey: "refinement",
    isHighlighted: false
  },
  {
    day: "15",
    titleKey: "delivery",
    descriptionKey: "delivery",
    isHighlighted: true
  }
];

const features: Feature[] = [
  {
    icon: <Clock className="w-5 h-5" />,
    titleKey: "optimizedTime",
  },
  {
    icon: <Target className="w-5 h-5" />,
    titleKey: "focusedGoal",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    titleKey: "uniqueResult",
  }
];

export default function ServicesPage() {
  const { messages } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <main className="min-h-screen bg-background relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#52ddeb]/10 via-background to-background" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#52ddeb]/10 text-[#52ddeb] border border-[#52ddeb]/20">
                {messages.services.badge}
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {messages.services.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {messages.services.subtitle}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  className="group relative p-6 rounded-2xl bg-[#52ddeb]/5 border border-[#52ddeb]/10 hover:bg-[#52ddeb]/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#52ddeb]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-4">
                    <div className="w-10 h-10 rounded-full bg-[#52ddeb]/10 flex items-center justify-center text-[#52ddeb]">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {messages.services.features[feature.titleKey]}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {messages.services.features[`${feature.titleKey}Description` as const]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12"
            >
              <Link
                href="/briefing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#52ddeb] text-background font-medium hover:bg-[#52ddeb]/90 transition-colors group"
              >
                {messages.services.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={containerRef} className="py-32 md:py-40">
        <motion.div 
          style={{ opacity, scale }}
          className="container px-4 md:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-16">
              <Calendar className="w-8 h-8 text-[#52ddeb]" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {messages.services.timelineTitle}
              </h2>
            </div>

            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <TimelineItem
                  key={item.titleKey}
                  day={item.day}
                  titleKey={item.titleKey}
                  descriptionKey={item.descriptionKey}
                  isHighlighted={item.isHighlighted}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Methodology Section */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#52ddeb]/5 via-background to-background" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-16"
          >
            <div className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
              >
                {messages.services.methodologyTitle}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground"
              >
                {messages.services.methodologyDescription}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground"
              >
                {messages.services.methodologyExtra}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#52ddeb]/20 to-transparent blur-3xl group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-[#52ddeb]/5 border border-[#52ddeb]/10 rounded-2xl p-8 md:p-10">
                <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {messages.services.differenceTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {messages.services.differenceDescription}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 