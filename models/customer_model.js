const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating the schema here
const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,   
    // required: true,// field is must
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
 
 phone:{
    type:Number,
    // required:true
  },
  isAdmin: {
    type: Boolean,
    default: false, // Set the default value to false
  },
  


},{ timestamps: true });



const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;

