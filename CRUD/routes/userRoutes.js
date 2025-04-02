const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/middleware");

// Signup route
router.post("/signup", userController.signup);

// Signin route
router.post("/signin", userController.signin);

module.exports = router;
