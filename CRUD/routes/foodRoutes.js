const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

router.post("/add", foodController.add);

router.get("/get", foodController.get);

module.exports = router;
