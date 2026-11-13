const Product = require("../models/Product")
const User = require("../models/User")

exports.getProducts = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group:{
                    _id: null,
                    allPrices: {
                        $sum: "$price"
                    }
                }
            }
        ])
        const products = await Product.find().populate("user", "name age email")
        res.json({products, result})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server Error!"
        })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)

        if(!product) {
           return res.status(404).json({
                message: "Product not found!"
            })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error!"
        })
        
    }
}

exports.createProduct = async (req, res) => {
    try {
        if(req.body.name === undefined || req.body.brand === undefined || req.body.quantity === undefined || req.body.price === undefined) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }
        else if(typeof req.body.name !== "string" ||
                typeof req.body.brand !== "string" ||
                typeof req.body.quantity !== "number" ||
                typeof req.body.price !== "number") {
                return res.status(400).json({
                    message: "Invalid data types!"
                })
               }
        else if(req.body.name.trim() === "" || req.body.brand.trim() === "") {
            return res.status(400).json({
                message: "Name and brand cannot be empty!"
            })
        }
        else if( req.body.quantity < 0 || req.body.price <= 0) {
            return res.status(400).json({
                message: "Invalid field values!"
            })
        }
        else if(req.body.name.length > 30 || req.body.brand.length > 30) {
            return res.status(400).json({
                message: "Product name and brand must not exceed 30 characters!"
            })
        }
        else if(!Number.isInteger(req.body.quantity)) {
            return res.status(400).json({
                message: "Quantity must be a whole number!"
            })
        }
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error!"
        })
    } 
}

exports.updateProduct = async (req, res) => {
    try {
        if(req.body.name !== undefined && typeof req.body.name !== "string" ||
                req.body.brand !== undefined && typeof req.body.brand !== "string" ||
                req.body.quantity !== undefined && typeof req.body.quantity !== "number" ||
                req.body.price !== undefined && typeof req.body.price !== "number") {
                return res.status(400).json({
                    message: "Invalid data types!"
                })
               }
        else if(req.body.name !== undefined && req.body.name.trim() === "" ||
                req.body.brand !== undefined && req.body.brand.trim() === "") {
            return res.status(400).json({
                message: "Name and brand cannot be empty!"
            })
        }
        else if(req.body.quantity !== undefined && req.body.quantity < 0 ||
                req.body.price !== undefined && req.body.price <= 0) {
            return res.status(400).json({
                message: "Invalid field values!"
            })
        }
        else if(req.body.name !== undefined && req.body.name.length > 30 ||
                req.body.brand !== undefined && req.body.brand.length > 30) {
            return res.status(400).json({
                message: "Product name and brand must not exceed 30 characters!"
            })
        }
        else if(req.body.quantity !== undefined && !Number.isInteger(req.body.quantity)) {
            return res.status(400).json({
                message: "Quantity must be a whole number!"
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!product) {
            return res.status(404).json({
                message: "Product not found!"
            })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error!"
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        )
        if(!product) {
            return res.status(404).json({
                message: "Product not found!"
            })
        }
        res.status(200).json({
            message: "Product deleted successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error!"
        })
    }
}