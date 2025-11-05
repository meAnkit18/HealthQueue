/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed unsupported experimental.allowedDevOrigins and swcMinify which
  // were causing invalid next.config warnings for this Next.js version.
};

module.exports = nextConfig;
