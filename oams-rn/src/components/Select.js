import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from "react-native";
import { C } from "../theme";

export default function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={st.label}>{label}</Text> : null}
      <TouchableOpacity style={st.box} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={st.value}>{value || "Select…"}</Text>
        <Text style={st.caret}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={st.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={st.sheet}>
            {label ? <Text style={st.sheetTitle}>{label}</Text> : null}
            <ScrollView style={{ maxHeight: 340 }}>
              {(options || []).map((opt) => (
                <TouchableOpacity key={opt} style={st.opt} onPress={() => { onChange(opt); setOpen(false); }}>
                  <Text style={[st.optTxt, opt === value && { color: C.navy, fontWeight: "700" }]}>{opt}</Text>
                  {opt === value ? <Text style={{ color: C.navy }}>✓</Text> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  label: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600" },
  box: {
    borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", alignItems: "center"
  },
  value: { color: C.text, fontSize: 15 },
  caret: { color: C.muted },
  overlay: { flex: 1, backgroundColor: "rgba(15,22,45,0.5)", justifyContent: "center", padding: 24 },
  sheet: { backgroundColor: "#fff", borderRadius: 14, padding: 14 },
  sheetTitle: { fontSize: 15, fontWeight: "700", color: C.navy, marginBottom: 8 },
  opt: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  optTxt: { fontSize: 15, color: C.text }
});
