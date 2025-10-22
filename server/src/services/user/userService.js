import bcrypt from "bcryptjs";
import { User } from "../../models/userModel.js";

export const getUserById = async (userId) => {
    return await User.findByPk(userId);
};

export const updateProfile = async (userId, name, phone, currentPassword, newPassword) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.name = name;
        user.phone = phone;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};