import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

// capture from camera or pick from gallery -> returns a jpeg data URL (or null)
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

// show a Camera / Gallery chooser, then call onImage(dataUrl)
export function pickImage(onImage, onError) {
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
