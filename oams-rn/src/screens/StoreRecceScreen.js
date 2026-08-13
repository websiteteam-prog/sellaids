import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import { C } from "../theme";
import { AppBar, Btn, SectionLabel, Popup } from "../ui";
import ElementEntryModal from "../components/ElementEntryModal";
import { pickImage } from "../imagePicker";
import { submitRecce } from "../api";
import { exportReport } from "../reportClient";
import { DATA } from "../data";

export default function StoreRecceScreen({ nav, app }) {
  const flow = app.flow;
  const store = flow.store || {};
  const MIN = DATA.minStorePhotos || 5;

  const [storeImages, setStoreImages] = useState([]);
  const [storeRemark, setStoreRemark] = useState("");
  const [elements, setElements] = useState([]);
  const [finalRemark, setFinalRemark] = useState("");

  const [elemModal, setElemModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saved, setSaved] = useState({ visible: false, offline: false });

  function addStoreImage() {
    pickImage((dataUrl) => setStoreImages((prev) => [...prev, dataUrl]), (e) => app.toast("Photo", e));
  }
  function removeStoreImage(idx) {
    setStoreImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function openElement(index) { setEditIndex(index); setElemModal(true); }
  function onElementSave(item) {
    const next = elements.slice();
    if (editIndex != null) next[editIndex] = item; else next.push(item);
    setElements(next);
    setElemModal(false);
  }
  function deleteElement(index) {
    app.confirm("Delete Element", "Remove this element?", () => {
      setElements((prev) => prev.filter((_, i) => i !== index));
    });
  }

  function currentWork() {
    return { storeImages, storeRemark: storeRemark.trim(), elements, finalRemark: finalRemark.trim() };
  }

  async function submit() {
    if (storeImages.length < MIN) { app.toast("Store Photos", "Please upload at least " + MIN + " store photos (" + storeImages.length + "/" + MIN + ")."); return; }
    if (!storeRemark.trim()) { app.toast("Remark", "Please add a remark for the store photos."); return; }
    if (elements.length === 0) { app.toast("Elements", "Add at least one element."); return; }
    const work = currentWork();
    app.setFlow({ work });
    app.spinner(true, "Submitting…");
    const res = await submitRecce(store, work);
    app.spinner(false);
    setSaved({ visible: true, offline: !!(res && res.offline) });
  }

  function downloadPpt() {
    setSaved({ visible: false, offline: false });
    exportReport(store, currentWork(), app);
    nav.popTo("stores");
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar title="Store Recce" onBack={() => nav.pop()} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={st.head}>
          <Text style={{ color: C.navy, fontWeight: "700", fontSize: 15 }}>{store.storeName}</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{store.storeCode} · {store.category} · {store.city}</Text>
        </View>

        {/* STORE IMAGES */}
        <SectionLabel>Store Photos — different angles (min {MIN})</SectionLabel>
        <View style={st.imgWrap}>
          {storeImages.map((uri, i) => (
            <View key={i} style={st.thumbBox}>
              <Image source={{ uri }} style={st.thumb} />
              <TouchableOpacity style={st.thumbDel} onPress={() => removeStoreImage(i)}><Text style={st.thumbDelTxt}>✕</Text></TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={st.addThumb} onPress={addStoreImage} activeOpacity={0.8}>
            <Text style={{ fontSize: 26, color: C.muted }}>＋</Text>
            <Text style={{ fontSize: 10, color: C.muted }}>Add</Text>
          </TouchableOpacity>
        </View>
        <Text style={[st.counter, storeImages.length >= MIN && { color: C.success }]}>
          {storeImages.length}/{MIN} {storeImages.length >= MIN ? "✓" : "photos"}
        </Text>

        <Text style={st.lbl}>Remark for store photos (required)</Text>
        <TextInput style={[st.input, { height: 64, textAlignVertical: "top" }]} value={storeRemark} onChangeText={setStoreRemark}
          placeholder="e.g. facade condition, footfall side, obstructions…" placeholderTextColor="#aab2c0" multiline />

        {/* ELEMENTS */}
        <SectionLabel>Elements</SectionLabel>
        {elements.length === 0 ? (
          <View style={st.emptyBox}><Text style={{ color: C.muted }}>No element added yet</Text></View>
        ) : (
          elements.map((el, idx) => (
            <View key={idx} style={st.elCard}>
              <View style={{ flex: 1 }}>
                <Text style={st.elTitle}>{el.type}</Text>
                <Text style={st.elMeta}>on {el.surface} · W {el.width}" × H {el.height}" = {el.total}"</Text>
                <Text style={st.elMeta}>📷 {el.imagesWithoutMark.length} without + {el.imagesWithMark.length} with mark</Text>
                {el.remark ? <Text style={st.elRemark}>“{el.remark}”</Text> : null}
              </View>
              <View>
                <TouchableOpacity style={st.mini} onPress={() => openElement(idx)}><Text>✏️</Text></TouchableOpacity>
                <TouchableOpacity style={[st.mini, { marginTop: 6 }]} onPress={() => deleteElement(idx)}><Text style={{ color: C.danger }}>✕</Text></TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <Btn title="＋ Add Element" onPress={() => openElement(null)} />

        {/* FINAL REMARK */}
        <Text style={[st.lbl, { marginTop: 16 }]}>Final remark (optional)</Text>
        <TextInput style={[st.input, { height: 64, textAlignVertical: "top" }]} value={finalRemark} onChangeText={setFinalRemark}
          placeholder="Overall note for this store visit" placeholderTextColor="#aab2c0" multiline />
      </ScrollView>

      <View style={st.bottom}>
        <Btn title="Submit & Generate PPT" kind="success" onPress={submit} />
      </View>

      <ElementEntryModal
        visible={elemModal}
        initial={editIndex != null ? elements[editIndex] : null}
        master={app.master}
        onCancel={() => setElemModal(false)}
        onSave={onElementSave}
        onError={(m) => app.toast("Element", m)}
      />

      <Popup
        visible={saved.visible}
        title="Recce Saved ✅"
        buttons={[
          { title: "Download PPT", kind: "outline", onPress: downloadPpt },
          { title: "OK", kind: "primary", onPress: () => { setSaved({ visible: false, offline: false }); nav.popTo("stores"); } }
        ]}
      >
        <Text style={{ color: C.text }}>
          Recce submitted for <Text style={{ fontWeight: "700" }}>{store.storeName}</Text> — {storeImages.length} store photos, {elements.length} element(s).
        </Text>
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
          {saved.offline ? "Saved on the device." : "Saved to the server."}
        </Text>
      </Popup>
    </View>
  );
}

const st = StyleSheet.create({
  head: { backgroundColor: C.card, borderRadius: 14, padding: 12, marginBottom: 14 },
  imgWrap: { flexDirection: "row", flexWrap: "wrap" },
  thumbBox: { width: 84, height: 84, marginRight: 8, marginBottom: 8, borderRadius: 10, overflow: "hidden", position: "relative" },
  thumb: { width: "100%", height: "100%", borderRadius: 10 },
  thumbDel: { position: "absolute", top: 2, right: 2, backgroundColor: "rgba(214,69,69,0.9)", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  thumbDelTxt: { color: "#fff", fontSize: 12 },
  addThumb: { width: 84, height: 84, borderRadius: 10, borderWidth: 2, borderColor: C.line, borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "#fafbfd" },
  counter: { fontSize: 13, color: C.muted, marginTop: 2, marginBottom: 8, fontWeight: "600" },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 6 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text },
  emptyBox: { backgroundColor: C.card, borderRadius: 12, padding: 20, alignItems: "center", marginBottom: 10 },
  elCard: { backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: "row" },
  elTitle: { fontWeight: "700", color: C.navy, marginBottom: 3, fontSize: 15 },
  elMeta: { fontSize: 12, color: C.muted, marginTop: 1 },
  elRemark: { fontSize: 12, color: C.text, fontStyle: "italic", marginTop: 4 },
  mini: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  bottom: { padding: 14, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line }
});
