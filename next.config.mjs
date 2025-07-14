/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment atau hapus baris ini jika tidak perlu static export
  // output: 'export',
  
  // Keep image optimization
  images: {
    unoptimized: true // Tetap true untuk compatibility
  },
  
  // Add trailing slash for better compatibility
  trailingSlash: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // ESLint configuration - ignore errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration - ignore errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Experimental features
  experimental: {
    esmExternals: 'loose',
  },
}

export default nextConfig
