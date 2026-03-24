/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'tl95p9j8qa65jkolcp9frlqm.35.225.205.38.sslip.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'tl95p9j8qa65jkolcp9frlqm.35.225.205.38.sslip.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '**.35.225.205.38.sslip.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.35.225.205.38.sslip.io',
        pathname: '/uploads/**',
      },
    ],
  },
};