/* =========================================================================
 * OAMS report builder — matches the client's SAMPLE PPT format.
 * Every slide has a store header; slides: FRONT PHOTO, STORE OVERVIEW,
 * then one slide per element (TYPE : WxH, REMARKS, photos).
 * Returns a Node Buffer (.pptx bytes).
 * ========================================================================= */
const PptxGenJS = require("pptxgenjs");

const NAVY = "1F3864";
const LIGHT = "E8EDF8";
const W = 13.33, H = 7.5;
const isImg = (d) => typeof d === "string" && d.indexOf("data:image") === 0;

function header(slide, pptx, store, section) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 1.55, fill: { color: NAVY } });
  slide.addText(String(store.storeName || "STORE").toUpperCase(), { x: 0.35, y: 0.1, w: 9, h: 0.5, fontSize: 22, bold: true, color: "FFFFFF" });
  if (store.address) slide.addText(store.address, { x: 0.35, y: 0.62, w: 9, h: 0.3, fontSize: 12, color: "CBD6EE" });
  if (store.phone) slide.addText(String(store.phone), { x: 0.35, y: 0.9, w: 9, h: 0.3, fontSize: 12, color: "CBD6EE" });
  slide.addText("RET CODE: " + (store.storeCode || "") + "     RET TYPE: " + (store.retType || ""), { x: 0.35, y: 1.18, w: 9, h: 0.3, fontSize: 12, color: "CBD6EE" });
  if (store.brand) slide.addText(String(store.brand), { x: 9.4, y: 0.35, w: 3.5, h: 0.4, fontSize: 18, bold: true, color: "FFFFFF", align: "right" });
  if (store.category) slide.addText(String(store.category), { x: 9.4, y: 0.85, w: 3.5, h: 0.35, fontSize: 13, color: "AEC1E8", align: "right" });
  // section band
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 1.55, w: W, h: 0.55, fill: { color: LIGHT } });
  slide.addText(String(section || "").toUpperCase(), { x: 0.4, y: 1.6, w: 12.5, h: 0.45, fontSize: 15, bold: true, color: NAVY, align: "center" });
}

function img(slide, data, x, y, w, h) {
  slide.addImage({ data, x, y, w, h, sizing: { type: "contain", w, h } });
}

async function buildPptxBuffer(store, work, meta) {
  store = store || {}; work = work || {}; meta = meta || {};
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "OAMS", width: W, height: H });
  pptx.layout = "OAMS";

  const photos = (work.storeImages || []).filter(isImg);

  // ---- FRONT PHOTO (first store photo) ----
  {
    const s = pptx.addSlide();
    header(s, pptx, store, "Front Photo");
    if (photos[0]) img(s, photos[0], 3.4, 2.35, 6.5, 4.7);
    else s.addText("No front photo", { x: 0.4, y: 4, w: 12.5, h: 0.5, fontSize: 16, italic: true, color: "999999", align: "center" });
    footer(s, meta);
  }

  // ---- STORE OVERVIEW (remaining photos, 3 x 2 grid per slide) ----
  const rest = photos.slice(1);
  const per = 6, cols = 3, cw = 3.95, ch = 2.25, gx = 0.2, gy = 0.25, x0 = 0.45, y0 = 2.35;
  if (rest.length) {
    for (let i = 0; i < rest.length; i += per) {
      const s = pptx.addSlide();
      header(s, pptx, store, "Store Overview");
      rest.slice(i, i + per).forEach((d, k) => { const r = Math.floor(k / cols), c = k % cols; img(s, d, x0 + c * (cw + gx), y0 + r * (ch + gy), cw, ch); });
      footer(s, meta);
    }
  }

  // ---- one slide per element ----
  (work.elements || []).forEach((el) => {
    const eph = (el.photos || []).filter(isImg);
    const s = pptx.addSlide();
    header(s, pptx, store, el.type || "Element");
    s.addText((el.type || "") + "   :   " + (el.width || "") + "'' X " + (el.height || "") + "''",
      { x: 0.4, y: 2.25, w: 12.5, h: 0.4, fontSize: 16, bold: true, color: NAVY });
    const meta = [];
    if (el.qty) meta.push("QTY : " + el.qty);
    if (el.sqft) meta.push("SQFT : " + el.sqft);
    if (meta.length) s.addText(meta.join("       "), { x: 0.4, y: 2.66, w: 12.5, h: 0.3, fontSize: 12, bold: true, color: "555555" });
    s.addText("REMARKS : " + (el.remark || ""), { x: 0.4, y: 2.96, w: 12.5, h: 0.5, fontSize: 13, color: "333333" });
    // photos (2 x 2)
    const pos = [[0.6, 3.5], [6.9, 3.5], [0.6, 5.5], [6.9, 5.5]];
    eph.slice(0, 4).forEach((d, k) => img(s, d, pos[k][0], pos[k][1], 5.8, 1.95));
    footer(s, meta);
    // extra element photos on more slides
    for (let i = 4; i < eph.length; i += per) {
      const s2 = pptx.addSlide();
      header(s2, pptx, store, (el.type || "Element") + " — more photos");
      eph.slice(i, i + per).forEach((d, k) => { const r = Math.floor(k / cols), c = k % cols; img(s2, d, x0 + c * (cw + gx), y0 + r * (ch + gy), cw, ch); });
      footer(s2, meta);
    }
  });

  return await pptx.write({ outputType: "nodebuffer" });
}

function footer(slide, meta) {
  const by = "Recce by: " + (meta.userName || "-") + " (" + (meta.userEmpCode || "-") + ")   ·   " + (meta.submittedAt ? new Date(meta.submittedAt).toLocaleString() : "");
  slide.addText(by, { x: 0.4, y: 7.15, w: 12.5, h: 0.3, fontSize: 9, color: "888888", align: "right" });
}

module.exports = { buildPptxBuffer };
