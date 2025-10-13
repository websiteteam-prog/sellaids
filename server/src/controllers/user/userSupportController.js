import { raiseSupportTicket } from "../../services/user/userSupportService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { supportTicketSchema } from "../../validations/supportValidation.js"
import logger from "../../config/logger.js";

export const userCreateTicketController = async (req, res) => {
    try {
        // Validate request body
        await supportTicketSchema.validate(req.body, { abortEarly: false });

        // ✅ Get user ID & email from session
        const sessionUser = req.session.user;
        if (!sessionUser) {
            return errorResponse(res, "Unauthorized: Please login first", 401);
        }

        const user_id = sessionUser.userId;
        const user_email = sessionUser.email;
        const user_name = sessionUser.name;
        const { title, message } = req.body;

        const ticket = await raiseSupportTicket({ user_id, title, message, user_name, user_email });
        return successResponse(res, 201, "Support ticket raised successfully", ticket);
    } catch (err) {
        logger.error(`createSupportTicket Error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};
