const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/middleware");

// Signup route
router.post("/signup", userController.signup);

// Signin route
router.post("/signin", userController.signin);

// Update route
router.put("/update", authMiddleware, userController.updateDetails);

// Delete route
router.delete("/delete", authMiddleware, userController.delete);

module.exports = router;
