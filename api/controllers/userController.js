import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: "API is working fine!"
    })
};

//Updating profile

export const updateUserProfile = async (req, res, next) => {


    try {
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, "You can update only your own profile!"))
        }

        const updatedUserProfile = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    userName: req.body.userName,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture

                }
            },
            { new: true }
        )
        const { password, ...rest } = updatedUserProfile._doc
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }

}

//Change Password

export const changeUserPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(401, "Current password is incorrect"));
        }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);

        await User.findByIdAndUpdate(
            req.params.id,
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};


//Deleting user account

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your own profile!"))
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted!");
    } catch (error) {
        next(error)
    }
}