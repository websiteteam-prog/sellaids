import dotenv from 'dotenv';

dotenv.config(); // dotenv ko sirf yaha import karke configure karenge

const config = {
  server: {
    port: process.env.PORT || 5000,
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  sms: {
    apiKey: process.env.SMSALERT_APIKEY,
    senderId: process.env.SMSALERT_SENDERID,
    apiUrl: process.env.SMS_API_URL,
  },
  payment: {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  },
};

export default config;