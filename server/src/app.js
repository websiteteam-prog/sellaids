import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import config from "./config/config.js"
import path from "path"
import sessionMiddleware from "./config/sessionConfig.js"
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
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'public', 'uploads')));

// session middleware
app.use(sessionMiddleware)

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