import connectToDb from "../config/db.js"
import { successResponse } from "../utils/apiResponse.js";
import { sendEmail } from "../utils/mailer.js";

export const contactFormController = async (req, res, next) => {
    try {
        // fetch data from frontend
        const { name, email, phone, message } = req.body;

        // if check all fields are required or not
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        
        // Phone number validation (must be 10 digits)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number. Must be 10 digits and start with 6-9.",
            });
        }

        // Save to database (Promise API)
        const sql = "INSERT INTO user_contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
        await connectToDb.promise().query(sql, [name, email, phone, message]);

        const text = `Hello ${name},\n\nWe have received your query.\n\nYour Message: ${message}\n\nWe will contact you soon.\n\n- Team`
        // Send confirmation email
        await sendEmail(email, "Thank you for contacting us!", text)

        return successResponse(res, 200, "Form submitted successfully")
    } catch (error) {
        next(error)
    }
}

// export const vendorContactFormController = async (req, res) => {
//     try {
//         // fetch data from frontend
//         const { companyName, vendorName, email, phone, businessType, website, gstIn, servicesOffered, message } = req.body;

//         // if check all fields are required or not
//         if (!companyName || !vendorName || !email || !phone || !businessType || !website || !gstIn || !servicesOffered || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         // Save to database (Promise API)
//         const sql = "INSERT INTO vendor_contacts (companyName, vendorName, email, phone, businessType, website, gstIn, servicesOffered, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
//         await connectToDb.promise().query(sql, [companyName, vendorName, email, phone, businessType, website, gstIn, servicesOffered, message]);

//         const text = `Hello ${vendorName},\n\nWe have received your query.\n\nYour Message: ${message}\n\nWe will contact you soon.\n\n- Team`
//         // Send confirmation email
//         await sendEmail(email, "Thank you for contacting us!", text)

//         return res.status(200).json({
//             success: true,
//             message: "Vendor form submitted successfully & email sent!",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Vendor contact form submission failed",
//             error: error.message
//         })
//     }
// }