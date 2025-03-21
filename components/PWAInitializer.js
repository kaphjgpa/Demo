"use client"; // Required for client-side hooks

import { usePWA } from "@/hooks/usePWA";

export function PWAInitializer() {
  usePWA(); // This will register the service worker
  return null; // This component doesn't render anything
}
