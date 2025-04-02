// controllers/UserController.js
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const { JWT_SECRET } = require("../config");

// Signup Validation Schema
const signupBody = zod.object({
  // userName: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

// Signin Validation Schema
const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

//Update Validation Schema
const updateBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
  contactNumber: zod
    .number()
    .min(1000000000, "Contact number must be at least 10 digits")
    .optional(),
});

//--Signup Controller--//
exports.signup = async (req, res) => {
  try {
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    const existingUser = await User.findOne({
      // userName: req.body.userName,
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const user = await User.create({
      // userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    const token = jwt.sign(
      { userName: user.userName, email: user.email },
      JWT_SECRET,
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

//--Update Details--//

exports.updateDetails = async (req, res) => {
  try {
    // Validate the request body
    const validation = updateBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Authenticate the request (using JWT)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Use the userName (or other unique field) from the request body to identify the User
    const { userName, password, ...otherUpdates } = req.body; // Extract password separately
    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName is required for updating details" });
    }

    // Hash the password if it's present in the request body
    let updatedFields = { ...otherUpdates }; // All other updates
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    // Find and update the User
    const updatedUser = await User.findOneAndUpdate(
      { userName }, // Find User by userName
      { $set: updatedFields }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//--Delete Controller--//

exports.delete = async (req, res) => {
  try {
    const { userName } = req.user; // Extract userName from JWT token

    if (!userName) {
      return res.status(400).json({ message: "UserName not found in token" });
    }

    // Find and delete the User by userName
    const deletedUser = await User.findOneAndDelete({ userName });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
