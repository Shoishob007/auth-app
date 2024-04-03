import User from "../models/userModel.js"
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, "Email and password are required."));
    }


    try {
        const validUser = await User.findOne({ email })

        if (!validUser) return next(errorHandler(404, "User not found!"))

        const validPassword = bcryptjs.compareSync(password, validUser.password)

        if (!validPassword) return next(errorHandler(401, "Invalid credentials"))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        //destructuring _doc object and extracting the password and rest of the property of validUser
        const { password: hashedPassword, ...rest } = validUser._doc

        const expiryDate = new Date(Date.now() + 3600000 * 24)

        //generating the cookie
        res.cookie("access_token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)


    } catch (error) {
        next(error)
    }

};