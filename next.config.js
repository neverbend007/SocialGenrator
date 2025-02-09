/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'vsnfewogxjiukoarykfq.supabase.co',
      'lh3.googleusercontent.com', // For Google profile images
      'railway.app', // For Railway hosted images
      'localhost' // For local development
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Disable image optimization in production
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Environment variables are now handled by Railway
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  // Add experimental flag to handle manifest
  experimental: {
    forceSwcTransforms: true,
  },
  // Disable react-loadable integration
  webpack: (config, { isServer }) => {
    // Remove react-loadable manifest generation
    if (isServer) {
      config.optimization.splitChunks = false;
    }
    return config;
  }
}

module.exports = nextConfig