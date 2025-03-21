const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 5000,
  },
  foodUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|svg))$/i.test(v);
      },
      message: "Invalid image URL",
    },
  },
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
