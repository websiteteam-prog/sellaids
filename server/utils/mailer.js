import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// create the sendEmail function which send email
export const sendEmail = async (to, subject, text) => {
    return transporter.sendMail({
        from: `"Piyush Gupta" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
};