import Image from "next/image";
import AddToCartButton from "./AddToCartButton"; // Client Component

export default async function Items() {
  try {
    // Fetch food items on the server
    const response = await fetch(
      "https://demo-ynml.onrender.com/api/food/get",
      {
        cache: "no-store", // Ensures fresh data on every request
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch food items");
    }

    const data = await response.json();
    const food = data.foodItems || [];

    return (
      <div className="flex gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 flex-1">
          {food.length > 0 ? (
            food.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md">
                <div className="relative w-full h-60">
                  <Image
                    src={item.foodUrl}
                    alt={item.foodName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-4 bg-gray-100 flex flex-col">
                  <h2 className="font-semibold text-lg">{item.foodName}</h2>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{item.price}
                    </span>
                    <AddToCartButton item={item} />{" "}
                    {/* Uses Client Component */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No food items available.</p>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error fetching food:", err);
    return <p className="text-red-500">Failed to load food items.</p>;
  }
}
