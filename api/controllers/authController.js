import User from "../models/userModel.js"
import bcryptjs from "bcryptjs";

export const register = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({ userName, email, password: hashedPassword });

    try {

        await newUser.save();
        res.status(201).json({ message: "User created successfully!" })

    } catch (error) {
        next(error)
    }

};