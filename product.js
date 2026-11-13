const express = require("express")
const productRouter = require("./routes/productRoutes")
const mongooseDB = require("./config/db")
const app = express()

app.use(express.json())
mongooseDB()
app.use("/api", productRouter)

app.get("/", (req, res) => {res.send("Welcome to Products Inventory!")})

app.use((req, res) => {res.status(404).send("Not found!")})
app.listen(process.env.PORT || 7600, () => {console.log("Server running!")})