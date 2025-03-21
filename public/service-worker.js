// public/service-worker.js

// Import Workbox from the CDN.
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox is loaded");

  // Precache the offline fallback page and any other static assets you want.
  workbox.precaching.precacheAndRoute([
    { url: "/offline.html", revision: "1" },
    // Optionally add other assets here
  ]);

  // Cache the API response from the food endpoint.
  workbox.routing.registerRoute(
    ({ url }) => url.href === "https://demo-ynml.onrender.com/api/food/get",
    new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // cache for 5 minutes
        }),
      ],
    })
  );

  // Cache static assets: scripts, styles, and images.
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "script" ||
      request.destination === "style" ||
      request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "static-assets",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // cache for 1 day
        }),
      ],
    })
  );

  // Offline fallback for navigation requests.
  workbox.routing.registerRoute(
    // This catches all navigation requests.
    ({ request }) => request.mode === "navigate",
    async ({ event }) => {
      try {
        // Try to load the page from the network first.
        return await workbox.strategies.networkFirst().handle({ event });
      } catch (error) {
        // If that fails, show the offline page.
        return caches.match("/offline.html");
      }
    }
  );
} else {
  console.log("Workbox didn't load");
}
