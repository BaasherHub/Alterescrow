/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["www.alterescrow.com", "app.alterescrow.com"],
    },
  },
};

module.exports = nextConfig;
