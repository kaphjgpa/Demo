// next.config.mjs
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["s3.ap-south-1.amazonaws.com"],
  },
};

export default withPWA({
  dest: "public", // Where to output PWA files
  disable: process.env.NODE_ENV === "development", // Disable in dev
  register: true, // Auto-register service worker
  skipWaiting: true, // Update without waiting
  runtimeCaching: [
    // HTML/Page Caching
    {
      urlPattern: ({ url }) => {
        return url.href === "https://demo-ynml.onrender.com/api/food/get";
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "food-api-cache-v1",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
        matchOptions: {
          ignoreSearch: true, // Ignore query parameters
        },
      },
    },

    // Static Assets
    {
      urlPattern: /\.(?:js|css|woff2)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },

    // Image Assets
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },

    // API Routes
    {
      urlPattern: /\/api\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
      },
    },
  ],
})(nextConfig);
