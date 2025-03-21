import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["s3.ap-south-1.amazonaws.com"],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\/offline/,
      handler: "NetworkOnly",
    },
    // Add more runtime caching rules as needed
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
  fallbacks: {
    document: "/offline", // Fallback page for document requests
    // image: "/static/offline.png", // Fallback for images
    // font: "/static/offline.woff2", // Fallback for fonts
  },
});

export default pwaConfig(nextConfig);
