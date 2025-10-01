import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import session from "express-session";
import { errorHandler } from "./middlewares/errorHandler.js"
import contactFormRoutes from "./routes/contactFormRoutes.js"
// import user routes
import userRoutes from "./routes/user/userRoutes.js"
import userAuthRoutes from "./routes/user/userAuthRoutes.js"
import userProfileRoutes from "./routes/user/userProfileRoutes.js"
import userProductRoutes from "./routes/user/userProductRoutes.js"
// import userCartRoutes from "./routes/user/userCartRoutes.js"
import userWatchlistRoutes from "./routes/user/userWatchlistRoutes.js"
// import userPaymentRoutes from "./routes/user/userPaymentRoutes.js"
import userSupportRoutes from './routes/user/userSupportRoutes.js'
// import vendor routes
import vendorRoutes from "./routes/vendor/vendorRoutes.js"
import vendorAuthRoutes from "./routes/vendor/vendorAuthRoutes.js"
import vendorProfileRoutes from "./routes/vendor/vendorProfileRoutes.js"
// import vendorWatchlistRoutes from "./routes/vendor/vendorWatchlistRoutes.js"
import vendorSupportRoutes from './routes/vendor/vendorSupportRoutes.js'
// import admin routes
import adminRoutes from "./routes/admin/adminRoutes.js"
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.js"
import adminProfileRoutes from "./routes/admin/adminProfileRoutes.js"
import adminProductCategoryRoutes from "./routes/admin/adminProductCategoryRoutes.js"
import adminProductRoutes from "./routes/admin/adminProductRoutes.js"
// import adminWatchlistRoutes from "./routes/admin/adminWatchlistRoutes.js"
import adminSupportRoutes from './routes/admin/adminSupportRoutes.js'

dotenv.config()
const app = express()

// session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000, // 30 minute inactivity
        httpOnly: true,
        sameSite: 'strict',
        // secure: true
    },
    rolling: true // being activity then expiry session refresh 
}))

// define middleware
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(cookieParser())
app.use(errorHandler)

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// defines and mount common routes
app.use('/api/contact', contactFormRoutes)

// define and mount user routes
app.use('/api/user', userRoutes)
app.use('/api/user/auth', userAuthRoutes)
app.use('/api/user/profile', userProfileRoutes)
app.use('/api/user/product', userProductRoutes)
// app.use('/api/user/cart', userCartRoutes)
app.use('/api/user/watchlist', userWatchlistRoutes)
// app.use('/api/user/payment', userPaymentRoutes)
app.use('/api/user/support', userSupportRoutes)

// define and mount vendor routes
app.use('/api/vendor', vendorRoutes)
app.use('/api/vendor/auth', vendorAuthRoutes)
app.use('/api/vendor/profile', vendorProfileRoutes)
// app.use('/api/vendor/watchlist', vendorWatchlistRoutes)
app.use('/api/vendor/support', vendorSupportRoutes)

// define and mount admin routes
app.use('/api/admin', adminRoutes)
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/profile', adminProfileRoutes)
app.use('/api/admin/category', adminProductCategoryRoutes)
app.use('/api/admin/product', adminProductRoutes)
// app.use('/api/admin/watchlist', adminWatchlistRoutes)
app.use('/api/admin/support', adminSupportRoutes)

// define PORT
const PORT = process.env.PORT || 8000

// server start
app.listen(PORT, () => {
    console.log(`Server is listening at the PORT ${PORT}`)
})