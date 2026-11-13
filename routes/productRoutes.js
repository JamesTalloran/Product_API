const express = require("express")
const router = express.Router()
const controller = require("../controllers/productcontroller.js")

router.get("/products", controller.getProducts)
router.get("/products/:id", controller.getProductById)
router.post("/products", controller.createProduct)
router.put("/products/:id", controller.updateProduct)
router.delete("/products/:id", controller.deleteProduct)

module.exports = router