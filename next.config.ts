import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for Prisma 7 + Next.js bundling (prevents Prisma engine issues in serverless/Amplify)
  serverExternalPackages: ['@prisma/client'],
  
  // Optimize for Amplify / production
  poweredByHeader: false,
  
  // Allow images from common CDNs if needed later
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Experimental features for modern Next 15 + Prisma stability
  experimental: {
    // Helps with large Prisma client bundles
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
