import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, ScrollView
} from "react-native";
import { C } from "./theme";

export function AppBar({ title, onBack, right }) {
  return (
    <View style={s.appbar}>
      {onBack ? (
        <TouchableOpacity style={s.iconBtn} onPress={onBack}><Text style={s.iconTxt}>←</Text></TouchableOpacity>
      ) : null}
      <Text style={s.appbarTitle}>{title}</Text>
      {right || null}
    </View>
  );
}

export function IconBtn({ label, onPress }) {
  return (
    <TouchableOpacity style={s.iconBtn} onPress={onPress}><Text style={s.iconTxt}>{label}</Text></TouchableOpacity>
  );
}

export function Btn({ title, onPress, kind = "primary", disabled, style }) {
  const bg = {
    primary: C.navy, outline: C.white, danger: C.danger, success: C.success
  }[kind];
  const color = kind === "outline" ? C.navy : C.white;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        kind === "outline" && { borderWidth: 1.5, borderColor: C.navy },
        style
      ]}
    >
      <Text style={[s.btnTxt, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, editable = true }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.input, editable === false && { backgroundColor: "#f3f4f6", color: C.muted }]}
        value={value == null ? "" : String(value)}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aab2c0"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize="none"
      />
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function SectionLabel({ children }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

export function Spinner({ visible, text }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade">
      <View style={s.spinnerWrap}>
        <ActivityIndicator size="large" color="#fff" />
        {text ? <Text style={s.spinnerTxt}>{text}</Text> : null}
      </View>
    </Modal>
  );
}

// Simple popup with a title, body (nodes), and buttons: [{title,kind,onPress}]
export function Popup({ visible, title, children, buttons, onRequestClose }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={s.overlay}>
        <View style={s.popup}>
          {title ? <Text style={s.popupTitle}>{title}</Text> : null}
          <ScrollView style={{ maxHeight: 420 }}>{children}</ScrollView>
          <View style={s.popupActions}>
            {(buttons || []).map((b, i) => (
              <Btn key={i} title={b.title} kind={b.kind || "primary"} onPress={b.onPress}
                style={{ flex: 1, marginTop: 0, marginLeft: i === 0 ? 0 : 8 }} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const s = StyleSheet.create({
  appbar: {
    backgroundColor: C.navy, paddingTop: 44, paddingBottom: 12, paddingHorizontal: 10,
    flexDirection: "row", alignItems: "center"
  },
  appbarTitle: { color: "#fff", fontSize: 18, fontWeight: "600", flex: 1, paddingLeft: 6 },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.15)", width: 38, height: 38, borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginLeft: 6
  },
  iconTxt: { color: "#fff", fontSize: 17 },
  btn: { borderRadius: 11, paddingVertical: 13, paddingHorizontal: 16, alignItems: "center", marginTop: 10 },
  btnTxt: { fontSize: 15, fontWeight: "600" },
  fieldLabel: { fontSize: 12.5, color: C.muted, marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11,
    fontSize: 15, backgroundColor: "#fff", color: C.text
  },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 14 },
  sectionLabel: { fontSize: 12.5, color: C.muted, fontWeight: "700", marginBottom: 8, marginTop: 4, letterSpacing: 0.5 },
  spinnerWrap: { flex: 1, backgroundColor: "rgba(15,22,45,0.6)", alignItems: "center", justifyContent: "center" },
  spinnerTxt: { color: "#fff", marginTop: 14, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: "rgba(15,22,45,0.5)", alignItems: "center", justifyContent: "center", padding: 20 },
  popup: { backgroundColor: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, padding: 20 },
  popupTitle: { fontSize: 18, fontWeight: "700", color: C.navy, marginBottom: 12 },
  popupActions: { flexDirection: "row", marginTop: 14 }
});
