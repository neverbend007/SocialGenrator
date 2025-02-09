/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vsnfewogxjiukoarykfq.supabase.co'],
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