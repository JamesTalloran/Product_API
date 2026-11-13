const {z} = require("zod")
const registerSchema = z.object({
   name: z.string().min(2).max(30).trim(),
   age: z.number().int().min(5),
   email: z.string().email(),
   password: z.string().min(5).regex(/\d/)
})

const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(5)
})

const sendOTPSchema = z.object({
   email: z.string()
   .trim()
   .min(1, "Email cannot be empty!")
   .email("Invalid email format!")
})

const verifyOTPSchema = z.object({
   email: z.string()
   .trim()
   .min(1, "Email cannot be empty!")
   .email("Invalid email format!"),

   otp: z.string()
   .trim()
   .length(6, "OTP must be 6 characters long!")
   .regex(/^[0-9]+$/, "OTP must contain only numbers!")
})

module.exports = {registerSchema, loginSchema, sendOTPSchema, verifyOTPSchema}
