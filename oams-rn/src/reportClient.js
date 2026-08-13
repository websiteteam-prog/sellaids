import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { buildReport, backendOn } from "./api";

// Build the .pptx via backend, then save + open the share sheet.
export async function exportReport(store, work, app) {
  if (!backendOn()) {
    app.toast(
      "PPT Report",
      "PPT report backend se banta hai. src/config.js me API_BASE set karke (backend chalu karke) dobara try karein."
    );
    return;
  }
  app.spinner(true, "Generating PowerPoint…");
  try {
    const { fileName, base64 } = await buildReport(store, work);
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
