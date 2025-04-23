/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
      // Add additional optimization disabling for development
      config.optimization = {
        ...config.optimization,
        minimize: false
      };
    }
    
    return config;
  },
  // Next.js 15 doesn't use devIndicators anymore
  
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  
  experimental: {
    optimizeCss: true,
    serverActions: true,
  },
};

module.exports = nextConfig; 