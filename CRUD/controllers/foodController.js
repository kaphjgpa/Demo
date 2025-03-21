const zod = require("zod");
const Food = require("../models/Food");

const addFoodSchema = zod.object({
  foodName: zod.string().min(2, "Food name must be at least 2 characters"),
  price: zod
    .number()
    .min(1, "Price must be at least ₹1")
    .max(5000, "Price too high"),
  foodUrl: zod.string().url("Invalid URL format"),
});

exports.add = async (req, res) => {
  try {
    const parsedData = addFoodSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: parsedData.error.format(),
      });
    }

    const { foodName, price, foodUrl } = parsedData.data;
    await Food.create({ foodName, price, foodUrl });

    return res.status(201).json({
      message: "Food added successfully",
    });
  } catch (error) {
    console.error("Error during adding food:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json({
      message: "Food fetched successfully",
      foodItems: foods.map((food) => ({
        _id: food._id,
        foodName: food.foodName,
        price: food.price,
        foodUrl: food.foodUrl,
      })),
    });
  } catch (error) {
    console.error("Error fetching foods:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
