import { UserSupport } from "../../models/userSupportModel.js";
import { sendEmail } from "../../utils/mailer.js";
import logger from "../../config/logger.js";

export const raiseSupportTicket = async ({ user_id, title, message, user_name, user_email }) => {
    try {
        // Save to DB
        const ticket = await UserSupport.create({ user_id, title, message });
        logger.info(`Support ticket #${ticket.id} created by user ${user_id}`);

        const text = `Hello ${user_name},\n\nWe have received your ticket:\n\n${message}\n\nThank you!`
        // Send email notification
        await sendEmail(user_email, `Ticket Received: ${title}`, text)

        return ticket;
    } catch (err) {
        logger.error(`raiseSupportTicket Error: ${err.message}`);
        throw err;
    }
};