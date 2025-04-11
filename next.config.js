/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.coda.io',
      },
      {
        protocol: 'https',
        hostname: 'codahosted.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myportfolio.com',
      },
      {
        protocol: 'https',
        hostname: 'cndvlwjphohgfgydvgum.supabase.co',
      }
    ]
  },
};

module.exports = nextConfig; 