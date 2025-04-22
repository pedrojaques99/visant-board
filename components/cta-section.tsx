'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CTASectionProps {
  variant?: 'default' | 'gradient' | 'dynamic';
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  className?: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  isWhatsApp?: boolean;
}

export function CTASection({
  variant = 'default',
  gradientFrom = 'var(--accent)',
  gradientTo = 'var(--background)',
  textColor,
  buttonColor = 'var(--primary)',
  buttonTextColor = 'var(--primary-foreground)',
  className,
  title,
  buttonText,
  buttonLink = '/contact',
  isWhatsApp = false,
}: CTASectionProps) {
  const { messages, locale } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Default texts
  const defaultTitle = t(messages, 'about.cta', 'Looking for a bold visual identity?');
  const defaultButtonText = t(messages, 'about.getInTouch', 'Get in touch');

  // WhatsApp link with default message
  const whatsAppLink = "https://wa.me/5547988475891?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20seus%20serviços%20de%20design.";

  // Style configurations based on variant
  const sectionStyles = {
    default: {
      background: 'bg-gradient-to-b from-accent/20 to-background',
      text: 'text-foreground'
    },
    gradient: {
      background: `bg-gradient-to-b from-[${gradientFrom}] to-[${gradientTo}]`,
      text: textColor ? `text-[${textColor}]` : 'text-foreground'
    },
    dynamic: {
      background: `bg-gradient-to-b from-[${gradientFrom}] to-[${gradientTo}]`,
      text: textColor ? `text-[${textColor}]` : 'text-foreground'
    }
  };

  const currentStyle = sectionStyles[variant];

  return (
    <section 
      className={cn(
        "py-24 sm:py-48 px-4 sm:px-6 md:px-12 relative overflow-hidden rounded-2xl",
        currentStyle.background,
        className
      )}
      style={variant === 'dynamic' ? {
        background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
      } : undefined}
    >
      <div className="absolute inset-0 pointer-events-none" />
      <div className="max-w-8xl mx-auto text-center relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}     
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12",
            currentStyle.text
          )}
          style={variant === 'dynamic' ? { color: textColor } : undefined}
        >
          {title || defaultTitle}
        </motion.h2>
        <Link 
          href={isWhatsApp ? whatsAppLink : buttonLink}
          target={isWhatsApp ? "_blank" : undefined}
          rel={isWhatsApp ? "noopener noreferrer" : undefined}
        >
          <motion.button
            whileHover={{ 
              scale: isMobile ? 1 : 1.05,
              boxShadow: '0 0 30px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold",
              "transition-all duration-300",
              "w-full sm:w-auto",
              variant === 'default' ? 'bg-primary text-primary-foreground' : ''
            )}
            style={variant !== 'default' ? { 
              backgroundColor: buttonColor,
              color: buttonTextColor,
            } : undefined}
          >
            {buttonText || defaultButtonText}
          </motion.button>
        </Link>
      </div>
    </section>
  );
} 