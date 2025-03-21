"use client";
import { useState, useEffect } from "react";

// Helper function moved inside component
const isIOS = () => {
  if (typeof window === "undefined") return false; // Handle SSR
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  useEffect(() => {
    setIsAppleDevice(isIOS()); // Set platform detection on mount

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsVisible(false));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const installClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={installClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
    >
      {isAppleDevice ? "Add to Home Screen" : "Install App"}
    </button>
  );
}
