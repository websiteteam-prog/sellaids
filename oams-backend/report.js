/* =========================================================================
 * OAMS report builder — turns recce entries into a PowerPoint (.pptx)
 * Used by POST /api/report. Returns a base64 string.
 * entries: [ { ticket: {...}, work: { photo, photoAddress, storeRemarks, items[] } } ]
 * ========================================================================= */
const PptxGenJS = require("pptxgenjs");

const NAVY = "1F3864";

async function buildPptxBase64(moduleName, entries) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "OAMS", width: 13.33, height: 7.5 });
  pptx.layout = "OAMS";

  // cover
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  cover.addText("OAMS Field Report", { x: 0.6, y: 2.4, w: 12, h: 1, fontSize: 40, bold: true, color: "FFFFFF" });
  cover.addText(String(moduleName || "Recce"), { x: 0.6, y: 3.5, w: 12, h: 0.6, fontSize: 22, color: "AEC1E8" });
  cover.addText(new Date().toLocaleString() + "  ·  " + entries.length + " store(s)",
    { x: 0.6, y: 4.2, w: 12, h: 0.5, fontSize: 14, color: "CBD6EE" });

  entries.forEach((d) => {
    const t = d.ticket || {};
    const wk = d.work || {};
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: NAVY } });
    s.addText(t.storeName || "Store", { x: 0.4, y: 0.12, w: 9, h: 0.7, fontSize: 22, bold: true, color: "FFFFFF" });
    s.addText((t.ticketNo || "") + " · " + (t.storeCode || ""), { x: 10, y: 0.22, w: 3, h: 0.5, fontSize: 12, color: "CBD6EE", align: "right" });

    if (wk.photo && String(wk.photo).indexOf("data:image") === 0) {
      s.addImage({ data: wk.photo, x: 0.4, y: 1.2, w: 5.6, h: 4.2 });
      if (wk.photoAddress) s.addText(wk.photoAddress, { x: 0.4, y: 5.45, w: 5.6, h: 0.5, fontSize: 10, color: "666666" });
    } else {
      s.addText("No photo captured", { x: 0.4, y: 3, w: 5.6, h: 0.5, fontSize: 14, italic: true, color: "999999", align: "center" });
    }

    const info = [
      ["Category", t.category], ["Stage", t.stage],
      ["Coordinator", t.coordinatorName], ["Contact", t.coordinatorNumber],
      ["Tentative Date", t.tentativeDate]
    ];
    const infoRows = info.map((r) => [
      { text: String(r[0]), options: { bold: true, color: NAVY } },
      { text: String(r[1] == null ? "" : r[1]), options: {} }
    ]);
    s.addTable(infoRows, { x: 6.4, y: 1.2, w: 6.5, colW: [2.2, 4.3], fontSize: 11, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.32 });

    const head = ["Location", "Material", "W", "H", "Total"].map((h) =>
      ({ text: h, options: { bold: true, color: "FFFFFF", fill: NAVY } }));
    const rows = [head];
    (wk.items || []).forEach((it) => {
      rows.push([String(it.location), String(it.material), String(it.width), String(it.height), String(it.total)]);
    });
    if ((wk.items || []).length === 0) rows.push([{ text: "No items added", options: { colspan: 5, italic: true, color: "999999" } }]);
    s.addText("Items", { x: 6.4, y: 3.3, w: 6, h: 0.4, fontSize: 14, bold: true, color: NAVY });
    s.addTable(rows, { x: 6.4, y: 3.7, w: 6.5, colW: [2.0, 2.1, 0.8, 0.8, 0.8], fontSize: 10, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.3 });

    if (wk.storeRemarks) s.addText("Remarks: " + wk.storeRemarks, { x: 6.4, y: 6.2, w: 6.5, h: 0.6, fontSize: 10, italic: true, color: "444444" });
  });

  return await pptx.write({ outputType: "base64" });
}

module.exports = { buildPptxBase64 };
