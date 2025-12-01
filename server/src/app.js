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
import xpressbeesRoutes from "./routes/xpressbees/xpressbeesRoutes.js"
import contactRoutes from "./routes/contactForm/contactRoutes.js"

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


// IMAGE DOWNLOADER API – LOCAL COPY VERSION (100% WORKING – NO INTERNET)
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";
// import { Readable } from "stream";

// Dynamic csv-parser
// const getCsvParser = async () => {
//   const module = await import("csv-parser");
//   return module.default;
// };

// const upload = multer({ storage: multer.memoryStorage() });

// app.post("/api/download-images", upload.single("csvfile"), async (req, res) => {
//   if (!req.file?.buffer) {
//     return res.status(400).json({ success: false, message: "CSV file upload karo!" });
//   }

//   const __dirname = path.dirname(fileURLToPath(import.meta.url));
//   const imageDir = path.join(__dirname, "public", "image");

//   if (!fs.existsSync(imageDir)) {
//     fs.mkdirSync(imageDir, { recursive: true });
//   }

//   try {
//     const csv = await getCsvParser();
//     const results = [];
//     const readableStream = Readable.from(req.file.buffer);

//     readableStream
//       .pipe(csv())
//       .on("data", (row) => results.push(row))
//       .on("end", async () => {
//         let downloaded = 0;
//         let skipped = 0;
//         let notFound = 0;

//         for (const row of results) {
//           const urls = [
//             row.front_photo,
//             row.back_photo,
//             row.label_photo
//           ].filter(url => url && url.includes("sellaids.com"));

//           for (const url of urls) {
//             const filename = url.split("/").pop().split("?")[0];
//             const filePath = path.join(imageDir, filename);

//             // Agar pehle se hai toh skip
//             if (fs.existsSync(filePath)) {
//               skipped++;
//               continue;
//             }

//             // Local path banao (wp-content/uploads/2025/xx/...)
//             const localPath = url.replace(
//               "https://sellaids.com/wp-content/uploads/",
//               path.join(__dirname, "..", "..", "wp-content", "uploads")  // ← yahan teri purani images hain
//             );

//             // Agar local mein file hai toh copy kar do
//             if (fs.existsSync(localPath)) {
//               try {
//                 fs.copyFileSync(localPath, filePath);
//                 downloaded++;
//               } catch (err) {
//                 notFound++;
//               }
//             } else {
//               notFound++;
//             }
//           }
//         }

//         res.json({
//           success: true,
//           message: "Sab images LOCAL se copy ho gayi bhai! Internet nahi chala ek bhi baar!",
//           downloaded,
//           skipped,
//           notFound,
//           total: downloaded + skipped + notFound,
//           folder: imageDir
//         });
//       });
//   } catch (err) {
//     console.error("API Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// 🧭 API Routes
app.use("/api/user", userIndexRoutes);
app.use("/api/vendor", vendorIndexRoutes);
app.use("/api/admin", adminIndexRoutes);
app.use("/api/product", productFormRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/xpressbees", xpressbeesRoutes);
app.use("/api/contact", contactRoutes);

export default app;
