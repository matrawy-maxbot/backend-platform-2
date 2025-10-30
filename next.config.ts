import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://poki.com https://*.poki.com https://friv.com https://*.friv.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net; worker-src 'self' blob:; object-src 'none'; connect-src 'self' http://localhost:* https://poki.com https://*.poki.com https://pixijs.com https://discord.com https://discordapp.com https://* data:; img-src 'self' https://pixijs.com https://poki.com https://*.poki.com https://cdn.discordapp.com https://* data: blob:;",
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['poki.com', 'pixijs.com', 'cdn.discordapp.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;
