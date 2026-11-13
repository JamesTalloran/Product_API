const User = require("../models/User")
const {registerSchema, loginSchema, sendOTPSchema, verifyOTPSchema} = require("../validators/userValidator")
const bcrypt = require("bcrypt")
const transporter = require("../config/nodemailer")

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        return res.status(500).json({
            message: "Internal server Error!"
        })
    }
}

exports.registerUser = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if(!validation.success) {
            return res.status(400).json({
                message: "Zod validation failed!"
            })
        }
        const {name, age, email, password} = validation.data
        
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name, age, email, password: hashedPassword
        })
        res.status(201).json({
            message: "User registered!",
            user: newUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error!"
        })
        
    }
}

exports.loginUser = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)
    
        if(!validation.success) {
            return res.status(400).json({
                message: "Zod validation failed!"
            })
        }
        const {email, password} = validation.data

        const user = await User.findOne({email})

        if(!user) {
           return res.status(404).json({
                message: "You are not registered!"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch) {
           return res.status(401).json({
                message: "Wrong password!"
            })
        }
        res.status(200).json({
            message: "User logged!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error!"
        })
    }
}

const otpStore = {}

exports.sendOTP = async (req, res) => {
    try {
        const otpvalidator = sendOTPSchema.safeParse(req.body)
        const {email} = req.body
        if(!email) {
            return res.status(400).json({
                message: "Email required!"
            })
        }
        if(!otpvalidator.success) {
            return res.status(400).json({
                message: "Invalid email!"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        
        await transporter.sendMail({
           from: process.env.EMAIL_USER,
           to: email,
           subject: "OTP Code",
           text: `Your personal code: ${otp}`
        })

        otpStore[email] = otp

        res.status(200).json({
            message: "OTP Code sent!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error!"
        })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const verifyvalidator = verifyOTPSchema.safeParse(req.body)
        const {email, otp} = verifyvalidator.data
    if(!verifyvalidator.success) {
        return res.status(400).json({
            message: "Invalid Email or OTP!"
        })
    }
    if(otpStore[email] == otp) {
        delete otpStore[email]

        return res.status(200).json({
            message: "OTP verified!"
        })
    }
    res.status(400).json({
        message: "Invalid OTP!"
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error!"
        })
    }
}