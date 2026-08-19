/* =========================================================================
 * OAMS report builder — turns a store recce into a PowerPoint (.pptx).
 * Returns a Node Buffer (the .pptx bytes).
 *
 * store: { storeName, storeCode, city, category, coordinatorName, coordinatorNumber }
 * work:  {
 *   storeImages: [dataUrl...],
 *   storeRemark: "...",
 *   elements: [ { type, width, height, total, photos:[dataUrl...], remark } ],
 *   finalRemark: "..."
 * }
 * meta:  { userName, userEmpCode, submittedAt }
 * ========================================================================= */
const PptxGenJS = require("pptxgenjs");

const NAVY = "1F3864";
const W = 13.33, H = 7.5;
function isImg(d) { return typeof d === "string" && d.indexOf("data:image") === 0; }

function header(slide, pptx, title, right) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.9, fill: { color: NAVY } });
  slide.addText(title, { x: 0.4, y: 0.12, w: 9.5, h: 0.7, fontSize: 20, bold: true, color: "FFFFFF" });
  if (right) slide.addText(right, { x: 9.9, y: 0.24, w: 3, h: 0.5, fontSize: 12, color: "CBD6EE", align: "right" });
}

function grid(slide, imgs, x0, y0, cw, ch, cols, padx, pady) {
  imgs.forEach((data, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    slide.addImage({ data, x: x0 + c * (cw + padx), y: y0 + r * (ch + pady), w: cw, h: ch });
  });
}

async function buildPptxBuffer(store, work, meta) {
  store = store || {}; work = work || {}; meta = meta || {};
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "OAMS", width: W, height: H });
  pptx.layout = "OAMS";

  // cover
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  cover.addText("OAMS Store Recce Report", { x: 0.6, y: 2.1, w: 12, h: 1, fontSize: 38, bold: true, color: "FFFFFF" });
  cover.addText(store.storeName || "Store", { x: 0.6, y: 3.2, w: 12, h: 0.7, fontSize: 24, color: "AEC1E8" });
  cover.addText([store.storeCode, store.category, store.city].filter(Boolean).join("  ·  "),
    { x: 0.6, y: 4.0, w: 12, h: 0.5, fontSize: 14, color: "CBD6EE" });
  cover.addText("Recce by: " + (meta.userName || "-") + " (" + (meta.userEmpCode || "-") + ")",
    { x: 0.6, y: 4.7, w: 12, h: 0.4, fontSize: 14, color: "CBD6EE" });
  cover.addText(meta.submittedAt ? new Date(meta.submittedAt).toLocaleString() : new Date().toLocaleString(),
    { x: 0.6, y: 5.2, w: 12, h: 0.4, fontSize: 12, color: "8FA6D6" });

  // store info + remarks
  const info = pptx.addSlide();
  header(info, pptx, "Store Details", store.storeCode || "");
  const rows = [
    ["Store Name", store.storeName], ["Store Code", store.storeCode],
    ["Category", store.category], ["City", store.city],
    ["Coordinator", store.coordinatorName], ["Contact", store.coordinatorNumber],
    ["Recce by", (meta.userName || "") + (meta.userEmpCode ? " (" + meta.userEmpCode + ")" : "")]
  ].filter((r) => r[1]).map((r) => [
    { text: String(r[0]), options: { bold: true, color: NAVY } },
    { text: String(r[1]), options: {} }
  ]);
  info.addTable(rows, { x: 0.5, y: 1.2, w: 7, colW: [2.4, 4.6], fontSize: 13, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.4 });
  if (work.storeRemark) {
    info.addText("Store remark:", { x: 8, y: 1.2, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: NAVY });
    info.addText(work.storeRemark, { x: 8, y: 1.6, w: 4.8, h: 3, fontSize: 12, color: "333333", valign: "top" });
  }
  if (work.finalRemark) {
    info.addText("Final remark:", { x: 8, y: 4.6, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: NAVY });
    info.addText(work.finalRemark, { x: 8, y: 5.0, w: 4.8, h: 1.6, fontSize: 12, color: "333333", valign: "top" });
  }

  // store photos (grid, up to 6 per slide)
  const photos = (work.storeImages || []).filter(isImg);
  const per = 6;
  for (let s = 0; s < photos.length; s += per) {
    const slide = pptx.addSlide();
    header(slide, pptx, "Store Photos", (s + 1) + "-" + Math.min(s + per, photos.length) + " of " + photos.length);
    grid(slide, photos.slice(s, s + per), 0.35, 1.15, 4.0, 2.7, 3, 0.25, 0.25);
  }

  // one slide per element (photos grid up to 6, extra slides if more)
  (work.elements || []).forEach((el, idx) => {
    const eph = (el.photos || []).filter(isImg);
    const first = pptx.addSlide();
    header(first, pptx, "Element " + (idx + 1) + ": " + (el.type || ""), (el.type || ""));
    const drows = [
      ["Type", el.type], ["Width", el.width + '"'], ["Height", el.height + '"'], ["Total", el.total + '"']
    ].map((r) => [
      { text: String(r[0]), options: { bold: true, color: NAVY } },
      { text: String(r[1] == null ? "" : r[1]), options: {} }
    ]);
    first.addText("Details", { x: 0.4, y: 1.05, w: 4, h: 0.3, fontSize: 13, bold: true, color: NAVY });
    first.addTable(drows, { x: 0.4, y: 1.4, w: 4.2, colW: [1.6, 2.6], fontSize: 12, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.42 });
    if (el.remark) {
      first.addText("Remark:", { x: 0.4, y: 3.7, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: NAVY });
      first.addText(el.remark, { x: 0.4, y: 4.05, w: 4.2, h: 2.5, fontSize: 12, color: "333333", valign: "top" });
    }
    // photos on the right (2 x 2), rest spill to extra slides
    grid(first, eph.slice(0, 4), 5.0, 1.2, 3.7, 2.5, 2, 0.25, 0.25);
    for (let s = 4; s < eph.length; s += per) {
      const slide = pptx.addSlide();
      header(slide, pptx, "Element " + (idx + 1) + " — more photos", (el.type || ""));
      grid(slide, eph.slice(s, s + per), 0.35, 1.15, 4.0, 2.7, 3, 0.25, 0.25);
    }
  });

  const b64 = await pptx.write({ outputType: "base64" });
  return Buffer.from(b64, "base64");
}

module.exports = { buildPptxBuffer };
