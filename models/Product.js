const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
     name: String,
     brand: String,
     quantity: Number,
     price: Number,
     user:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     }
})
module.exports = mongoose.model(
    "Product",
    productSchema
)