import connectToDb from "../../config/db.js"
import crypto from "crypto"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { sendEmail } from "../../utils/mailer.js"
dotenv.config()

export const adminForgotPasswordController = async (req, res) => {
    try {
        // fetch email from frontend
        const { email } = req.body;

        // if email is required or not
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const [rows] = await connectToDb.promise().query("SELECT * FROM admin WHERE email = ?", [email]);

        // Admin not found
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found with this email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 60000); // 5 min expiry

        // Save token to DB
        await connectToDb.promise().query(
            "UPDATE admin SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
            [resetToken, tokenExpiry, email]
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

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
            message: "Admin forgot password process failed",
            error: error.message
        })
    }
}

export const adminResetPasswordController = async (req, res) => {
    try {
        // fetch email from frontend
        const { token, newPassword } = req.body;

        // if token and  newPassword required or not
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        // Verify token & expiry
        const [admins] = await connectToDb.promise().query(
            "SELECT * FROM admin WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token]
        );

        if (admins.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const admin = admins[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password & clear token
        await connectToDb.promise().query(
            "UPDATE admin SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
            [hashedPassword, admin.id]
        );

        //  Send reset link to via email to
        await sendEmail(
            admin.email,
            "Password Reset Confirmation",
            `Hello ${admin.name || "Admin"},\n\n` +
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
            message: "Admin reset password process failed",
            error: error.message
        })
    }
}