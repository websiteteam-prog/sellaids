import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, StyleSheet, Platform } from "react-native";
import { C } from "../theme";
import { Btn } from "../ui";
import Select from "./Select";
import { DATA } from "../data";
import { pickImage } from "../imagePicker";
import { markImageWeb } from "../markImage";
import MarkImageModal from "./MarkImageModal";

const IS_WEB = Platform.OS === "web";
const EMPTY_MARK = { visible: false, image: null, onDone: null };

export default function ElementEntryModal({ visible, initial, master, onCancel, onSave, onError }) {
  const types = (master && master.elementTypes) || DATA.elementTypes;

  const [type, setType] = useState(types[0]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [qty, setQty] = useState("1");
  const [photoWithout, setPhotoWithout] = useState(null);   // 1 photo, no marking
  const [photosWith, setPhotosWith] = useState([]);          // up to 2 marked photos
  const [remark, setRemark] = useState("");
  const [note, setNote] = useState("");
  const [marker, setMarker] = useState(EMPTY_MARK);

  useEffect(() => {
    if (!visible) return;
    const it = initial || null;
    setType(it ? it.type : types[0]);
    setWidth(it ? String(it.width) : "");
    setHeight(it ? String(it.height) : "");
    setQty(it && it.qty ? String(it.qty) : "1");
    setRemark(it && it.remark ? it.remark : "");
    setNote(it && it.note ? it.note : "");
    // migrate from either the new fields or the old combined `photos` array
    if (it && (it.photoWithout != null || it.photosWith)) {
      setPhotoWithout(it.photoWithout || null);
      setPhotosWith((it.photosWith || []).slice(0, 2));
    } else if (it && it.photos && it.photos.length) {
      setPhotoWithout(it.photos[0] || null);
      setPhotosWith(it.photos.slice(1, 3));
    } else {
      setPhotoWithout(null); setPhotosWith([]);
    }
    setMarker(EMPTY_MARK);
  }, [visible]);

  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const q = parseInt(qty, 10) || 0;
  const total = w * h ? (w * h).toFixed(2) : "0";

  // open the marking editor on a picked image, call cb(markedDataUrl)
  function openMarker(dataUrl, cb) {
    if (IS_WEB) markImageWeb(dataUrl, cb, () => {});
    else setMarker({ visible: true, image: dataUrl, onDone: (m) => { setMarker(EMPTY_MARK); cb(m); } });
  }

  function addWithout() {
    pickImage((d) => openMarker(d, (marked) => setPhotoWithout(marked)), onError);
  }
  function reMarkWithout() {
    if (photoWithout) openMarker(photoWithout, (marked) => setPhotoWithout(marked));
  }
  function addWithMark() {
    if (photosWith.length >= 2) return;
    pickImage((d) => setPhotosWith((prev) => [...prev, d].slice(0, 2)), onError);
  }
  function removeWith(i) {
    setPhotosWith((prev) => prev.filter((_, idx) => idx !== i));
  }

  function save() {
    if (!w || !h) { onError && onError("Please enter Width and Height."); return; }
    if (!q) { onError && onError("Please enter Quantity (Qty)."); return; }
    if (!photoWithout) { onError && onError("Add the WITHOUT-marking photo."); return; }
    if (!remark.trim()) { onError && onError("Remark is required for this element."); return; }
    const photos = [photoWithout].concat(photosWith).filter(Boolean);
    onSave({ type, width: w, height: h, qty: q, total, photoWithout, photosWith, photos, remark: remark.trim(), note, planned: !!(initial && initial.planned) });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={st.overlay}>
        <View style={st.popup}>
          <Text style={st.title}>Add Element</Text>
          <ScrollView style={{ maxHeight: 520 }} keyboardShouldPersistTaps="handled">
            <Select label="Element (What is it?)" value={type} options={types} onChange={setType} />

            {note ? (
              <View style={st.noteBox}><Text style={st.noteTxt}>📋 Planned: {note}</Text></View>
            ) : null}

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ width: "31%" }}>
                <Text style={st.lbl}>Width (Inch)</Text>
                <TextInput style={st.input} value={width} onChangeText={setWidth} keyboardType="numeric" placeholder="0" placeholderTextColor="#aab2c0" />
              </View>
              <View style={{ width: "31%" }}>
                <Text style={st.lbl}>Height (Inch)</Text>
                <TextInput style={st.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="0" placeholderTextColor="#aab2c0" />
              </View>
              <View style={{ width: "31%" }}>
                <Text style={st.lbl}>Qty</Text>
                <TextInput style={st.input} value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="1" placeholderTextColor="#aab2c0" />
              </View>
            </View>
            <Text style={st.lbl}>Total (Inch) — auto</Text>
            <TextInput style={[st.input, { backgroundColor: "#f3f4f6", color: C.muted }]} value={total} editable={false} />

            {/* WITHOUT MARKING — this photo can be drawn/marked */}
            <Text style={st.section}>Photo — WITHOUT marking (1)</Text>
            <Text style={st.hintTxt}>Tap “Mark” to draw on the photo (pencil / box) where the work is.</Text>
            <View style={st.imgWrap}>
              {photoWithout ? (
                <View style={st.thumbBox}>
                  <Image source={{ uri: photoWithout }} style={st.thumb} />
                  <TouchableOpacity style={st.thumbEdit} onPress={reMarkWithout}><Text style={st.thumbEditTxt}>✏️ Mark</Text></TouchableOpacity>
                  <TouchableOpacity style={st.thumbDel} onPress={() => setPhotoWithout(null)}><Text style={st.thumbDelTxt}>✕</Text></TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={st.addThumb} onPress={addWithout} activeOpacity={0.8}>
                  <Text style={{ fontSize: 22, color: C.muted }}>✏️＋</Text>
                  <Text style={{ fontSize: 10, color: C.muted }}>Add + Mark</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* WITH MARKING — plain photos (no drawing) */}
            <Text style={st.section}>Photos — WITH marking (up to 2)</Text>
            <View style={st.imgWrap}>
              {photosWith.map((uri, i) => (
                <View key={i} style={st.thumbBox}>
                  <Image source={{ uri }} style={st.thumb} />
                  <TouchableOpacity style={st.thumbDel} onPress={() => removeWith(i)}><Text style={st.thumbDelTxt}>✕</Text></TouchableOpacity>
                </View>
              ))}
              {photosWith.length < 2 ? (
                <TouchableOpacity style={st.addThumb} onPress={addWithMark} activeOpacity={0.8}>
                  <Text style={{ fontSize: 26, color: C.muted }}>＋</Text>
                  <Text style={{ fontSize: 10, color: C.muted }}>Add</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Text style={st.lbl}>Remark (required)</Text>
            <TextInput style={[st.input, { height: 70, textAlignVertical: "top" }]} value={remark} onChangeText={setRemark}
              placeholder="Remark for this element" placeholderTextColor="#aab2c0" multiline />
          </ScrollView>

          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Btn title="Cancel" kind="outline" onPress={onCancel} style={{ flex: 1, marginTop: 0 }} />
            <Btn title="Save Element" onPress={save} style={{ flex: 1, marginTop: 0, marginLeft: 8 }} />
          </View>
        </View>
      </View>

      <MarkImageModal visible={marker.visible} image={marker.image} onDone={marker.onDone || (() => {})} onCancel={() => setMarker(EMPTY_MARK)} />
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,22,45,0.5)", justifyContent: "center", padding: 16 },
  popup: { backgroundColor: "#fff", borderRadius: 16, padding: 18, maxHeight: "92%" },
  title: { fontSize: 18, fontWeight: "700", color: C.navy, marginBottom: 12 },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 6 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text, marginBottom: 4 },
  section: { fontSize: 12.5, color: C.navy, fontWeight: "700", marginTop: 14, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  hintTxt: { fontSize: 11.5, color: C.muted, marginBottom: 8 },
  noteBox: { backgroundColor: "#eef4ff", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 2, borderLeftWidth: 3, borderLeftColor: C.navy },
  noteTxt: { color: C.navy, fontSize: 12.5 },
  imgWrap: { flexDirection: "row", flexWrap: "wrap" },
  thumbBox: { width: 84, height: 84, marginRight: 8, marginBottom: 8, borderRadius: 10, overflow: "hidden", position: "relative" },
  thumb: { width: "100%", height: "100%" },
  thumbDel: { position: "absolute", top: 2, right: 2, backgroundColor: "rgba(214,69,69,0.9)", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  thumbDelTxt: { color: "#fff", fontSize: 12 },
  thumbEdit: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(31,56,100,0.85)", paddingVertical: 3, alignItems: "center" },
  thumbEditTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  addThumb: { width: 84, height: 84, borderRadius: 10, borderWidth: 2, borderColor: C.line, borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "#fafbfd" }
});
