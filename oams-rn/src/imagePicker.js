import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

/* =========================================================================
 * Photo capture — works on the mobile APP and the WEBSITE.
 *   • Native (Android/iOS): Camera / Gallery chooser via expo-image-picker.
 *   • Web: a browser file input (Alert + native camera don't work on web),
 *     with a canvas downscale so uploads stay small. On phones the browser
 *     file picker still offers the camera.
 * Both return a JPEG data URL, so display + backend PPT work the same way.
 * ========================================================================= */

const IS_WEB = Platform.OS === "web";

// ---- WEB helpers ----
function downscaleDataUrl(dataUrl, maxDim, quality) {
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.onload = () => {
        try {
          let w = img.width, h = img.height;
          const scale = Math.min(1, maxDim / Math.max(w, h || 1));
          w = Math.max(1, Math.round(w * scale));
          h = Math.max(1, Math.round(h * scale));
          const canvas = window.document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (e) { resolve(dataUrl); }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch (e) { resolve(dataUrl); }
  });
}

function pickImageWeb(onImage, onError) {
  try {
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) { cleanup(); return; }
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const small = await downscaleDataUrl(String(reader.result), 1400, 0.6);
          onImage(small);
        } catch (e) { onImage(String(reader.result)); }
        cleanup();
      };
      reader.onerror = () => { if (onError) onError("Could not read the image."); cleanup(); };
      reader.readAsDataURL(file);
    };
    function cleanup() { try { window.document.body.removeChild(input); } catch (e) {} }
    window.document.body.appendChild(input);
    input.click();
  } catch (e) {
    if (onError) onError((e && e.message) || "Could not open the file picker.");
  }
}

// ---- NATIVE capture (camera or gallery) -> jpeg data URL (or null) ----
export async function grabImage(fromCamera) {
  try {
    if (fromCamera) {
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) return { error: "Camera permission is needed." };
      const r = await ImagePicker.launchCameraAsync({ quality: 0.4, base64: true, allowsEditing: false });
      if (r.canceled) return null;
      return { dataUrl: "data:image/jpeg;base64," + r.assets[0].base64 };
    } else {
      const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!p.granted) return { error: "Gallery permission is needed." };
      const r = await ImagePicker.launchImageLibraryAsync({
        quality: 0.4, base64: true, mediaTypes: ImagePicker.MediaTypeOptions.Images
      });
      if (r.canceled) return null;
      return { dataUrl: "data:image/jpeg;base64," + r.assets[0].base64 };
    }
  } catch (e) {
    return { error: (e && e.message) || "Could not get image." };
  }
}

// show a source chooser (native) / open the file picker (web), then call onImage(dataUrl)
export function pickImage(onImage, onError) {
  if (IS_WEB) { pickImageWeb(onImage, onError); return; }
  Alert.alert("Add Photo", "Choose a source", [
    { text: "📷 Camera", onPress: async () => handle(true, onImage, onError) },
    { text: "🖼️ Gallery", onPress: async () => handle(false, onImage, onError) },
    { text: "Cancel", style: "cancel" }
  ]);
}

async function handle(fromCamera, onImage, onError) {
  const res = await grabImage(fromCamera);
  if (!res) return; // cancelled
  if (res.error) { if (onError) onError(res.error); return; }
  onImage(res.dataUrl);
}
