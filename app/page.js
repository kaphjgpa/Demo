"use client";

import Header from "@components/Header";
import Cart from "@components/Cart";
import Iteams from "@components/Iteams";
import { PWAInitializer } from "@components/PWAInitializer";
import Form from "@/components/Form";

export default function Home() {
  return (
    <div className="flex flex-col  gap-4 p-4">
      <PWAInitializer />
      <div className="flex-1">
        <Header />
        <Iteams />
      </div>
      <div className="w-full">
        <Cart />
        <Form />
      </div>
    </div>
  );
}
