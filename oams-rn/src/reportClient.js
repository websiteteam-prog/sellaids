import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { buildReport, getSavedWork, backendOn } from "./api";
import { DATA } from "./data";

// Collect saved recce entries for a module -> [{ ticket, work }]
export async function collectEntries(module, extra) {
  const saved = await getSavedWork();
  const tickets = DATA.tickets[module] || [];
  const byNo = {};
  tickets.forEach((t) => { byNo[t.ticketNo] = t; });
  const entries = [];
  Object.keys(saved).forEach((no) => {
    const t = byNo[no] || { ticketNo: no, storeName: no };
    // only include tickets that belong to (or map to) this module list, plus any explicit ones
    if (byNo[no]) entries.push({ ticket: t, work: saved[no] });
  });
  if (extra && extra.ticket) {
    const exists = entries.some((e) => e.ticket.ticketNo === extra.ticket.ticketNo);
    if (!exists) entries.push(extra);
  }
  return entries;
}

// Build the .pptx via backend, then save + open the share sheet.
export async function exportReport(module, entries, app) {
  if (!backendOn()) {
    app.toast(
      "PPT Report",
      "PPT report backend se banta hai. config.js me API_BASE set karke (backend chalu karke) dobara try karein."
    );
    return;
  }
  if (!entries || !entries.length) {
    app.toast("Report", "No saved recce data yet. Complete & save a ticket first.");
    return;
  }
  app.spinner(true, "Generating PowerPoint…");
  try {
    const { fileName, base64 } = await buildReport(module, entries);
    const uri = FileSystem.cacheDirectory + (fileName || "OAMS_Report.pptx");
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    app.spinner(false);
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        dialogTitle: "OAMS Report",
        UTI: "org.openxmlformats.presentationml.presentation"
      });
    } else {
      app.toast("Report", "Saved: " + fileName);
    }
  } catch (e) {
    app.spinner(false);
    app.toast("Report", "Could not generate PPT. " + (e && e.message ? e.message : ""));
  }
}
