'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export default function BriefingPage() {
  useEffect(() => {
    // Initialize Tally.so widget
    if (window.Tally) {
      window.Tally.loadEmbeds();
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
      <iframe
        data-tally-src="https://tally.so/r/mJBWeJ?"
        className="w-full h-screen border-0"
        title="Briefing"
      />
    </div>
  );
} 