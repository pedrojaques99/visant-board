/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS errors during build
  },
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
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      }
    });
    
    // Disable webpack caching in development to prevent ENOENT errors
    if (dev) {
      config.cache = false;
    }
    
    return config;
  },
  // Removed the i18n config as we're handling language switching with context 
  // instead of URL-based routing
};

module.exports = nextConfig; 