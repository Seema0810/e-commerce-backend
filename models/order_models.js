const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the Order Schema
const orderSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',                        // Use the model name 'User' here
        required: true
    },
    products: [
        {
            productRef: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]

  // You can add more fields as needed
});

// Create a Product model based on the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
