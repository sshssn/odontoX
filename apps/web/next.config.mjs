/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@odontox/db'],
  experimental: {
    externalDir: true,
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
      resolveAlias: {
        '@odontox/db': '../../packages/db/src/index.ts',
      },
    },
  },
};

export default nextConfig;

