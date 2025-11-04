import { contactSchema } from "../../validations/contactValidation.js";
import { createContact } from "../contactForm/contactService.js";

export const submitContactForm = async (req, res) => {
    try {
        // Validate input
        const validatedData = await contactSchema.validate(req.body, { abortEarly: false });

        // Save to DB using service layer
        const newContact = await createContact(validatedData);

        return res.status(200).json({
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
            data: newContact,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.errors,
            });
        }

        console.error("❌ Contact form error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};