/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@odontox/db'],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;

