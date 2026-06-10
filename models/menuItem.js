const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "menu item must have a name"],
  },
  description: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "menu item must have a price"],
  },

  discount: {
    type: Number,
    validate: {
      validator: function () {
        return this.price >= this.discount;
      },
      message: "discount cannot be more than the price",
    },
  },
  category: {
    type: String,
    enum: ["appetizer", "main", "dessert", "beverage", "side"],
    required: [true, "menu item must have a category"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "restaurants",
  },
  image: String,
  preparationTime: Number,
});

const menuModel = mongoose.model("menuItems", menuItemSchema);
module.exports = menuModel;
