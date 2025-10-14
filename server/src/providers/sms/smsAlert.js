import axios from "axios"
import config from "../../config/config.js"

const SMS_API_URL = config.sms.apiUrl

export const sendSMS = async (mobile, message) => {
    const API_KEY = config.sms.apiKey
    const SENDER_ID = config.sms.apiUrl

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