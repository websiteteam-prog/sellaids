import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import { C } from "../theme";
import { AppBar, Btn, SectionLabel, Popup } from "../ui";
import ElementEntryModal from "../components/ElementEntryModal";
import { pickImage } from "../imagePicker";
import { submitRecce } from "../api";

export default function StoreRecceScreen({ nav, app }) {
  const flow = app.flow;
  const store = flow.store || {};
  const user = app.session || {};

  const [storeImages, setStoreImages] = useState([]);
  const [storeRemark, setStoreRemark] = useState("");
  // Pre-load the planned elements the admin assigned to this store (from the Excel import).
  const [elements, setElements] = useState(() =>
    (store.elements || []).map((e) => {
      const w = Number(e.width || 0), h = Number(e.height || 0), qv = Number(e.qty || 1) || 1;
      return {
        type: e.element, width: w, height: h, qty: qv,
        total: (w * h).toFixed(2),
        sqft: e.sqft || +(((w * h * qv) / 144).toFixed(2)),
        note: e.remarks || "", photos: [], remark: "", planned: true
      };
    })
  );
  const [finalRemark, setFinalRemark] = useState("");

  const [elemModal, setElemModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [done, setDone] = useState({ visible: false, offline: false });

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

  async function submit() {
    if (storeImages.length < 1) { app.toast("Store Photos", "Please add store photos from different angles."); return; }
    if (!storeRemark.trim()) { app.toast("Remark", "Please add a remark for the store photos."); return; }
    if (elements.length === 0) { app.toast("Elements", "Add at least one element."); return; }
    const incomplete = elements.filter((e) => !(e.photos && e.photos.length >= 1 && e.remark && e.remark.trim()));
    if (incomplete.length) {
      app.toast("Elements incomplete", "Add at least one photo and a remark for: " + incomplete.map((e) => e.type).join(", "));
      return;
    }
    const work = { storeImages, storeRemark: storeRemark.trim(), elements, finalRemark: finalRemark.trim() };
    app.spinner(true, "Submitting…");
    const res = await submitRecce(store, work, user);
    app.spinner(false);
    if (res && res.ok === false && !res.offline) {
      app.toast("Submit failed", "Could not reach the server. Check the backend / connection and try again.");
      return;
    }
    setDone({ visible: true, offline: !!(res && res.offline) });
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
        <SectionLabel>Store Photos — different angles</SectionLabel>
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
        {storeImages.length > 0 ? <Text style={st.count}>{storeImages.length} photo(s) added</Text> : null}

        <Text style={st.lbl}>Remark for store photos (required)</Text>
        <TextInput style={[st.input, { height: 64, textAlignVertical: "top" }]} value={storeRemark} onChangeText={setStoreRemark}
          placeholder="e.g. facade condition, footfall side, obstructions…" placeholderTextColor="#aab2c0" multiline />

        {/* ELEMENTS */}
        <SectionLabel>Elements {elements.length ? "(" + elements.filter((e) => e.photos.length >= 1 && e.remark).length + "/" + elements.length + " done)" : ""}</SectionLabel>
        {elements.length > 0 ? (
          <Text style={st.hint}>Tap each element to add its photo(s) and a remark.</Text>
        ) : null}
        {elements.length === 0 ? (
          <View style={st.emptyBox}><Text style={{ color: C.muted }}>No element added yet</Text></View>
        ) : (
          elements.map((el, idx) => {
            const done = el.photos.length >= 1 && !!el.remark;
            return (
              <TouchableOpacity key={idx} style={[st.elCard, done ? st.elCardDone : st.elCardPending]} onPress={() => openElement(idx)} activeOpacity={0.85}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                    <Text style={st.elTitle}>{el.type}</Text>
                    <View style={[st.badge, done ? st.badgeDone : st.badgePending]}>
                      <Text style={[st.badgeTxt, { color: done ? "#0f7a3d" : "#9a6a00" }]}>{done ? "✓ Done" : "Pending"}</Text>
                    </View>
                  </View>
                  <Text style={st.elMeta}>W {el.width}" × H {el.height}" · Qty {el.qty} · {el.sqft} sqft</Text>
                  <Text style={st.elMeta}>📷 {el.photos.length} photo(s)</Text>
                  {el.note ? <Text style={st.elNote}>📋 {el.note}</Text> : null}
                  {el.remark ? <Text style={st.elRemark}>“{el.remark}”</Text> : null}
                </View>
                <View>
                  <TouchableOpacity style={st.mini} onPress={() => openElement(idx)}><Text>✏️</Text></TouchableOpacity>
                  <TouchableOpacity style={[st.mini, { marginTop: 6 }]} onPress={() => deleteElement(idx)}><Text style={{ color: C.danger }}>✕</Text></TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <Btn title="＋ Add Element" kind="outline" onPress={() => openElement(null)} />

        {/* FINAL REMARK */}
        <Text style={[st.lbl, { marginTop: 16 }]}>Final remark (optional)</Text>
        <TextInput style={[st.input, { height: 64, textAlignVertical: "top" }]} value={finalRemark} onChangeText={setFinalRemark}
          placeholder="Overall note for this store visit" placeholderTextColor="#aab2c0" multiline />
      </ScrollView>

      <View style={st.bottom}>
        <Btn title="Submit" kind="success" onPress={submit} />
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
        visible={done.visible}
        title="Recce Submitted ✅"
        buttons={[{ title: "OK", kind: "primary", onPress: () => { setDone({ visible: false, offline: false }); nav.popTo("stores"); } }]}
      >
        <Text style={{ color: C.text }}>
          Recce submitted for <Text style={{ fontWeight: "700" }}>{store.storeName}</Text>.
        </Text>
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
          {done.offline
            ? "Saved on the device (no backend connected). Connect a backend so the admin panel + PPT get it."
            : "The report (PPT) is generated on the admin panel. This store is now removed from your list."}
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
  count: { fontSize: 13, color: C.muted, marginTop: 2, marginBottom: 8, fontWeight: "600" },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 6 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text },
  hint: { fontSize: 12, color: C.muted, marginBottom: 8, marginTop: -2 },
  emptyBox: { backgroundColor: C.card, borderRadius: 12, padding: 20, alignItems: "center", marginBottom: 10 },
  elCard: { backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: "row", borderLeftWidth: 4 },
  elCardDone: { borderLeftColor: C.success },
  elCardPending: { borderLeftColor: "#e0a500" },
  elTitle: { fontWeight: "700", color: C.navy, fontSize: 15 },
  badge: { marginLeft: 8, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 1 },
  badgeDone: { backgroundColor: "#d7f2e1" },
  badgePending: { backgroundColor: "#fdefc9" },
  badgeTxt: { fontSize: 11, fontWeight: "700" },
  elMeta: { fontSize: 12, color: C.muted, marginTop: 1 },
  elNote: { fontSize: 12, color: C.navy, marginTop: 3 },
  elRemark: { fontSize: 12, color: C.text, fontStyle: "italic", marginTop: 4 },
  mini: { width: 34, height: 34, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  bottom: { padding: 14, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line }
});
