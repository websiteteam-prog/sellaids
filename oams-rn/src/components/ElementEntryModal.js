import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from "react-native";
import { C } from "../theme";
import { Btn } from "../ui";
import Select from "./Select";
import { DATA } from "../data";
import { pickImage } from "../imagePicker";

// one tappable photo slot
function PhotoSlot({ uri, label, onPick, onClear }) {
  return (
    <View style={st.slotWrap}>
      <TouchableOpacity style={st.slot} onPress={onPick} activeOpacity={0.8}>
        {uri ? <Image source={{ uri }} style={st.slotImg} /> : <Text style={st.slotPlus}>＋</Text>}
      </TouchableOpacity>
      <Text style={st.slotLabel}>{label}</Text>
      {uri ? <TouchableOpacity onPress={onClear}><Text style={st.slotClear}>✕ remove</Text></TouchableOpacity> : null}
    </View>
  );
}

export default function ElementEntryModal({ visible, initial, master, onCancel, onSave, onError }) {
  const types = (master && master.elementTypes) || DATA.elementTypes;
  const surfaces = (master && master.surfaces) || DATA.surfaces;

  const [type, setType] = useState(types[0]);
  const [surface, setSurface] = useState(surfaces[0]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [without, setWithout] = useState([null, null]); // 2 without-mark
  const [withMark, setWithMark] = useState([null, null]); // 2 with-mark
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (!visible) return;
    const it = initial || null;
    setType(it ? it.type : types[0]);
    setSurface(it ? it.surface : surfaces[0]);
    setWidth(it ? String(it.width) : "");
    setHeight(it ? String(it.height) : "");
    setWithout(it && it.imagesWithoutMark ? [it.imagesWithoutMark[0] || null, it.imagesWithoutMark[1] || null] : [null, null]);
    setWithMark(it && it.imagesWithMark ? [it.imagesWithMark[0] || null, it.imagesWithMark[1] || null] : [null, null]);
    setRemark(it ? it.remark : "");
  }, [visible]);

  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const total = w * h ? (w * h).toFixed(2) : "0";

  function setSlot(arr, setArr, idx, val) {
    const next = arr.slice(); next[idx] = val; setArr(next);
  }

  function save() {
    if (!w || !h) { onError && onError("Please enter Width and Height."); return; }
    const wo = without.filter(Boolean);
    const wm = withMark.filter(Boolean);
    if (wo.length < 2) { onError && onError("Add 2 photos WITHOUT mark."); return; }
    if (wm.length < 2) { onError && onError("Add 2 photos WITH mark."); return; }
    if (!remark.trim()) { onError && onError("Remark is required for this element."); return; }
    onSave({
      type, surface, width: w, height: h, total,
      imagesWithoutMark: wo, imagesWithMark: wm, remark: remark.trim()
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={st.overlay}>
        <View style={st.popup}>
          <Text style={st.title}>Add Element</Text>
          <ScrollView style={{ maxHeight: 520 }} keyboardShouldPersistTaps="handled">
            <Select label="What is it?" value={type} options={types} onChange={setType} />
            <Select label="Where to install it (surface)" value={surface} options={surfaces} onChange={setSurface} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ width: "48%" }}>
                <Text style={st.lbl}>Width (Inch)</Text>
                <TextInput style={st.input} value={width} onChangeText={setWidth} keyboardType="numeric" placeholder="0" placeholderTextColor="#aab2c0" />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={st.lbl}>Height (Inch)</Text>
                <TextInput style={st.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="0" placeholderTextColor="#aab2c0" />
              </View>
            </View>
            <Text style={st.lbl}>Total (Inch) — auto</Text>
            <TextInput style={[st.input, { backgroundColor: "#f3f4f6", color: C.muted }]} value={total} editable={false} />

            <Text style={st.section}>Photos WITHOUT mark (2)</Text>
            <View style={st.slotRow}>
              {[0, 1].map((i) => (
                <PhotoSlot key={i} uri={without[i]} label={"Without " + (i + 1)}
                  onPick={() => pickImage((d) => setSlot(without, setWithout, i, d), onError)}
                  onClear={() => setSlot(without, setWithout, i, null)} />
              ))}
            </View>

            <Text style={st.section}>Photos WITH mark (2)</Text>
            <View style={st.slotRow}>
              {[0, 1].map((i) => (
                <PhotoSlot key={i} uri={withMark[i]} label={"With mark " + (i + 1)}
                  onPick={() => pickImage((d) => setSlot(withMark, setWithMark, i, d), onError)}
                  onClear={() => setSlot(withMark, setWithMark, i, null)} />
              ))}
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
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,22,45,0.5)", justifyContent: "center", padding: 16 },
  popup: { backgroundColor: "#fff", borderRadius: 16, padding: 18, maxHeight: "92%" },
  title: { fontSize: 18, fontWeight: "700", color: C.navy, marginBottom: 12 },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 6 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text, marginBottom: 4 },
  section: { fontSize: 12.5, color: C.navy, fontWeight: "700", marginTop: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  slotRow: { flexDirection: "row", justifyContent: "flex-start" },
  slotWrap: { alignItems: "center", marginRight: 14 },
  slot: { width: 84, height: 84, borderRadius: 10, borderWidth: 2, borderColor: C.line, borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "#fafbfd", overflow: "hidden" },
  slotImg: { width: "100%", height: "100%" },
  slotPlus: { fontSize: 28, color: C.muted },
  slotLabel: { fontSize: 11, color: C.muted, marginTop: 4 },
  slotClear: { fontSize: 11, color: C.danger, marginTop: 2 }
});
