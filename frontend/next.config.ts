/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sleepercdn.com',
        pathname: '/content/nfl/players/thumb/**',
      },
    ],
  },
};

export default nextConfig;
