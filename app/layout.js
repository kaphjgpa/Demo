"use client";
import { useEffect } from "react";
import { PWAInitializer } from "@/components/PWAInitializer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import InstallPWA from "@/components/InstallPWA";
import { register } from "@/utils/registerSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Shree Bikaner Sweets",
//   description: "Best place to get fresh sweets",
// };

export default function RootLayout({ children }) {
  useEffect(() => {
    register();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff0000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-300 `}
      >
        <CartProvider>
          <PWAInitializer />
          {children}
          <InstallPWA />
        </CartProvider>
      </body>
    </html>
  );
}
