import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

export function Footer() {
  const { messages } = useI18n();
  
  return (
    <footer className="w-[85%] mx-auto bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Image
              src="/assets/brand/icon visant.svg" 
              alt={t(messages, 'footer.visantIcon', 'Visant')}
              width={20}
              height={20}
              className="h-6 w-auto"
            />
            <p className="text-sm text-muted-foreground max-w-[280px]">
              {t(messages, 'footer.description', 'Creating bold and visionary brand identities that make a lasting impact.')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <ul className="space-y-3">
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t(messages, 'footer.portfolio', 'Portfolio')}
                </Link>
              </li>
              <li>
                <Link href="/briefing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t(messages, 'footer.startProject', 'Start a Project')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t(messages, 'footer.about', 'About')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground/80">{t(messages, 'footer.followUs', 'Follow Us')}</h3>
            <div className="flex gap-6">
              <Link
                href="https://instagram.com/visant.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Image
                  src="/assets/icons/instagram.svg"
                  alt={t(messages, 'footer.instagram', 'Instagram')}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Link>
              <Link
                href="https://wa.me/+554788475891"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Image
                  src="/assets/icons/whatsapp.svg"
                  alt={t(messages, 'footer.whatsapp', 'WhatsApp')}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground/80">{t(messages, 'footer.contact', 'Contact')}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">
                <a href="mailto:contact@visant.design" className="hover:text-foreground transition-colors">
                  {t(messages, 'footer.email', 'contact@visant.design')}
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                <a href="https://wa.me/554788475891" className="hover:text-foreground transition-colors">
                  {t(messages, 'footer.phone', '+55 (47) 88475-891')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Visant. {t(messages, 'footer.rights', 'All rights reserved.')}
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t(messages, 'footer.privacy', 'Privacy Policy')}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t(messages, 'footer.terms', 'Terms of Service')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 