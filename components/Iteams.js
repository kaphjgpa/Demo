import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CirclePlus } from "lucide-react";
import axios from "axios";
import { useCart } from "@/context/CartContext";

//Custom component that caches images using the Cache API
const CachedImage = ({ src, alt, ...rest }) => {
  const [cachedUrl, setCachedUrl] = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    const cacheImage = async () => {
      try {
        const cacheName = "image-cache";
        if ("caches" in window) {
          const cache = await caches.open(cacheName);
          let response = await cache.match(src);
          if (!response) {
            response = await fetch(src, { mode: "cors" });
            cache.put(src, response.clone());
          }
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          objectUrlRef.current = objectURL;
          setCachedUrl(objectURL);
        } else {
          setCachedUrl(src);
        }
      } catch (error) {
        console.error("Error caching image:", error);
        setCachedUrl(src);
      }
    };

    cacheImage();
  }, [src]);

  if (!cachedUrl) {
    return (
      <div style={{ background: "#ddd", height: "100%", width: "100%" }} />
    );
  }

  return <Image src={cachedUrl} alt={alt} {...rest} />;
};

function Items() {
  const [food, setFood] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(
          "https://demo-ynml.onrender.com/api/food/get"
        );
        setFood(response.data.foodItems);
      } catch (err) {
        console.error("Error fetching food", err);
      }
    };
    fetchFood();
  }, []);

  return (
    <div className="flex gap-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 flex-1">
        {food.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
          >
            {/* Wrap CachedFoodImage in a relative container with fixed height */}
            <div className="relative w-full h-60">
              <CachedImage
                src={item.foodUrl}
                alt={item.foodName}
                fill
                placeholder="blur"
                blurDataURL={
                  item.blurDataUrl ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                }
                className="object-cover"
                priority
                sizes="(max-width: 300px), (max-width: 300px)"
              />
              {/* <Image
                src={item.foodUrl}
                alt={item.foodName}
                width={300}
                height={200}
                className="object-cover"
                priority
              /> */}
            </div>

            <div className="p-4 bg-gray-100 flex flex-col">
              <h2 className="font-semibold text-lg">{item.foodName}</h2>
              <p className="text-gray-600 text-sm">Delicious &amp; tasty</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-green-600 font-bold text-lg">
                  ₹{item.price}
                </span>
                <CirclePlus
                  className="h-8 w-8 text-green-600 hover:text-green-400 cursor-pointer transition-all"
                  onClick={() => addToCart(item)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Items;
