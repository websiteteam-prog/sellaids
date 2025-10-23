import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import sessionMiddleware from "./config/sessionConfig.js";
// import { errorHandler } from "./middlewares/errorHandler.js"; // Uncomment when ready
import userIndexRoutes from "./routes/user/userIndexRoutes.js";
import vendorIndexRoutes from "./routes/vendor/vendorIndexRoutes.js";
import adminIndexRoutes from "./routes/admin/adminIndexRoutes.js";
import productFormRoutes from "./routes/product/productFormRoutes.js";
import paymentRoutes from "./routes/payment/paymentRoutes.js";


const app = express();

// 🛠️ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(sessionMiddleware);
// app.use(errorHandler); // Global error handler (optional)


// 📂 Static File Serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, "public", "image");
app.use("/uploads", express.static(imageDir));


// 🧭 API Routes
app.use("/api/user", userIndexRoutes);
app.use("/api/vendor", vendorIndexRoutes);
app.use("/api/admin", adminIndexRoutes);
app.use("/api/product", productFormRoutes);
app.use("/api/payment", paymentRoutes);

// 🧠 Health Check Route-
app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is running successfully!" });
});

export default app;
