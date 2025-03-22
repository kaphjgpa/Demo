const CACHE_VERSION = "v2";
export default withPWA({
  dest: "public",
  sw: "sw.js",
  precache: ["**/*.js", "**/*.css", "/icons/*.png", "/screenshots/*.png"],
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.href.includes("/api/food/get"),
      handler: "NetworkFirst",
      options: {
        cacheName: `food-api-${CACHE_VERSION}`,
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: `images-${CACHE_VERSION}`,
        expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
      },
    },
  ],
})(nextConfig);
