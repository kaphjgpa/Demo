// next.config.mjs
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: ["s3.ap-south-1.amazonaws.com"],
  },
};
// const CACHE_VERSION = "v3";

export default withPWA({
  dest: "public",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development",
  additionalManifestEntries: [
    { url: "app/offline/page.jsx", revision: "1" },
    { url: "/icons/icon-192x192.png", revision: "1" },
    { url: "/icons/icon-512x512.png", revision: "1" },
  ],
  // runtimeCaching: [
  //   {
  //     urlPattern: ({ url }) => url.href.includes("/api/food/get"),
  //     handler: "NetworkFirst",
  //     options: {
  //       cacheName: `food-api-${CACHE_VERSION}`,
  //       networkTimeoutSeconds: 3,
  //       expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
  //       cacheableResponse: { statuses: [0, 200] },
  //     },
  //   },
  //   {
  //     urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
  //     handler: "CacheFirst",
  //     options: {
  //       cacheName: `images-${CACHE_VERSION}`,
  //       expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
  //     },
  //   },
  // ],
})(nextConfig);
