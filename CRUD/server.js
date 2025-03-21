const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");

dotenv.config();

const app = express();

connectDB();

// Middleware for JSON parsing
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: ["https://demo-blush-psi-31.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
