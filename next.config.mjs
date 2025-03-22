// next.config.mjs
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["s3.ap-south-1.amazonaws.com"],
  },
  // Move headers here (proper Next.js format)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' vercel.live 'unsafe-inline'; img-src 'self' s3.ap-south-1.amazonaws.com data:; script-src 'self' 'unsafe-eval'",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  additionalManifestEntries: [
    { url: "/offline", revision: "v1" }, // Use route path
    { url: "/icons/icon-192x192.png", revision: "v1" },
    { url: "/icons/icon-512x512.png", revision: "v1" },
  ],
  runtimeCaching: [
    {
      urlPattern: /\/offline/,
      handler: "NetworkOnly",
      options: {
        cacheName: "offline-page",
      },
    },
  ],
})(nextConfig);
