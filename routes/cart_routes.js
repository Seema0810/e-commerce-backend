const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Customer = require("../models/customer_model");
const auth = require("../middleware/protectedresource");
const Cart = require("../models/cart_models");

//creating an endpoint to add the product in cart
router.post("/api/cart", auth, async (req, res) => {
  try {
    console.log("customer  is", req.user);
    console.log("customer id is", req.user._id);
    const custId = req.user._id;
    const { productRef } = req.body;
    console.log("productRef", productRef);
    // Checking if custId and productRef are provided
    if (!custId || !productRef) {
      return res.status(400).json({
        message: "Invalid request. Please provide custId and productRef.",
      });
    }
    // Create a productToAdd object
    const productToAdd = { productRef, quantity: 1 };

    // Find the cart associated with the customer ID
    let cart = await Cart.findOne({ customerId: custId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ customerId: custId, products: [] });
    }

    // Add the product to the cart's products array
    let isProductFound = cart.products.some(
      (product) => product.productRef.toString() === productRef
    );
    console.log("cart.products are", cart.products);
    console.log("is product found", isProductFound );
    if (isProductFound) {
     cart.products.map((product) => {
        if (product.productRef.toString() == productRef) {
          product.quantity = product.quantity + 1;
        }
        return product;
      });
    } else {
      cart.products.push(productToAdd);
    }
    // Save the cart to the database
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log("cart error is", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//creating an endpoint to delete the product from the cart
router.delete("/api/cart/:productRef", auth, async (req, res) => {
  try {
    const custId = req.user._id;
    const { productRef } = req.params;
    console.log("delete params are", custId, productRef);
    const updatedCart = await Cart.findOneAndUpdate(
      {
        customerId: custId,
        "products.productRef": productRef,
      },
      {
        $pull: { products: { productRef: productRef } },
      },
      { new: true }
    );
    console.log("deleted item is", updatedCart);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.log("delete error is ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//need to understand this code

//create an endpoint to edit the card details
router.put("/api/cart/:productRef", auth, async (req, res) => {
  try {
    console.log("edit params are", req.params);
    const { productRef } = req.params;
    const custId = req.user._id;
    const { quantity } = req.body;
    console.log("edit params are", req.params, custId, quantity);
    const updatedCart = await Cart.findOneAndUpdate(
      { customerId: custId },
      {
        $set: {
          "products.$[elem].productRef": productRef,
          "products.$[elem].quantity": quantity,
        },
      },
      {
        new: true, // it ensures that the updated document is returned. Without this, findByIdAndUpdate would return the original document before the update.
        arrayFilters: [{ "elem.productRef": productRef }],
      }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// creating an endpoint for getting the cart details
router.get("/api/cart", auth, async (req, res) => {
  try {
    //  const {productId}= req.params;
    console.log("customer id is", req.user._id);
    // Find the cart based on the customer and the product
    const cart = await Cart.findOne({
      customerId: req.user._id, // Assuming auth middleware sets the user in req.user
    }).populate("products.productRef"); // Populate the productRef field
    console.log("my cart is", cart);
    if (!cart) {
      // If the cart is not found, return a 404 status
      return res.status(200).json({ cart: null });
    }

    res.status(200).json({ cart: cart });
  } catch (error) {
    console.log("error in getting cart", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
