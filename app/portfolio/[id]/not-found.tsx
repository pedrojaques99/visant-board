import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
} 