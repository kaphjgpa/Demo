// next.config.mjs
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
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
})(nextConfig);
