"use client"; // This makes only this component a Client Component

import { CirclePlus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ item }) {
  const { addToCart } = useCart();

  return (
    <CirclePlus
      className="h-8 w-8 text-green-600 hover:text-green-400 cursor-pointer transition-all"
      onClick={() => addToCart(item)}
    />
  );
}
