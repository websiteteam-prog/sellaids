import nodemailer from "nodemailer"
import config from "../config/config.js";

// create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    }
});

// create the sendEmail function which send email
export const sendEmail = async (to, subject, text) => {
    return transporter.sendMail({
        from: `"Piyush Gupta" <${config.email.user}>`,
        to,
        subject,
        text,
    });
};