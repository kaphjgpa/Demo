"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react"; // Import Download icon

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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600 text-white px-5 py-3 
               rounded-xl shadow-xl hover:bg-green-700 transition-all duration-300 transform 
               hover:scale-105 backdrop-blur-lg bg-opacity-80 hover:shadow-2xl"
    >
      <Download size={20} />
      {isAppleDevice ? "Add to Home Screen" : "Install"}
    </button>
  );
}
