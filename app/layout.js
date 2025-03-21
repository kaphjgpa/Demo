import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shree Bikaner Sweets",
  description: "Best place to get fresh sweets",
};

export default function RootLayout({ children }) {
  // app/page.js is the child here
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-300 `}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
