const express = require("express")
const router = express.Router()
const controller = require("../controllers/usercontroller.js")

router.get("/users", controller.getUsers)
router.post("/users/register", controller.registerUser)
router.post("/users/login", controller.loginUser)
router.post("/users/send-otp", controller.sendOTP)
router.post("/users/verify-otp", controller.verifyOTP)

module.exports = router