const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    reviews: [
      {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        reviewsBy: {
          type: Schema.Types.ObjectId,
          ref: "User", // Refers to the 'User' model
        },
      },
    ],
    category: {
      type: String,
    },
  }
  // You can add more fields as needed
);

// Create a Product model based on the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
