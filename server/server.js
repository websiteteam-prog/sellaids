import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import session from "express-session";
// import contactFormRoutes from "./routes/contactFormRoutes.js"
// import user routes
import userRoutes from "./routes/user/userRoutes.js"
import userAuthRoutes from "./routes/user/userAuthRoutes.js"
// import userProfileRoutes from "./routes/user/userProfileRoutes.js"
// import userSupportRoutes from './routes/user/userSupportRoutes.js'
// import vendor routes
// import vendorRoutes from "./routes/vendor/vendorRoutes.js"
// import vendorAuthRoutes from "./routes/vendor/vendorAuthRoutes.js"
// import vendorProfileRoutes from "./routes/vendor/vendorProfileRoutes.js"
// import vendorSupportRoutes from './routes/vendor/vendorSupportRoutes.js'
// import admin routes
// import adminRoutes from "./routes/admin/adminRoutes.js"
// import adminProfileRoutes from "./routes/admin/adminProfileRoutes.js"
// import adminSupportRoutes from './routes/admin/adminSupportRoutes.js'

dotenv.config()
const app = express()

// session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 1 * 60 * 1000, // 1 minute inactivity
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

// defines and mount common routes
// app.use('/api/contact', contactFormRoutes)

// define and mount user routes
app.use('/api/user', userRoutes)
app.use('/api/user/auth', userAuthRoutes)
// app.use('/api/user/profile', userProfileRoutes)
// app.use('/api/user/support', userSupportRoutes)

// define and mount vendor routes
// app.use('/api/vendor', vendorRoutes)
// app.use('/api/vendor/auth', vendorAuthRoutes)
// app.use('/api/vendor/profile', vendorProfileRoutes)
// app.use('/api/vendor/support', vendorSupportRoutes)

// define and mount admin routes
// app.use('/api/admin', adminRoutes)
// app.use('/api/admin/profile', adminProfileRoutes)
// app.use('/api/admin/support', adminSupportRoutes)

// define PORT
const PORT = process.env.PORT || 8000

// server start
app.listen(PORT,()=>{
    console.log(`Server is listening at the PORT ${PORT}`)
})