import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet } from "react-native";
import { C } from "../theme";
import { Btn } from "../ui";
import Select from "./Select";
import { DATA } from "../data";

function Tabs({ options, value, onChange }) {
  return (
    <View style={st.tabs}>
      {options.map((o) => (
        <TouchableOpacity key={o} style={[st.tab, o === value && st.tabOn]} onPress={() => onChange(o)}>
          <Text style={[st.tabTxt, o === value && st.tabTxtOn]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ItemEntryModal({ visible, initial, master, onCancel, onSave }) {
  const mats = (master && master.materials) || DATA.materials;
  const locs = (master && master.locations) || DATA.locations;

  const [locType, setLocType] = useState(DATA.locationTypeTabs[0]);
  const [cat, setCat] = useState(DATA.categoryTabs[0]);
  const [location, setLocation] = useState(locs[0]);
  const [material, setMaterial] = useState(mats[0]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [scaffold, setScaffold] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!visible) return;
    const it = initial || null;
    setLocType(it ? it.locType : DATA.locationTypeTabs[0]);
    setCat(it ? it.category : DATA.categoryTabs[0]);
    setLocation(it ? it.location : locs[0]);
    setMaterial(it ? it.material : mats[0]);
    setWidth(it ? String(it.width) : "");
    setHeight(it ? String(it.height) : "");
    setScaffold(it && it.scaffold ? String(it.scaffold) : "");
    setRemarks(it ? it.remarks : "");
  }, [visible]);

  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const total = w * h ? (w * h).toFixed(2) : "0";

  function save() {
    if (!w || !h) { onSave(null, "Please enter Width and Height."); return; }
    onSave({
      locType, category: cat, location, material,
      width: w, height: h, total,
      scaffold: parseFloat(scaffold) || 0, remarks: (remarks || "").trim()
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={st.overlay}>
        <View style={st.popup}>
          <Text style={st.title}>Item Entry</Text>
          <ScrollView style={{ maxHeight: 460 }} keyboardShouldPersistTaps="handled">
            <Tabs options={DATA.locationTypeTabs} value={locType} onChange={setLocType} />
            <Tabs options={DATA.categoryTabs} value={cat} onChange={setCat} />

            <Select label="Location" value={location} options={locs} onChange={setLocation} />
            <Select label="Material Name" value={material} options={mats} onChange={setMaterial} />

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

            <Text style={st.lbl}>Scaffolding (Sq. ft.)</Text>
            <TextInput style={st.input} value={scaffold} onChangeText={setScaffold} keyboardType="numeric" placeholder="0" placeholderTextColor="#aab2c0" />

            <Text style={st.lbl}>Remarks</Text>
            <TextInput style={st.input} value={remarks} onChangeText={setRemarks} placeholder="Notes for this item" placeholderTextColor="#aab2c0" />
          </ScrollView>

          <View style={{ flexDirection: "row", marginTop: 14 }}>
            <Btn title="Cancel" kind="outline" onPress={onCancel} style={{ flex: 1, marginTop: 0 }} />
            <Btn title="Save" onPress={save} style={{ flex: 1, marginTop: 0, marginLeft: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,22,45,0.5)", justifyContent: "center", padding: 18 },
  popup: { backgroundColor: "#fff", borderRadius: 16, padding: 20, maxHeight: "88%" },
  title: { fontSize: 18, fontWeight: "700", color: C.navy, marginBottom: 12 },
  tabs: { flexDirection: "row", marginBottom: 12, flexWrap: "wrap" },
  tab: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: C.line, marginRight: 8, marginBottom: 6 },
  tabOn: { backgroundColor: C.navy, borderColor: C.navy },
  tabTxt: { fontSize: 13, color: C.muted },
  tabTxtOn: { color: "#fff" },
  lbl: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600", marginTop: 4 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, backgroundColor: "#fff", color: C.text, marginBottom: 6 }
});
