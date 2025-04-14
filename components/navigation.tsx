'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from './theme-switcher';
import { LanguageSwitcher } from './language-switcher';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

const NavLink = ({ href, translationKey, fallback }: { href: string; translationKey: string; fallback: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { messages } = useI18n();

  return (
    <Link href={href} className="relative">
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

export function Navigation() {
  const [session, setSession] = useState<Session | null>(null);
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
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
        <motion.div 
          className="flex gap-5 items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/brand/logo.png"
              alt="Visant Logo"
              width={120}
              height={32}
              priority
              className="invert dark:invert-0"
            />
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-6">
          <NavLink href="/about" translationKey="navigation.about" fallback="About" />
          <NavLink href="/portfolio" translationKey="navigation.portfolio" fallback="Portfolio" />
          <div className="flex items-center gap-3 ml-1">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
} 