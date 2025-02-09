const envConfig = require('./env.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['vsnfewogxjiukoarykfq.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: envConfig.supabase.url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: envConfig.supabase.anonKey,
    SUPABASE_SERVICE_ROLE_KEY: envConfig.supabase.serviceRole,
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