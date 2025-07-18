import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable Next.js 15 experimental features for revolutionary performance
  experimental: {
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB']
  },
  
  // Advanced image optimization for hair portfolio
  images: {
    formats: ['image/avif', 'image/webp'], // Next-gen formats for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive optimization
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon and thumbnail sizes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack configuration for AI libraries
  webpack: (config) => {
    // TensorFlow.js optimization
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    
    // WebAssembly support for ML models
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    return config;
  },
  
  // Headers for WebAR and AI features
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Camera access for virtual try-on
          {
            key: 'Permissions-Policy',
            value: 'camera=*'
          }
        ],
      },
    ];
  },
  
  // TypeScript configuration for strict mode
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  
  // Enhanced security
  poweredByHeader: false,
  
  // Core Web Vitals optimization
  compress: true,
};

export default withNextIntl(nextConfig);
