import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config()

mongoose.connect("mongodb+srv://shoishob:shoishob@cluster0.nx046.mongodb.net/authentication?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Connected to mongoDB")
}).catch((err) => {
    console.log(err)
})
const app = express();
app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
    console.log("Server listened at port 3000!")
})


app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error!";

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })

})