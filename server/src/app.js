import express from "express"
import session from "express-session"
import cors from "cors"
import cookieParser from "cookie-parser"
import config from "./config/config.js"
// import { errorHandler } from "./middlewares/errorHandler.js"
import userIndexRoutes from "./routes/user/userIndexRoutes.js"
import vendorIndexRoutes from "./routes/vendor/vendorIndexRoutes.js"
import adminIndexRoutes from "./routes/admin/adminIndexRoutes.js"
import productFormRoutes from "./routes/product/productFormRoutes.js"

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: config.frontend.url,
    credentials: true,
}));
app.use(cookieParser())
// app.use(errorHandler)

// Serve uploaded files statically
// app.js
app.use('/uploads', express.static('public/image'));

// session setup
app.use(session({
    secret: config.auth.sessionSecret,
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

// user Routes
app.use('/api/user', userIndexRoutes)

// vendors Routes
app.use('/api/vendor', vendorIndexRoutes)

// admin Routes
app.use('/api/admin', adminIndexRoutes)

// Add Products
app.use('/api/product', productFormRoutes)

app.get('/', (req, res) => {
    res.json({
        msg: "hii"
    })
})

export default app