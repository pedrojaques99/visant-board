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
        pathname: '/storage/v1/object/public/**',
      }
    ],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: true,
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
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
    // Updated property for Next.js 15
  },
  async headers() {
    return [
      {
        source: '/assets/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 