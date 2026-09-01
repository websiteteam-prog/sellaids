/* =========================================================================
 * Hanu Multimedia — report builder (matches the client's SAMPLE PPT format).
 * Canvas 10 x 7.5 (4:3). Every slide has a store header.
 * Slides: FRONT PHOTO, STORE OVERVIEW, VISITING CARD (if any),
 * then one slide per element (big photo left + small photos right,
 * TYPE : W'' X H'' bottom-left, REMARKS bottom-right).
 * Returns a Node Buffer (.pptx bytes).
 * ========================================================================= */
const PptxGenJS = require("pptxgenjs");

const NAVY = "1F3864";
const LIGHT = "E8EDF8";
const W = 10, H = 7.5;
const isImg = (d) => typeof d === "string" && d.indexOf("data:image") === 0;

// Read intrinsic pixel size from a base64 JPEG/PNG data URL (to keep aspect ratio).
function imageSize(dataUrl) {
  try {
    const i = String(dataUrl).indexOf("base64,");
    if (i < 0) return null;
    const buf = Buffer.from(dataUrl.slice(i + 7), "base64");
    if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) { // PNG
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    if (buf.length > 4 && buf[0] === 0xFF && buf[1] === 0xD8) { // JPEG
      let o = 2;
      while (o + 9 < buf.length) {
        if (buf[o] !== 0xFF) { o++; continue; }
        const m = buf[o + 1];
        if ((m >= 0xC0 && m <= 0xC3) || (m >= 0xC5 && m <= 0xC7) || (m >= 0xC9 && m <= 0xCB) || (m >= 0xCD && m <= 0xCF)) {
          return { h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
        }
        if (buf[o + 1] === 0xD8 || buf[o + 1] === 0xD9 || (buf[o + 1] >= 0xD0 && buf[o + 1] <= 0xD7)) { o += 2; continue; }
        o += 2 + buf.readUInt16BE(o + 2);
      }
    }
  } catch (e) {}
  return null;
}

// Place image inside the x,y,w,h box WITHOUT stretching: keep aspect ratio, center it.
function img(slide, data, x, y, w, h) {
  const dim = imageSize(data);
  let dw = w, dh = h, dx = x, dy = y;
  if (dim && dim.w > 0 && dim.h > 0) {
    const s = Math.min(w / dim.w, h / dim.h);
    dw = dim.w * s; dh = dim.h * s;
    dx = x + (w - dw) / 2; dy = y + (h - dh) / 2;
  }
  slide.addImage({ data, x: dx, y: dy, w: dw, h: dh });
}

function header(slide, pptx, store, section) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 1.5, fill: { color: NAVY } });
  slide.addText(String(store.storeName || "STORE").toUpperCase(), { x: 0.3, y: 0.12, w: 6.7, h: 0.5, fontSize: 16, bold: true, color: "FFFFFF" });
  if (store.address) slide.addText(String(store.address), { x: 0.3, y: 0.6, w: 6.7, h: 0.3, fontSize: 10, color: "CBD6EE" });
  if (store.phone) slide.addText(String(store.phone), { x: 0.3, y: 0.85, w: 6.7, h: 0.3, fontSize: 10, color: "CBD6EE" });
  slide.addText("RET CODE: " + (store.storeCode || "") + "     RET TYPE: " + (store.retType || ""), { x: 0.3, y: 1.1, w: 6.7, h: 0.3, fontSize: 10, color: "CBD6EE" });
  if (store.brand) slide.addText(String(store.brand), { x: 7.0, y: 0.3, w: 2.7, h: 0.4, fontSize: 15, bold: true, color: "FFFFFF", align: "right" });
  if (store.category) slide.addText(String(store.category), { x: 7.0, y: 0.78, w: 2.7, h: 0.35, fontSize: 11, color: "AEC1E8", align: "right" });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 1.5, w: W, h: 0.5, fill: { color: LIGHT } });
  slide.addText(String(section || "").toUpperCase(), { x: 0.3, y: 1.53, w: 9.4, h: 0.44, fontSize: 14, bold: true, color: NAVY, align: "center" });
}

function footer(slide, meta) {
  const by = "Recce by: " + (meta.userName || "-") + " (" + (meta.userEmpCode || "-") + ")   ·   " + (meta.submittedAt ? new Date(meta.submittedAt).toLocaleString() : "");
  slide.addText(by, { x: 0.3, y: 7.2, w: 9.4, h: 0.26, fontSize: 8, color: "888888", align: "right" });
}

async function buildPptxBuffer(store, work, meta) {
  store = store || {}; work = work || {}; meta = meta || {};
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "HM", width: W, height: H });
  pptx.layout = "HM";

  const photos = (work.storeImages || []).filter(isImg);

  // ---- FRONT PHOTO (first store photo, big & centered) ----
  {
    const s = pptx.addSlide();
    header(s, pptx, store, "Front Photo");
    if (photos[0]) img(s, photos[0], 3.0, 2.2, 4.0, 5.0);
    else s.addText("No front photo", { x: 0.3, y: 4, w: 9.4, h: 0.5, fontSize: 15, italic: true, color: "999999", align: "center" });
    footer(s, meta);
  }

  // ---- STORE OVERVIEW (remaining photos: 2 top + 1 bottom-center per slide) ----
  const rest = photos.slice(1);
  const ovPos = [[0.6, 2.15, 4.0, 2.9], [5.4, 2.15, 4.0, 2.9], [3.0, 5.15, 4.0, 1.9]];
  for (let i = 0; i < rest.length; i += 3) {
    const s = pptx.addSlide();
    header(s, pptx, store, "Store Overview");
    rest.slice(i, i + 3).forEach((d, k) => img(s, d, ovPos[k][0], ovPos[k][1], ovPos[k][2], ovPos[k][3]));
    footer(s, meta);
  }

  // ---- VISITING CARD (only if captured) ----
  if (isImg(work.visitingCard)) {
    const s = pptx.addSlide();
    header(s, pptx, store, "Visiting Card");
    img(s, work.visitingCard, 2.75, 2.2, 4.5, 4.8);
    footer(s, meta);
  }

  // ---- one slide per element ----
  (work.elements || []).forEach((el) => {
    const eph = (el.photos || []).filter(isImg);
    const s = pptx.addSlide();
    header(s, pptx, store, el.type || "Element");
    if (eph[0]) img(s, eph[0], 0.5, 2.15, 4.3, 4.35); // big photo (left)
    if (eph[1]) img(s, eph[1], 5.3, 2.15, 4.2, 2.1);  // small (top-right)
    if (eph[2]) img(s, eph[2], 5.3, 4.4, 4.2, 2.1);   // small (bottom-right)

    let typeLine = (el.type || "") + "  :  " + (el.width || "") + "'' X " + (el.height || "") + "''";
    if (el.qty) typeLine += "    ·    QTY " + el.qty;
    if (el.sqft) typeLine += "    ·    " + el.sqft + " SQFT";
    s.addText(typeLine, { x: 0.4, y: 6.62, w: 4.6, h: 0.45, fontSize: 12, bold: true, color: NAVY });
    s.addText("REMARKS : " + (el.remark || ""), { x: 5.3, y: 6.55, w: 4.3, h: 0.6, fontSize: 11, color: "333333", valign: "top" });
    footer(s, meta);

    // extra element photos (4th onward) on more slides — 3 x 2 grid
    for (let i = 3; i < eph.length; i += 6) {
      const s2 = pptx.addSlide();
      header(s2, pptx, store, (el.type || "Element") + " — more photos");
      eph.slice(i, i + 6).forEach((d, k) => { const r = Math.floor(k / 3), c = k % 3; img(s2, d, 0.5 + c * 3.15, 2.2 + r * 2.5, 2.95, 2.35); });
      footer(s2, meta);
    }
  });

  return await pptx.write({ outputType: "nodebuffer" });
}

module.exports = { buildPptxBuffer };
