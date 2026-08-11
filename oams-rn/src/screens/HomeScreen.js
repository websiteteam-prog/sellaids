import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../theme";
import { AppBar, IconBtn, Btn, Spinner, Popup } from "../ui";
import { DATA } from "../data";

export default function HomeScreen({ nav, app }) {
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(false);
  const session = app.session || {};

  function openModule(m) {
    app.setFlow({ module: m.key, moduleTitle: m.title, ticket: null, work: null });
    nav.push("list");
  }

  function refreshMaster() {
    setBusy(true);
    setTimeout(() => { setBusy(false); app.toast("Refresh Master", "Store list & material checklist synced from server."); }, 1200);
  }

  function logout() {
    app.confirm("Logout", "Log out and return to Login screen?", () => {
      app.setSession(null);
      nav.reset("login");
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar title="Home" right={<IconBtn label="ℹ️" onPress={() => setInfo(true)} />} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={st.hello}>
          <Text style={st.helloTxt}>
            Hi, <Text style={{ fontWeight: "700" }}>{session.name || session.empCode}</Text>
            {"  ·  " + (session.mode || "Deployment") + (session.offline ? "  ·  Offline" : "")}
          </Text>
        </View>

        <View style={st.grid}>
          {DATA.modules.map((m) => (
            <TouchableOpacity key={m.key} style={st.tile} onPress={() => openModule(m)} activeOpacity={0.85}>
              <Text style={st.tileIcon}>{m.icon}</Text>
              <Text style={st.tileName}>{m.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn title="🔄 Refresh Master" kind="outline" onPress={refreshMaster} />
        <Btn title="⎋ Logout" kind="danger" onPress={logout} />
      </ScrollView>

      <Popup visible={info} title="App Info"
        buttons={[{ title: "Close", onPress: () => setInfo(false) }]}>
        <Text style={{ color: C.text, marginBottom: 4, fontWeight: "700" }}>OAMS Field App</Text>
        <Text style={{ color: C.text, marginBottom: 4 }}>Version {DATA.appVersion} (React Native)</Text>
        <Text style={{ color: C.muted }}>Login → Recce → Photo → Items → Save → PPT report.</Text>
      </Popup>

      <Spinner visible={busy} text="Re-syncing master data…" />
    </View>
  );
}

const st = StyleSheet.create({
  hello: { backgroundColor: C.navy, borderRadius: 14, padding: 16, marginBottom: 16 },
  helloTxt: { color: "#fff", fontSize: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 6 },
  tile: {
    backgroundColor: C.card, borderRadius: 14, padding: 18, width: "48%", marginBottom: 12,
    alignItems: "center", borderWidth: 1, borderColor: C.line
  },
  tileIcon: { fontSize: 30, marginBottom: 8 },
  tileName: { fontWeight: "600", fontSize: 14, color: C.text, textAlign: "center" }
});
