// controllers/UserController.js
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

// Signup Validation Schema
const signupBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});

// Signin Validation Schema
const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

// --Signup Controller--//
exports.signup = async (req, res) => {
  try {
    // Validate input data
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Ensure database is connected
    if (!User) {
      return res.status(500).json({ message: "Database connection error" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    // Create new user (no explicit password hashing here - let the pre-save hook handle it)
    const user = await User.create({
      email: req.body.email,
      password: req.body.password, // Pass the raw password - the schema hook will hash it
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "720h",
      }
    );

    res
      .status(201)
      .json({ message: "User account created successfully", token: token });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//--Signin Controller--//
exports.signin = async (req, res) => {
  try {
    // Validate request body
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation Errors:", validation.error.errors);
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password using the schema method
    const isPasswordMatch = await user.comparePassword(req.body.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
