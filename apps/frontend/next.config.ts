/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "your-other-image-domains.com",
      "lh3.googleusercontent.com", // ✅ Google profile images
      "ui-avatars.com", // ✅ Avatar fallback
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ Allow all image domains
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
