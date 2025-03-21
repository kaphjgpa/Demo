const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware } = require("../middlewares/middleware");

// Signup route
router.post("/signup", adminController.signup);

// Signin route
router.post("/signin", adminController.signin);

// Update route
router.put("/update-details", authMiddleware, adminController.updateDetails);

router.get("/all", authMiddleware, adminController.getAllAdmins);

// Delete route
router.delete("/delete", authMiddleware, adminController.delete);

// Block user
router.put("/block", authMiddleware, adminController.blockUser);

//Unblock user
router.put("/unblock", authMiddleware, adminController.unBlockUser);

module.exports = router;
