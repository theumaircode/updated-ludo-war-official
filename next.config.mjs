/** @type {import('next').NextConfig} */
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true'

const nextConfig = {
  ...(isCapacitorBuild ? { output: 'export', distDir: 'out' } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(!isCapacitorBuild
    ? {
        async headers() {
          return [
            {
              source: '/.well-known/assetlinks.json',
              headers: [
                {
                  key: 'Content-Type',
                  value: 'application/json; charset=utf-8',
                },
                {
                  key: 'Cache-Control',
                  value: 'no-store, no-cache, must-revalidate, max-age=0',
                },
                {
                  key: 'Access-Control-Allow-Origin',
                  value: '*',
                },
              ],
            },
            {
              source: '/manifest.json',
              headers: [
                {
                  key: 'Content-Type',
                  value: 'application/manifest+json; charset=utf-8',
                },
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=0, must-revalidate',
                },
              ],
            },
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'Referrer-Policy',
                  value: 'strict-origin-when-cross-origin',
                },
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000',
                },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=()',
                },
              ],
            },
          ]
        },
      }
    : {}),
}

export default nextConfig
