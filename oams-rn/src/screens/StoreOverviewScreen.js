import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { C } from "../theme";
import { AppBar, Btn, SectionLabel, Popup } from "../ui";
import ItemEntryModal from "../components/ItemEntryModal";
import { submitRecce } from "../api";
import { exportReport } from "../reportClient";

function coordsToAddress(c) {
  if (!c) return "Location unavailable";
  return "Lat " + c.lat.toFixed(6) + ", Lng " + c.lng.toFixed(6) + (c.acc ? " (±" + Math.round(c.acc) + "m)" : "");
}

export default function StoreOverviewScreen({ nav, app }) {
  const flow = app.flow;
  const t = flow.ticket || {};
  const baseWork = flow.work || { coords: null };

  const [photo, setPhoto] = useState(null);
  const [photoTime, setPhotoTime] = useState("");
  const [address, setAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState([]);

  const [itemModal, setItemModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saved, setSaved] = useState({ visible: false, offline: false });

  async function capture() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { app.toast("Camera", "Camera permission is needed to capture a store photo."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6, base64: true, allowsEditing: false });
    if (res.canceled) return;
    const a = res.assets && res.assets[0];
    if (!a || !a.base64) { app.toast("Camera", "Could not read the photo."); return; }
    const dataUrl = "data:image/jpeg;base64," + a.base64;
    const addr = address || coordsToAddress(baseWork.coords);
    setPhoto(dataUrl);
    setAddress(addr);
    setPhotoTime(new Date().toLocaleString());
  }

  function openItem(index) { setEditIndex(index); setItemModal(true); }

  function onItemSave(item, err) {
    if (!item) { app.toast("Item", err || "Please fill the item."); return; }
    const next = items.slice();
    if (editIndex != null) next[editIndex] = item; else next.push(item);
    setItems(next);
    setItemModal(false);
  }

  function deleteItem(index) {
    app.confirm("Delete Item", "Remove this item?", () => {
      const next = items.slice(); next.splice(index, 1); setItems(next);
    });
  }

  function currentWork() {
    return { photo, photoAddress: address, storeRemarks: remarks, coords: baseWork.coords, items };
  }

  async function finalSave() {
    if (!items.length && !photo) { app.toast("Save", "Add at least a store photo or one item before saving."); return; }
    const work = currentWork();
    app.setFlow({ work });
    app.spinner(true, "Submitting…");
    const res = await submitRecce(flow.module, t.ticketNo, work);
    app.spinner(false);
    setSaved({ visible: true, offline: !!(res && res.offline) });
  }

  function downloadPpt() {
    setSaved({ visible: false, offline: false });
    exportReport(flow.module, [{ ticket: t, work: currentWork() }], app);
    nav.popTo("list");
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar title="Store Overview" onBack={() => nav.pop()} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={st.storeHead}>
          <Text style={{ color: C.navy, fontWeight: "700" }}>{t.storeName}</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{t.storeCode} · {t.ticketNo}</Text>
        </View>

        <View style={st.block}>
          <SectionLabel>Store Photo (geo-tagged)</SectionLabel>
          {photo ? (
            <View style={{ marginBottom: 10 }}>
              <Image source={{ uri: photo }} style={st.photo} resizeMode="cover" />
              <View style={st.caption}>
                <Text style={st.captionTxt}>{address}</Text>
                <Text style={st.captionTxt}>{photoTime}</Text>
              </View>
            </View>
          ) : (
            <View style={st.photoEmpty}><Text style={{ color: C.muted }}>No photo captured yet</Text></View>
          )}
          <Btn title="📷 Capture Store Photo" kind="outline" onPress={capture} />

          <Text style={st.lbl}>Photo Address (auto, editable)</Text>
          <TextInput style={st.input} value={address} onChangeText={setAddress} placeholder="Address stamps here after capture" placeholderTextColor="#aab2c0" />

          <Text style={st.lbl}>Remarks</Text>
          <TextInput style={st.input} value={remarks} onChangeText={setRemarks} placeholder="Add a note for the store/photo" placeholderTextColor="#aab2c0" />
        </View>

        <SectionLabel>Items</SectionLabel>
        {items.length === 0 ? (
          <View style={st.emptyItems}><Text style={{ color: C.muted }}>No Item Added</Text></View>
        ) : (
          items.map((it, idx) => (
            <View key={idx} style={st.itemCard}>
              <View style={{ flex: 1 }}>
                <Text style={st.itemTitle}>{it.material}</Text>
                <Text style={st.itemMeta}>{it.location} · {it.locType}/{it.category}</Text>
                <Text style={st.itemMeta}>W {it.width}" × H {it.height}" = {it.total}"{it.scaffold ? " · Scaf " + it.scaffold + "sqft" : ""}</Text>
              </View>
              <View>
                <TouchableOpacity style={st.mini} onPress={() => openItem(idx)}><Text>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={[st.mini, { marginTop: 6 }]} onPress={() => deleteItem(idx)}><Text style={{ color: C.danger }}>✕</Text></TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <Btn title="＋ Add Item" onPress={() => openItem(null)} />
      </ScrollView>

      <View style={st.bottom}>
        <Btn title="Final Save / Submit" kind="success" onPress={finalSave} />
      </View>

      <ItemEntryModal
        visible={itemModal}
        initial={editIndex != null ? items[editIndex] : null}
        master={app.master}
        onCancel={() => setItemModal(false)}
        onSave={onItemSave}
      />

      <Popup
        visible={saved.visible}
        title="Recce Saved ✅"
        buttons={[
          { title: "Download PPT", kind: "outline", onPress: downloadPpt },
          { title: "OK", kind: "primary", onPress: () => { setSaved({ visible: false, offline: false }); nav.popTo("list"); } }
        ]}
      >
        <Text style={{ color: C.text }}>
          Data + photo submitted for <Text style={{ fontWeight: "700" }}>{t.ticketNo}</Text>.
        </Text>
        {saved.offline ? (
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Saved on the device — will sync when a backend is connected.</Text>
        ) : (
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Saved to the server database.</Text>
        )}
      </Popup>
    </View>
  );
}

const st = StyleSheet.create({
  storeHead: { backgroundColor: C.card, borderRadius: 14, padding: 12, marginBottom: 14 },
  block: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 16 },
  photo: { width: "100%", height: 220, borderRadius: 10 },
  caption: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,22,45,0.6)", padding: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  captionTxt: { color: "#fff", fontSize: 11 },
  photoEmpty: { borderWidth: 2, borderColor: C.line, borderStyle: "dashed", borderRadius: 10, padding: 30, alignItems: "center", marginBottom: 10 },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 8 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text },
  emptyItems: { backgroundColor: C.card, borderRadius: 12, padding: 20, alignItems: "center", marginBottom: 10 },
  itemCard: { backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: "row" },
  itemTitle: { fontWeight: "700", color: C.navy, marginBottom: 3 },
  itemMeta: { fontSize: 12, color: C.muted },
  mini: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  bottom: { padding: 14, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line }
});
