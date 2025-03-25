import React from "react";
import { Button } from "@components/ui/button";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@context/CartContext";

function Cart() {
  const { cart, removeFromCart, total } = useCart();

  return (
    <div className="flex flex-col bg-gray-100 rounded-md w-full h-[90vh] p-4 shadow-lg relative">
      <div className="flex-grow overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item._id}
            className="m-4 flex bg-blue-100 rounded-md p-4 items-center overflow-y-auto gap-4"
          >
            <Image
              className="rounded-md"
              src={item.foodUrl}
              width={80}
              height={80}
              alt={item.foodName}
            />
            <div className="flex-grow">
              <h2 className="font-semibold text-lg">{item.foodName}</h2>
              <p className="text-gray-600 text-sm">
                ₹{item.price} x {item.quantity}
              </p>
              <p className="text-gray-600">₹{item.price * item.quantity}</p>
            </div>
            <Trash2
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => removeFromCart(item._id)}
            />
          </div>
        ))}
      </div>
      <div className="m-10">------------------------</div>

      <div className="absolute bottom-0 right-0 left-0 w-full p-4 bg-white rounded-md">
        <div className="flex justify-between mb-4">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-lg">₹{total}</span>
        </div>
        <div className="flex justify-between">
          <Button
            className="h-12 w-36 bg-red-600 hover:bg-red-700 text-white font-medium text-lg"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button
            className="h-12 w-36 bg-green-600 hover:bg-green-500 text-white font-medium text-lg"
            variant="secondary"
          >
            Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
