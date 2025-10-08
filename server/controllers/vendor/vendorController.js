import connectToDb from "../../config/db.js"
import crypto from "crypto"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { sendEmail } from "../../utils/mailer.js"
dotenv.config()

export const getAllVendorsController = async (req, res)=>{
    try {
        // get all vendors
        const [results] = await connectToDb.promise().query("SELECT id, name, phone, email FROM vendors")
        return res.status(200).json({
            success: true,
            message: "get all vendor successfully",
            data: results
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "get all vendor process failed",
            error: error.message
        })
    }
}

export const vendorForgotPasswordController = async (req, res) => {
    try {
        // fetch email from frontend
        const { email } = req.body;

        // if email is required or not
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const [rows] = await connectToDb.promise().query("SELECT * FROM vendors WHERE email = ?", [email]);

        // Vendor not found
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Vendor not found with this email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        // Save token to DB
        await connectToDb.promise().query(
            "UPDATE vendors SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
            [resetToken, tokenExpiry, email]
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        //  Send reset link to via email to
        await sendEmail(email, "Reset Your Password", `Click here to reset your password: ${resetLink}`)

        return res.status(200).json({
            success: true,
            message: "Reset link has been sent successfully",
            resetLink  // In real app, you would email this instead of returning it
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Vendor forgot password process failed",
            error: error.message
        })
    }
}

export const vendorResetPasswordController = async (req, res) => {
    try {
        // fetch email from frontend
        const { token, newPassword } = req.body;

        // if token and  newPassword required or not
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        // Verify token & expiry
        const [vendors] = await connectToDb.promise().query(
            "SELECT * FROM vendors WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token]
        );

        if (vendors.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const vendor = vendors[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password & clear token
        await connectToDb.promise().query(
            "UPDATE vendors SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
            [hashedPassword, vendor.id]
        );

        //  Send reset link to via email to
        await sendEmail(
            vendor.email,
            "Password Reset Confirmation",
            `Hello ${vendor.name || "Vendor"},\n\n` +
            `This is to inform you that your password has been reset successfully.\n\n` +
            `If you did not initiate this change, please contact the support team immediately or take necessary security measures.\n\n` +
            `Best regards,\nYour App Team`
        );
        
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Vendor reset password process failed",
            error: error.message
        })
    }
}