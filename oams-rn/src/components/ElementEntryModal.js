import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from "react-native";
import { C } from "../theme";
import { Btn } from "../ui";
import Select from "./Select";
import { DATA } from "../data";
import { pickImage } from "../imagePicker";

export default function ElementEntryModal({ visible, initial, master, onCancel, onSave, onError }) {
  const types = (master && master.elementTypes) || DATA.elementTypes;

  const [type, setType] = useState(types[0]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [photos, setPhotos] = useState([]);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (!visible) return;
    const it = initial || null;
    setType(it ? it.type : types[0]);
    setWidth(it ? String(it.width) : "");
    setHeight(it ? String(it.height) : "");
    setPhotos(it && it.photos ? it.photos.slice() : []);
    setRemark(it ? it.remark : "");
  }, [visible]);

  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const total = w * h ? (w * h).toFixed(2) : "0";

  function addPhoto() {
    pickImage((d) => setPhotos((prev) => [...prev, d]), onError);
  }
  function removePhoto(i) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }

  function save() {
    if (!w || !h) { onError && onError("Please enter Width and Height."); return; }
    if (photos.length < 1) { onError && onError("Add at least one photo of the element."); return; }
    if (!remark.trim()) { onError && onError("Remark is required for this element."); return; }
    onSave({ type, width: w, height: h, total, photos, remark: remark.trim() });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={st.overlay}>
        <View style={st.popup}>
          <Text style={st.title}>Add Element</Text>
          <ScrollView style={{ maxHeight: 500 }} keyboardShouldPersistTaps="handled">
            <Select label="What is it?" value={type} options={types} onChange={setType} />

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

            <Text style={st.section}>Element Photos</Text>
            <View style={st.imgWrap}>
              {photos.map((uri, i) => (
                <View key={i} style={st.thumbBox}>
                  <Image source={{ uri }} style={st.thumb} />
                  <TouchableOpacity style={st.thumbDel} onPress={() => removePhoto(i)}><Text style={st.thumbDelTxt}>✕</Text></TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={st.addThumb} onPress={addPhoto} activeOpacity={0.8}>
                <Text style={{ fontSize: 26, color: C.muted }}>＋</Text>
                <Text style={{ fontSize: 10, color: C.muted }}>Add</Text>
              </TouchableOpacity>
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
  imgWrap: { flexDirection: "row", flexWrap: "wrap" },
  thumbBox: { width: 80, height: 80, marginRight: 8, marginBottom: 8, borderRadius: 10, overflow: "hidden", position: "relative" },
  thumb: { width: "100%", height: "100%" },
  thumbDel: { position: "absolute", top: 2, right: 2, backgroundColor: "rgba(214,69,69,0.9)", width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  thumbDelTxt: { color: "#fff", fontSize: 12 },
  addThumb: { width: 80, height: 80, borderRadius: 10, borderWidth: 2, borderColor: C.line, borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "#fafbfd" }
});
