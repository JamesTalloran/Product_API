const express = require("express")
const userRouter = require("./routes/userRoutes")
const mongooseDB = require("./config/db")
const app = express()

app.use(express.json())
mongooseDB()
app.use("/api", userRouter)

app.get("/", (req, res) => {res.send("Welcome to Users DataBase!")})

app.use((req, res) => {res.status(404).send("Not found!")})
app.listen(8800, () => {console.log("Server running on port 8800")})