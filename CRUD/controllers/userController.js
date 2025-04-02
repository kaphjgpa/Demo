// controllers/UserController.js
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const { JWT_SECRET } = require("../config");

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

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
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
    // Validate request body using Zod
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Find user by userName (email)
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the user is blocked
    // if (user.blocked) {
    //   return res.status(403).json({
    //     message: "Your account is blocked. Contact your Admin",
    //   });
    // }

    // Compare password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password OR Password not matched",
      });
    }

    // Generate a JWT token (valid for 12 hours)
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Include userId for future requests
      JWT_SECRET,
      { expiresIn: "720h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
        password: user.password,
        token,
      },
    });
    console.log(user);
  } catch (error) {
    console.error("Error during signin:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
