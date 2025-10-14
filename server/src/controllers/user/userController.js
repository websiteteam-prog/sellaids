import { getUserById, updateProfile } from "../../services/user/userService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { updateUserProfile } from "../../validations/updateProfileValidation.js";
import logger from "../../config/logger.js"

export const userGetProfile = async (req, res) => {
    try {
        const { userId } = req?.session?.user;
        console.log("userId", userId)
        if (!userId) return errorResponse(res, 401, "User not logged in");

        const user = await getUserById(userId);
        if (!user) return errorResponse(res, 404, "User not found");

        logger.info(`User profile fetched: ${userId}`);
        return successResponse(res, 200, "User profile retrieved", user);
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};

export const userUpdateProfile = async (req, res) => {
    try {
        const { userId } = req?.session?.user || {};

        if (!userId) {
            return errorResponse(res, 401, "Unauthorized: User session missing");
        }

        // ✅ Validation will check all 3 fields: currentPassword, newPassword, confirmPassword
        await updateUserProfile.validate(req.body, { abortEarly: false });

        const { name, phone, currentPassword, newPassword } = req.body;

        // ✅ Only send what's needed to service
        await updateProfile(userId, name, phone, currentPassword, newPassword);

        logger.info(`Password updated for user ${userId}`);
        return successResponse(res, 200, "Password updated successfully");
    } catch (error) {
        logger.error(error.message);
        return errorResponse(res, 500, error);
    }
};