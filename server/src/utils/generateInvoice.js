import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

/* ================= PRODUCT TABLE ================= */
const drawProductTable = (doc, items, startY) => {
  const MARGIN = 40;
  const RIGHT_X = 555;
  const PRICE_COL_X = 450;
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
    doc.font("Helvetica").fontSize(10);
  };

  drawHeader();

  (items || []).forEach((item) => {
    if (y > 720) {
      doc.addPage();
      y = 60;
      drawHeader();
    }

    const text = `${item.name}\nSKU: ${item.sku || "-"}`;
    const height = doc.heightOfString(text, { width: 300 });

    doc.text(text, MARGIN, y, { width: 300 });
    doc.text(String(item.qty || 1), 360, y);
    doc.text(`₹${item.price || 0}`, PRICE_COL_X, y, {
      width: PRICE_COL_WIDTH,
      align: "right",
    });

    y += height + 10;
  });

  return y;
};

/* ================= MAIN PDF FUNCTION ================= */
export const generateInvoicePDF = async (order = {}) => {
  const invoiceDir = path.join(process.cwd(), "src/public/invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const fileName = `invoice-${order.id || Date.now()}.pdf`;
  const filePath = path.join(invoiceDir, fileName);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  /* ================= CONSTANTS ================= */
  const PAGE_WIDTH = 595;
  const MARGIN = 40;
  const RIGHT_X = PAGE_WIDTH - MARGIN;
  const RIGHT_COL = 360;
  const RIGHT_VALUE_WIDTH = 160;

  const rightValue = (text, y) => {
    doc.text(text, RIGHT_X - RIGHT_VALUE_WIDTH, y, {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    });
  };

  /* ================= LOGO ================= */
  const logoPath = path.join(process.cwd(), "src/public/logo.webp");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, MARGIN, 30, { width: 100 });
  }

  /* ================= HEADER ================= */
  doc.font("Helvetica-Bold").fontSize(18).text("SELLAIDS", MARGIN + 120, 35);
  doc.font("Helvetica").fontSize(10).text("USE TO REUSE", MARGIN + 120, 55);

  doc.font("Helvetica-Bold").fontSize(12).text("SELLAIDS", RIGHT_COL, 35);
  doc.font("Helvetica").fontSize(10);
  doc.text(order.companyAddress1 || "", RIGHT_COL, 55);
  doc.text(order.companyAddress2 || "", RIGHT_COL, 70);
  doc.text(order.companyCity || "", RIGHT_COL, 85);

  doc.text("Company Address:", RIGHT_COL, 110);
  doc.text(order.companyName || "", RIGHT_COL, 125);

  doc.font("Helvetica-Bold").text("PAN NO:", RIGHT_COL, 150);
  rightValue(order.pan || "-", 150);

  doc.font("Helvetica-Bold").text("CIN NO:", RIGHT_COL, 170);
  rightValue(order.cin || "-", 170);

  doc.font("Helvetica").text(order.companyPhone || "", RIGHT_COL, 190);

  /* ================= TITLE ================= */
  doc.font("Helvetica-Bold").fontSize(22).text("INVOICE", MARGIN, 230);

  /* ================= BILL TO ================= */
  const billY = 265;
  doc.font("Helvetica").fontSize(10);

  doc.text(order.customerName || "Customer", MARGIN, billY);
  doc.text(order.customerAddress || "", MARGIN, billY + 15);
  doc.text(order.customerCity || "", MARGIN, billY + 30);
  doc.text(order.customerCountry || "India", MARGIN, billY + 45);
  doc.text(order.customerPhone || "", MARGIN, billY + 60);

  /* ================= SHIP TO ================= */
  doc.font("Helvetica-Bold").text("Ship To:", 250, billY);
  doc.font("Helvetica");
  doc.text(order.shipName || order.customerName || "", 250, billY + 15);
  doc.text(order.shipAddress || "", 250, billY + 30);
  doc.text(order.shipCity || "", 250, billY + 45);
  doc.text(order.shipPhone || "", 250, billY + 60);

  /* ================= META ================= */
  doc.text("Invoice Number:", RIGHT_COL, billY);
  rightValue(order.invoiceNumber || "-", billY);

  doc.text("Order Date:", RIGHT_COL, billY + 20);
  rightValue(
    order.orderDate
      ? new Date(order.orderDate).toDateString()
      : new Date().toDateString(),
    billY + 20
  );

  doc.text("Payment Method:", RIGHT_COL, billY + 40);
  rightValue(order.paymentMethod || "COD", billY + 40);

  /* ================= PRODUCT TABLE ================= */
  let tableY = drawProductTable(doc, order.items || [], billY + 120);

  /* ================= TOTALS ================= */
  if (tableY > 700) {
    doc.addPage();
    tableY = 80;
  }

  let y = tableY + 20;

  doc.font("Helvetica-Bold");
  doc.text("Subtotal", RIGHT_COL, y);
  doc.text("Shipping", RIGHT_COL, y + 18);
  doc.text("Platform Fee", RIGHT_COL, y + 36);

  doc.font("Helvetica");
  rightValue(`₹${order.subtotal || 0}`, y);
  rightValue(`₹${order.shipping_fee || 0}`, y + 18);
  rightValue(`₹${order.platform_fee || 0}`, y + 36);

  doc.moveTo(RIGHT_COL, y + 52).lineTo(RIGHT_X, y + 52).stroke();

  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Total", RIGHT_COL, y + 72);
  rightValue(`₹${order.total || 0}`, y + 72);

  /* ================= FOOTER ================= */
  const footerY = doc.page.height - 80;
  doc.fontSize(10).font("Helvetica");

  doc.text("Thanks for Shopping with us!", MARGIN, footerY, {
    width: PAGE_WIDTH - MARGIN * 2,
    align: "center",
  });
  doc.text(
    "For any queries mail us at contact@sellaids.com",
    MARGIN,
    footerY + 15,
    { width: PAGE_WIDTH - MARGIN * 2, align: "center" }
  );

  doc.end();
  return `/invoices/${fileName}`;
};
