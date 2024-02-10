const express = require("express");
const router = express.Router();
const Order = require("../models/order_models");
const auth = require("../middleware/protectedresource");
// const { upload } = require("../routes/file_routes");

// creating an endpoint to create an order
router.post("/api/createorder", auth, async(req,res)=>{
    try {
        const {amount, products, paymentId } = req.body;
        const custId = req.user._id;      

        // Checking if custId, amount, productRef, and quantity are provided
        if (!amount || !custId ||!products  || !paymentId  || products.length===0) {
            return res.status(400).json({
                message: "Invalid request. Please provide amount, custId, productRef, and quantity.",
            });
        }      

        const createOrder = new Order({
            amount: amount,
            products: products, // Add the product details to the products array
            customerId: custId,
        });

        const orderCreated = await createOrder.save();
        res.status(200).json({message:"Order created is",orderCreated});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}); 

//creating an endpoint to get all the order bye admin
router.get("/api/order", async(req,res)=>{
    try
    {
        // Use populate to include product details in the orders
    const orders = await Order.find().populate('products.productRef'); // Assuming 'products' is the array of products in your Order model, and 'product' is the reference in the array
        console.log(orders);
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//creating an endpoint to get  the order of particular customer 
router.get("/api/order/custId", auth, async(req,res)=>{
    const custId= req.user._id;
    try
    {
        const orders= await Order.find({customerId:custId}).populate('products.productRef');
        console.log(orders);
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//creating an endpoint to get  the order using orderId
router.get("/api/order/:orderId", async(req,res)=>{
    const {orderId}= req.params
    try
    {
        const orders= await Order.findById(orderId);
        console.log(orders);
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;