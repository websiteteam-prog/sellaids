import { raiseSupportTicket } from "../../services/user/userSupportService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { supportTicketSchema } from "../../validations/supportValidation.js";
import logger from "../../config/logger.js";

export const userCreateTicketController = async (req, res) => {
  try {
    // Validate request body
    await supportTicketSchema.validate(req.body, { abortEarly: false });

    // Get user ID, email, and name from session
    const sessionUser = req.session.user;
    logger.info("Session user data:", JSON.stringify(sessionUser, null, 2)); // Enhanced logging
    if (!sessionUser) {
      return errorResponse(res, "Unauthorized: Please login first", 401);
    }

    const user_id = sessionUser.userId;
    const user_email = sessionUser.email;
    const user_name = sessionUser.name;
    const { title, message } = req.body;

    const ticket = await raiseSupportTicket({ user_id, title, message, user_name, user_email });
    logger.info("Ticket created:", JSON.stringify(ticket, null, 2)); // Log ticket details
    return successResponse(res, 201, "Support ticket raised successfully", { ticket });
  } catch (err) {
    logger.error(`createSupportTicket Error: ${err.message}`, { error: err });
    if (err.name === "ValidationError") {
      const errors = err.errors || ["Validation failed"];
      return res.status(400).json({ success: false, error: errors, message: "Validation failed" });
    }
    return errorResponse(res, 500, err.message || "Internal server error");
  }
};