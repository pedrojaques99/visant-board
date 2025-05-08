'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from './theme-switcher';
import { LanguageSwitcher } from './language-switcher';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChevronDown } from 'lucide-react';

const NavLink = ({ href, translationKey, fallback, onClick }: { href: string; translationKey: string; fallback: string; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { messages } = useI18n();

  return (
    <Link href={href} className="relative" onClick={onClick}>
      <motion.span
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-primary' : 'hover:text-primary'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t(messages, translationKey, fallback)}
      </motion.span>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
          layoutId="underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30
          }}
        />
      )}
    </Link>
  );
};

const MobileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages } = useI18n();
  const pathname = usePathname();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Get current page name for the dropdown button
  const getCurrentPageName = () => {
    if (pathname === '/') return t(messages, 'navigation.home', 'Home');
    if (pathname === '/portfolio') return t(messages, 'navigation.portfolio', 'Portfolio');
    if (pathname === '/services') return t(messages, 'navigation.services', 'Services');
    if (pathname === '/about') return t(messages, 'navigation.about', 'About');
    return t(messages, 'navigation.menu', 'Menu');
  };

  return (
    <div className="relative md:hidden">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-sm font-medium hover:text-primary"
      >
        {getCurrentPageName()}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/5 -translate-x-1/2 mt-2 py-2 w-36 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg"
          >
            <Link
              href="/"
              className={`block px-4 py-2 text-sm hover:bg-accent/10 transition-colors ${pathname === '/' ? 'text-primary' : ''}`}
              onClick={closeDropdown}
            >
              {t(messages, 'navigation.home', 'Home')}
            </Link>
            <Link
              href="/portfolio"
              className={`block px-4 py-2 text-sm hover:bg-accent/10 transition-colors ${pathname === '/portfolio' ? 'text-primary' : ''}`}
              onClick={closeDropdown}
            >
              {t(messages, 'navigation.portfolio', 'Portfolio')}
            </Link>
            <Link
              href="/services"
              className={`block px-4 py-2 text-sm hover:bg-accent/10 transition-colors ${pathname === '/services' ? 'text-primary' : ''}`}
              onClick={closeDropdown}
            >
              {t(messages, 'navigation.services', 'Services')}
            </Link>
            <Link
              href="/about"
              className={`block px-4 py-2 text-sm hover:bg-accent/10 transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}
              onClick={closeDropdown}
            >
              {t(messages, 'navigation.about', 'About')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Navigation() {
  const [session, setSession] = useState<Session | null>(null);
  const isExtraSmall = useMediaQuery('(max-width: 400px)');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5">
        <motion.div 
          className="flex gap-5 items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="flex items-center gap-2">
            {isExtraSmall ? (
              <Image
                src="/assets/brand/icon visant.svg"
                alt="Visant Icon"
                width={32}
                height={32}
                priority
                className="invert dark:invert-0"
              />
            ) : (
              <Image
                src="/assets/brand/logo.png"
                alt="Visant Logo"
                width={120}
                height={32}
                priority
                className="invert dark:invert-0"
              />
            )}
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <NavLink href="/about" translationKey="navigation.about" fallback="About" />
          </div>
          <div className="hidden md:block">
            <NavLink href="/services" translationKey="navigation.services" fallback="Services" />
          </div>
          <div className="hidden md:block">
            <NavLink href="/portfolio" translationKey="navigation.portfolio" fallback="Portfolio" />
          </div>
          <MobileDropdown />
          <div className="flex items-center gap-4">
            <Link
              href="https://wa.me/+554788475891"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 active:scale-100 opacity-70 hover:opacity-100"
            >
              <Image
                src="/assets/icons/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="w-4 h-4"
                unoptimized
              />
            </Link>
            <Link
              href="https://instagram.com/visant.co"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 active:scale-100 opacity-70 hover:opacity-100"
            >
              <Image
                src="/assets/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="w-4 h-4"
                unoptimized
              />
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
} 