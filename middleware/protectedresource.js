const jwt =require('jsonwebtoken');
const dotenv=require('dotenv').config();



const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");

module.exports= async (req, res, next)=>{
  
    const {authorization}= req.headers;
     //Bearer gjhlkjlkiju;pioj;oi
    if(!authorization){
        return res.status(401).json({error:"Customer not logged in"});
    }
    
    const token= authorization.replace("Bearer ","");
    try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload:", payload);
    const {_id } = payload; 
    // console.log("Payload:", payload);// Log the payload to see its structure

    const customerdb = await Customer.findById(_id);


    if (!customerdb) {
      return res.status(401).json({ error: "Customer not found" });
    }

    req.user = customerdb;
    next(); // goes to the next middleware or goes to the REST API
  }
   catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
 }}