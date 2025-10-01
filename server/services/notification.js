import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const SMS_API_URL = process.env.SMS_API_URL

export const sendSMS = async (mobile, message) => {
    const API_KEY = process.env.SMSALERT_APIKEY
    const SENDER_ID = process.env.SMSALERT_SENDERID

    // check API_KEY and SENDER_ID is required
    if (!API_KEY || !SENDER_ID) {
        return {
            success: false,
            message: "Missing credentials"
        }
    }
    try {
        const res = await axios.post(SMS_API_URL, null, {
            params: {
                apikey: API_KEY,
                sender: SENDER_ID,
                mobileno: mobile,
                text: message
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = res.data
        if (data.status === 'success') {
            console.log(`✅ SMS sent to ${mobile}`);
            return { success: true, data };
        }
    } catch (error) {
        console.error(`SMS error for ${mobile}:`, error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}