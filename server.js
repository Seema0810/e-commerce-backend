// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors= require("cors");
const { downloadFile } =require('./routes/file_routes') ;
// const bodyParser = require('body-parser');

global.__basedir = __dirname;

const port = process.env.PORT;
// connecting the node with the database server using mongoose
console.log(` ${process.env.MONGODB_URL}`);
mongoose.connect(process.env.MONGODB_URL);
// checking if connected or not
mongoose.connection.on('connected',()=>{
    console.log("db connected");
}) 
// if error
mongoose.connection.on('error',(error)=>{
    console.log("Error in connecting with the database");
}) 

require('./models/customer_model')// registering the customerModel
require('./models/order_models')// registering the Order Model
require('./models/products_models')// registering the Product Model
require('./models/cart_models')// registering the Cart Model

app.use(cors());             //allow controlled access to resources on a different domain
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// route to download the file
app.get("/files/:filename", downloadFile);
app.use(require('./routes/user_routes')); //user routes
app.use(require('./routes/seedProduct_routes'));// Products routes
app.use(require('./routes/cart_routes')); // cart routes
app.use(require('./routes/order_routes')); // order routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
