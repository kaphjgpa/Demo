// controllers/adminController.js
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin } = require("../models/Admin");
const { User } = require("../models/User");
const { JWT_SECRET } = require("../config");

// Signup Validation Schema
const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  gender: zod.string(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  contactNumber: zod
    .number()
    .min(1000000000, "Contact number must be at least 10 digits"),
});

// Signin Validation Schema
const signinBody = zod.object({
  userName: zod.string().email(),
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
    // Validate request body
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Check if the email is already registered
    const existingUser = await Admin.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    // Create a new administrator
    const user = await Admin.create({
      userName: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      contactNumber: req.body.contactNumber,
    });

    // Generate a JWT token (expires in 5 minutes)
    const token = jwt.sign({ userName: user.userName }, JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(201).json({
      message: "Admin account created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//--Signin Controller--//
exports.signin = async (req, res) => {
  try {
    // Validate request body
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validation.error.errors,
      });
    }

    // Authenticate the administrator
    const user = await Admin.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // Generate a JWT token (expires in 5 minutes)
    const token = jwt.sign({ userName: user.userName }, JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
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

    // Use the userName (or other unique field) from the request body to identify the admin
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

    // Find and update the admin
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userName }, // Find admin by userName
      { $set: updatedFields }, // Update with the fields in the request body
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details updated successfully",
      user: updatedAdmin,
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

    // Find and delete the admin by userName
    const deletedAdmin = await Admin.findOneAndDelete({ userName });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//--Get_All_Admin Controller--//

exports.getAllAdmins = async (req, res) => {
  try {
    // Fetch all admin records from the database
    const admins = await Admin.find();

    res.status(200).json({
      message: "Admins fetched successfully",
      admins: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//--Block the user--//
exports.blockUser = async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({ message: "userName is required" });
    }

    // Authenticate the request (using JWT)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find user and update the blocked field to true
    const blockedUser = await User.findOneAndUpdate(
      { userName },
      { blocked: true },
      { new: true }
    );

    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `User ${userName} has been blocked successfully` });
  } catch (error) {
    console.error("Error blocking user:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//--Unblock the user--//
exports.unBlockUser = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ message: "userName is required" });
    }

    // Find user and update the blocked field to false
    const unblockedUser = await User.findOneAndUpdate(
      { userName },
      { blocked: false },
      { new: true }
    );

    if (!unblockedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `User ${userName} has been Unblock successfully` });
  } catch (error) {
    console.error("Error blocking user:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
