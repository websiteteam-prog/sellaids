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

const imageDir = path.join(__dirname, "public", "uploads");
app.use("/uploads", express.static(imageDir));
// app.use("/invoices", express.static("src/public/invoices"));
app.use("/invoices", express.static(path.join(process.cwd(), "src/public/invoices")));

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

import PDFDocument from "pdfkit";
import fs from "fs";

// ===== Fonts folder check =====
const fontsDir = path.join(process.cwd(), "fonts");
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log("Fonts folder created at:", fontsDir);
  console.log("Note: You can add .ttf fonts here if needed.");
}

// ===== Product table function =====
const drawProductTable = (doc, items, startY) => {
  const MARGIN = 40;
  const RIGHT_X = 555;
  const PRICE_COL_X = 450;       // price column start
  const PRICE_COL_WIDTH = 100;
  let y = startY;

  const drawHeader = () => {
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Product", MARGIN, y);
    doc.text("Qty", 360, y);
    doc.text("Price", PRICE_COL_X, y, {
      width: PRICE_COL_WIDTH,
      align: "right",
    });

    doc.moveTo(MARGIN, y + 12).lineTo(RIGHT_X, y + 12).stroke();
    y += 20;
    doc.font("Helvetica");
  };

  drawHeader();

  items.forEach((item) => {
    if (y > 720) {
      doc.addPage();
      y = 60;
      drawHeader();
    }

    const text = `${item.name}\nSKU: ${item.sku}`;
    const height = doc.heightOfString(text, { width: 280 });

    doc.text(text, MARGIN, y, { width: 280 });
    doc.text(String(item.qty), 360, y);
    doc.text(
      `₹${item.price}`,
      PRICE_COL_X,
      y,
      {
        width: PRICE_COL_WIDTH,
        align: "right",
      }
    );

    y += height + 10;
  });

  return y;
};

app.get("/invoice-test", (req, res) => {
  try {
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });

    doc.pipe(res);

    const PAGE_WIDTH = 595;
    const MARGIN = 40;
    const RIGHT_X = PAGE_WIDTH - MARGIN;
    const RIGHT_COL = 360;
    const RIGHT_VALUE_WIDTH = 160;

    /* ================= HEADER ================= */
    doc.font("Helvetica-Bold").fontSize(20).text("SELLAIDS", MARGIN, 40);
    doc.font("Helvetica").fontSize(10).text("USE TO REUSE", MARGIN, 64);

    doc.font("Helvetica-Bold").fontSize(12).text("SELLAIDS", RIGHT_COL, 40);
    doc.font("Helvetica").fontSize(10);
    doc.text("A 105-A Unitech Arcadia", RIGHT_COL, 60);
    doc.text("South City 2 Gurgaon", RIGHT_COL, 75);
    doc.text("120018", RIGHT_COL, 90);

    doc.text("Company Address:", RIGHT_COL, 120);
    doc.text("Stylekins Private Limited", RIGHT_COL, 135);
    doc.text("A 105-A Unitech Arcadia", RIGHT_COL, 150);
    doc.text("South City 2", RIGHT_COL, 165);
    doc.text("Gurgaon - 120018", RIGHT_COL, 180);

    doc.font("Helvetica-Bold").text("PAN NO:", RIGHT_COL, 205);
    doc.font("Helvetica").text(
      "ABCDE1234F",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      205,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );

    doc.font("Helvetica-Bold").text("CIN NO:", RIGHT_COL, 225);

    doc.font("Helvetica").text(
      "U12345HR2023PTC123456",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      225,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );

    doc.font("Helvetica-Bold").text("ABC:", RIGHT_COL, 245);
    doc.text(
      "+91 9876543210",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      245,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );


    /* ================= TITLE ================= */
    doc.font("Helvetica-Bold").fontSize(26).text("INVOICE", MARGIN, 285);

    /* ================= BILL TO ================= */
    const billY = 330;
    doc.font("Helvetica").fontSize(11);
    doc.text("Rahul Sharma", MARGIN, billY);
    doc.text("Flat 402, Green Residency", MARGIN, billY + 16);
    doc.text("Sector 57", MARGIN, billY + 32);
    doc.text("Gurgaon", MARGIN, billY + 48);
    doc.text("122011", MARGIN, billY + 64);
    doc.text("India", MARGIN, billY + 80);
    doc.text("rahul.sharma@gmail.com", MARGIN, billY + 96);
    doc.text("+91 9999999999", MARGIN, billY + 112);

    /* ================= SHIP TO ================= */
    doc.font("Helvetica-Bold").text("Ship To:", 240, billY);
    doc.font("Helvetica");
    doc.text("Rahul Sharma", 240, billY + 16);
    doc.text("Flat 402, Green Residency", 240, billY + 32);
    doc.text("Sector 57", 240, billY + 48);
    doc.text("Gurgaon", 240, billY + 64);
    doc.text("122011", 240, billY + 80);
    doc.text("India", 240, billY + 96);
    doc.text("+91 9999999999", 240, billY + 112);

    /* ================= META ================= */
    doc.text("Invoice Number:", RIGHT_COL, billY);
    doc.text(
      "INV-2025-001",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      billY,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );

    doc.text("Order Number:", RIGHT_COL, billY + 22);
    doc.text(
      "ORD-987654",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      billY + 22,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    )

    doc.text("Order Date:", RIGHT_COL, billY + 44);
    doc.text(
      new Date().toDateString(),
      RIGHT_X - RIGHT_VALUE_WIDTH,
      billY + 44,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );

    doc.text("Payment Method:", RIGHT_COL, billY + 66);
    doc.text(
      "Cash on Delivery",
      RIGHT_X - RIGHT_VALUE_WIDTH,
      billY + 66,
      {
        width: RIGHT_VALUE_WIDTH,
        align: "right",
      }
    );

    /* ================= PRODUCT TABLE ================= */
    const items = [
      { name: "Bluetooth Headphones", sku: "BH-101", qty: 1, price: 1999 },
      { name: "Wireless Mouse", sku: "WM-202", qty: 2, price: 799 },
    ];

    let tableEndY = drawProductTable(doc, items, billY + 150);

    /* ================= TOTALS ================= */
    let y = tableEndY + 20;

    doc.font("Helvetica-Bold");
    doc.text("Subtotal", RIGHT_COL, y);
    doc.text("Shipping", RIGHT_COL, y + 18);
    doc.text("Platform Fee", RIGHT_COL, y + 36);

    doc.font("Helvetica");
    doc.text("₹3597", RIGHT_X - RIGHT_VALUE_WIDTH, y, { width: RIGHT_VALUE_WIDTH, align: "right" });
    doc.text("₹99", RIGHT_X - RIGHT_VALUE_WIDTH, y + 18, { width: RIGHT_VALUE_WIDTH, align: "right" });
    doc.text("₹50", RIGHT_X - RIGHT_VALUE_WIDTH, y + 36, { width: RIGHT_VALUE_WIDTH, align: "right" });

    doc.moveTo(RIGHT_COL, y + 54).lineTo(RIGHT_X, y + 54).stroke();

    doc.font("Helvetica-Bold").fontSize(13);
    doc.text("Total", RIGHT_COL, y + 76);
    doc.text("₹3746", RIGHT_X - RIGHT_VALUE_WIDTH, y + 76, { width: RIGHT_VALUE_WIDTH, align: "right" });

    /* ================= FOOTER ================= */
    const footerY = doc.page.height - 80;

    doc.fontSize(10).font("Helvetica");
    doc.text(
      "Thanks for Shopping with us!",
      MARGIN,
      footerY,
      {
        width: PAGE_WIDTH - MARGIN * 2,
        align: "center",
      }
    );
    doc.text(
      "For any queries mail us at contact@sellaids.com",
      MARGIN,
      footerY + 15,
      {
        width: PAGE_WIDTH - MARGIN * 2,
        align: "center",
      }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).send("Invoice generation failed");
    }
  }
});


// 🧭 API Routes
app.use("/api/user", userIndexRoutes);
app.use("/api/vendor", vendorIndexRoutes);
app.use("/api/admin", adminIndexRoutes);
app.use("/api/product", productFormRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/xpressbees", xpressbeesRoutes);
app.use("/api/contact", contactRoutes);

export default app;
