const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the Cart Schema
const CartSchema = new mongoose.Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'Customer',                                               // Use the model name 'Product' here
        required: true
    },
	products:[
		{
            productRef: {
                type: Schema.Types.ObjectId,
                ref: 'Product'                                      // Use the model name 'Product' here
            },
            quantity: {
                type: Number,
                default: 1                                          // Set a default quantity if needed
            }
        }
		]

  // You can add more fields as needed
});

// Create a Cart model based on the schema
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
