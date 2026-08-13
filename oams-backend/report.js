/* =========================================================================
 * OAMS report builder — turns a store recce into a PowerPoint (.pptx).
 * Used by POST /api/report. Returns a base64 string.
 *
 * body: { store, work }
 *   work = {
 *     storeImages: [dataUrl...],      // min 5
 *     storeRemark: "...",
 *     elements: [ { type, surface, width, height, total,
 *                   imagesWithoutMark:[dataUrl,dataUrl],
 *                   imagesWithMark:[dataUrl,dataUrl], remark } ],
 *     finalRemark: "..."
 *   }
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

async function buildPptxBase64(store, work) {
  store = store || {};
  work = work || {};
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "OAMS", width: W, height: H });
  pptx.layout = "OAMS";

  // ---- cover ----
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  cover.addText("OAMS Store Recce Report", { x: 0.6, y: 2.3, w: 12, h: 1, fontSize: 38, bold: true, color: "FFFFFF" });
  cover.addText(store.storeName || "Store", { x: 0.6, y: 3.4, w: 12, h: 0.7, fontSize: 24, color: "AEC1E8" });
  cover.addText(
    [store.storeCode, store.category, store.city].filter(Boolean).join("  ·  "),
    { x: 0.6, y: 4.2, w: 12, h: 0.5, fontSize: 14, color: "CBD6EE" });
  cover.addText(new Date().toLocaleString(), { x: 0.6, y: 4.8, w: 12, h: 0.4, fontSize: 12, color: "8FA6D6" });

  // ---- store info + remark ----
  const info = pptx.addSlide();
  header(info, pptx, "Store Details", store.storeCode || "");
  const rows = [
    ["Store Name", store.storeName], ["Store Code", store.storeCode],
    ["Category", store.category], ["City", store.city],
    ["Coordinator", store.coordinatorName], ["Contact", store.coordinatorNumber]
  ].filter((r) => r[1]).map((r) => [
    { text: String(r[0]), options: { bold: true, color: NAVY } },
    { text: String(r[1]), options: {} }
  ]);
  info.addTable(rows, { x: 0.5, y: 1.2, w: 7, colW: [2.4, 4.6], fontSize: 13, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.4 });
  info.addText("Store photos: " + ((work.storeImages || []).length) + "   ·   Elements: " + ((work.elements || []).length),
    { x: 0.5, y: 5.2, w: 8, h: 0.4, fontSize: 13, bold: true, color: "444444" });
  if (work.storeRemark) {
    info.addText("Store remark:", { x: 8, y: 1.2, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: NAVY });
    info.addText(work.storeRemark, { x: 8, y: 1.6, w: 4.8, h: 3, fontSize: 12, color: "333333", valign: "top" });
  }
  if (work.finalRemark) {
    info.addText("Final remark:", { x: 8, y: 4.6, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: NAVY });
    info.addText(work.finalRemark, { x: 8, y: 5.0, w: 4.8, h: 1.6, fontSize: 12, color: "333333", valign: "top" });
  }

  // ---- store photos (grid, up to 6 per slide) ----
  const photos = (work.storeImages || []).filter(isImg);
  const perSlide = 6;               // 3 x 2 grid
  const cols = 3, cw = 4.0, ch = 2.7, gx = 0.35, gy = 1.15, padx = 0.25, pady = 0.25;
  for (let s = 0; s < photos.length; s += perSlide) {
    const slide = pptx.addSlide();
    header(slide, pptx, "Store Photos", (s + 1) + "-" + Math.min(s + perSlide, photos.length) + " of " + photos.length);
    const chunk = photos.slice(s, s + perSlide);
    chunk.forEach((data, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      slide.addImage({ data, x: gx + c * (cw + padx), y: gy + r * (ch + pady), w: cw, h: ch });
    });
  }

  // ---- one slide per element ----
  (work.elements || []).forEach((el, idx) => {
    const slide = pptx.addSlide();
    header(slide, pptx, "Element " + (idx + 1) + ": " + (el.type || ""), (el.surface || ""));

    // details table (left)
    const drows = [
      ["Type", el.type], ["Surface", el.surface],
      ["Width", el.width + '"'], ["Height", el.height + '"'], ["Total", el.total + '"']
    ].map((r) => [
      { text: String(r[0]), options: { bold: true, color: NAVY } },
      { text: String(r[1] == null ? "" : r[1]), options: {} }
    ]);
    slide.addText("Details", { x: 0.4, y: 1.05, w: 4, h: 0.3, fontSize: 13, bold: true, color: NAVY });
    slide.addTable(drows, { x: 0.4, y: 1.4, w: 4.2, colW: [1.6, 2.6], fontSize: 12, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.4 });
    if (el.remark) {
      slide.addText("Remark:", { x: 0.4, y: 4.2, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: NAVY });
      slide.addText(el.remark, { x: 0.4, y: 4.55, w: 4.2, h: 2, fontSize: 12, color: "333333", valign: "top" });
    }

    // images (right): 2 without mark (top row), 2 with mark (bottom row)
    const wo = (el.imagesWithoutMark || []).filter(isImg).slice(0, 2);
    const wm = (el.imagesWithMark || []).filter(isImg).slice(0, 2);
    const ix = 5.0, iw = 3.7, ih = 2.35, igx = 0.25;
    slide.addText("WITHOUT mark", { x: ix, y: 1.0, w: 7.6, h: 0.3, fontSize: 12, bold: true, color: "666666" });
    wo.forEach((data, i) => slide.addImage({ data, x: ix + i * (iw + igx), y: 1.35, w: iw, h: ih }));
    slide.addText("WITH mark", { x: ix, y: 3.95, w: 7.6, h: 0.3, fontSize: 12, bold: true, color: "666666" });
    wm.forEach((data, i) => slide.addImage({ data, x: ix + i * (iw + igx), y: 4.3, w: iw, h: ih }));
  });

  return await pptx.write({ outputType: "base64" });
}

module.exports = { buildPptxBase64 };
