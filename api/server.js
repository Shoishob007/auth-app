import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to mongoDB")
}).catch((err) => {
    console.log(err)
})
const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log("Server listened at port 3000!")
})


app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)