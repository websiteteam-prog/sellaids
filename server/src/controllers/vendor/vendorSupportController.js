import { raiseSupportTicket } from "../../services/vendor/vendorSupportService.js";
import { successResponse, errorResponse } from "../../utils/helpers.js";
import { vendorTicketSchema } from "../../validations/supportValidation.js"
import logger from "../../config/logger.js";

export const vendorCreateTicketController = async (req, res) => {
    try {
        // Validate request body
        await vendorTicketSchema.validate(req.body, { abortEarly: false });

        // ✅ Get vendor ID & email from session
        const sessionvendor = req.session.vendor;
        if (!sessionvendor) {
            return errorResponse(res, "Unauthorized: Please login first", 401);
        }

        const vendor_id = sessionvendor.vendorId;
        const vendor_email = sessionvendor.email;
        const vendor_name = sessionvendor.name;
        const { title, message } = req.body;

        const ticket = await raiseSupportTicket({ vendor_id, title, message, vendor_name, vendor_email });
        return successResponse(res, 201, "Support ticket raised successfully", ticket);
    } catch (err) {
        logger.error(`createSupportTicket Error: ${err.message}`);
        return errorResponse(res, 500, err);
    }
};