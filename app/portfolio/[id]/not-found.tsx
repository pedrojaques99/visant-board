import Link from 'next/link';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

export default function NotFound() {
  const { messages } = useI18n();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t(messages, 'portfolio.notFound', 'Project Not Found')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t(messages, 'portfolio.notFoundDescription', 'The project you\'re looking for doesn\'t exist or has been removed.')}
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          {t(messages, 'portfolio.returnToPortfolio', 'Return to Portfolio')}
        </Link>
      </div>
    </div>
  );
} 