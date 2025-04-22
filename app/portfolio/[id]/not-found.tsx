'use client';

import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import Link from 'next/link';

export default function NotFound() {
  const { messages } = useI18n();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">
          {t(messages, 'common.notFound', 'Página não encontrada')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t(messages, 'common.notFoundDescription', 'Desculpe, não conseguimos encontrar a página que você está procurando.')}
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {t(messages, 'common.backToHome', 'Voltar para a página inicial')}
        </Link>
      </div>
    </div>
  );
} 