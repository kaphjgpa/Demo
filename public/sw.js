const CACHE_VERSION = "v3"; // Update this when making cache changes
const API_CACHE = `food-api-${CACHE_VERSION}`;
const STATIC_CACHE = `static-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { backgroundSync } from "workbox-background-sync";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

const { BackgroundSyncPlugin } = backgroundSync;

// Precache assets during installation
precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: "/offline", revision: "1" },
  { url: "/icons/icon-192x192.png", revision: "1" },
  { url: "/icons/icon-512x512.png", revision: "1" },
]);

// Enhanced API caching
// Then modify your API caching strategy
registerRoute(
  ({ url }) => url.href.includes("/api/food/get"),
  new NetworkFirst({
    cacheName: API_CACHE,
    plugins: [
      new BackgroundSyncPlugin("food-queue", {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
  "GET" // Only for GET requests
);

// Navigation fallback
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-v1",
    plugins: [new ExpirationPlugin({ maxEntries: 10 })],
  })
);

// Cache static assets (JS, CSS, Fonts)
registerRoute(
  ({ request }) => ["script", "style", "font"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: STATIC_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Cache HTML pages with fallback
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
  })
);

// Serve offline page when network is down
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request))
      .catch(() => caches.match("/offline"))
  );
});

// Install and activate service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-cache").then((cache) => {
      return cache.addAll(["/offline.html"]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//Add Cache Update Notification
self.addEventListener("message", (event) => {
  if (event.data.type === "CACHE_UPDATED") {
    showNotification("New content available!");
  }
});
