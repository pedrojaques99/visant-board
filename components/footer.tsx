import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

export function Footer() {
  const { messages } = useI18n();
  
  return (
    <footer className="w-full bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image
              src="/assets/brand/icon visant.svg" 
              alt="Visant"
              width={20}
              height={20}
              className="h-6 w-auto"
            />
            <p className="text-sm text-muted-foreground mt-6 w-50">
              {t(messages, 'footer.description', 'Creating bold and visionary brand identities that make a lasting impact.')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">{t(messages, 'footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-2">
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
                  {t(messages, 'footer.contact', 'Contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-medium mb-4">{t(messages, 'footer.followUs', 'Follow Us')}</h3>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/visant.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Image
                  src="/assets/icons/instagram.svg"
                  alt="Instagram"
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
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-medium mb-4">{t(messages, 'footer.contact', 'Contact')}</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: <a href="mailto:contact@visant.design" className="hover:text-foreground transition-colors">contato@visant.design</a>
              </li>
              <li className="text-sm text-muted-foreground">
                WhatsApp: <a href="https://wa.me/554788475891" className="hover:text-foreground transition-colors">+55 (47) 88475-891</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Visant. {t(messages, 'footer.rights', 'All rights reserved.')}
            </p>
            <div className="flex gap-4">
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