export async function fetchFood() {
  try {
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
    return data.foodItems || [];
  } catch (err) {
    console.error("Error fetching food:", err);
    return [];
  }
}
