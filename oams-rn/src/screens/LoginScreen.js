import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../theme";
import { Btn, Field, Spinner, Popup } from "../ui";
import { login, getMaster } from "../api";
import { DATA } from "../data";
import { getRemember, setRemember } from "../storage";

export default function LoginScreen({ nav, app }) {
  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("Recce");
  const [remember, setRememberFlag] = useState(false);
  const [busy, setBusy] = useState(false);

  const [welcomeVisible, setWelcomeVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await getRemember();
      if (r) { setEmpCode(r); setRememberFlag(true); }
    })();
  }, []);

  async function afterAuth(name, offline) {
    app.setSession({ empCode: empCode || "OFFLINE", name: name || empCode, mode, offline: !!offline });
    const m = offline ? { elementTypes: DATA.elementTypes } : await getMaster();
    app.setMaster(m);
    setWelcomeVisible(true);
  }

  async function onLogin() {
    if (!empCode.trim() || !password.trim()) {
      app.toast("Login", "Please enter Employee Code and Password.");
      return;
    }
    setBusy(true);
    const res = await login(empCode.trim(), password.trim(), mode);
    setBusy(false);
    if (!res.ok) {
      app.toast("Login", res.network
        ? "Cannot reach the server. Check your connection or use Offline Mode."
        : "Invalid Employee Code or Password.");
      return;
    }
    if (remember) await setRemember(empCode.trim());
    await afterAuth(res.name, false);
  }

  async function onOffline() {
    await afterAuth("Offline User", true);
  }

  function goNext() {
    if (mode === "Deployment") {
      app.toast("Deployment", "Deployment flow coming soon. Opening store list for now.");
    }
    nav.replace("stores");
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.navy }}>
      <ScrollView contentContainerStyle={st.wrap}>
        <View style={st.brand}>
          <Text style={st.logo}>Hanu Multimedia</Text>
          <Text style={st.sub}>FIELD OPERATIONS</Text>
        </View>

        <View style={st.card}>
          <Field label="Employee Code" value={empCode} onChangeText={setEmpCode} placeholder="e.g. EMP1024" />
          <Field label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />

          <Text style={st.modeHint}>Select mode</Text>
          <View style={st.modeRow}>
            {DATA.loginModes.map((m) => (
              <TouchableOpacity key={m} style={st.radio} onPress={() => setMode(m)}>
                <View style={[st.radioDot, mode === m && st.radioDotOn]} />
                <Text style={st.radioLabel}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={st.checkRow} onPress={() => setRememberFlag(!remember)}>
            <View style={[st.checkbox, remember && st.checkboxOn]}>
              {remember ? <Text style={st.checkMark}>✓</Text> : null}
            </View>
            <Text style={st.radioLabel}>Remember me</Text>
          </TouchableOpacity>

          <Btn title="Login" onPress={onLogin} />
          <TouchableOpacity onPress={() => app.toast("Unable to Login?", "Please contact the Hanu Multimedia Team / your Coordinator to reset your password. Or tap Offline Mode to continue with the last synced data.")}>
            <Text style={st.link}>Unable to Login?</Text>
          </TouchableOpacity>
          <Text style={st.or}>or</Text>
          <Btn title="Offline Mode" kind="outline" onPress={onOffline} />
        </View>

        <Text style={st.version}>v{DATA.appVersion}</Text>
      </ScrollView>

      <Popup
        visible={welcomeVisible}
        title={DATA.announcement.title}
        buttons={[{ title: "OK", kind: "primary", onPress: () => { setWelcomeVisible(false); goNext(); } }]}
      >
        {DATA.announcement.lines.map((l, i) => (
          <View key={i} style={{ flexDirection: "row", marginVertical: 6 }}>
            <Text style={{ color: C.navy, fontWeight: "700", marginRight: 8 }}>•</Text>
            <Text style={{ color: C.text, flex: 1 }}>{l}</Text>
          </View>
        ))}
      </Popup>

      <Spinner visible={busy} text="Signing in…" />
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: "center", padding: 24 },
  brand: { alignItems: "center", marginBottom: 22 },
  logo: { color: "#fff", fontSize: 30, fontWeight: "800", letterSpacing: 1, textAlign: "center" },
  sub: { color: "rgba(255,255,255,0.85)", fontSize: 13, letterSpacing: 2, marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 18 },
  modeHint: { fontSize: 12.5, color: C.muted, fontWeight: "600", marginBottom: 8 },
  modeRow: { flexDirection: "row", marginBottom: 12, marginTop: 2 },
  radio: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  radioDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: C.muted, marginRight: 7 },
  radioDotOn: { borderColor: C.navy, backgroundColor: C.navy },
  radioLabel: { color: C.text, fontSize: 14 },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: C.muted, marginRight: 8, alignItems: "center", justifyContent: "center" },
  checkboxOn: { backgroundColor: C.navy, borderColor: C.navy },
  checkMark: { color: "#fff", fontSize: 13 },
  link: { color: C.accent, fontSize: 14, textAlign: "center", marginTop: 12 },
  or: { color: C.muted, textAlign: "center", marginVertical: 8 },
  version: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 16 }
});
