import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from './theme-switcher';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function Navigation() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
        <div className="flex gap-5 items-center">
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
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/portfolio" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Portfolio
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
} 