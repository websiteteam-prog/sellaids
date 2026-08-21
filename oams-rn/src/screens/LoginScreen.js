import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../theme";
import { Btn, Field, Spinner, Popup } from "../ui";
import { login, getMaster } from "../api";
import { DATA } from "../data";
import { getRemember, setRemember } from "../storage";

const SYNC_STEPS = ["Module", "Element", "Configuration", "Location", "Store Master"];

export default function LoginScreen({ nav, app }) {
  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("Recce");
  const [remember, setRememberFlag] = useState(false);
  const [busy, setBusy] = useState(false);

  const [configVisible, setConfigVisible] = useState(false);
  const [syncDone, setSyncDone] = useState(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    (async () => {
      const r = await getRemember();
      if (r) { setEmpCode(r); setRememberFlag(true); }
    })();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  async function afterAuth(name, offline) {
    app.setSession({ empCode: empCode || "OFFLINE", name: name || empCode, mode, offline: !!offline });
    const m = offline ? { elementTypes: DATA.elementTypes } : await getMaster();
    app.setMaster(m);
    if (offline) { setWelcomeVisible(true); return; }
    setSyncDone(0);
    setConfigVisible(true);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setSyncDone(i);
      if (i >= SYNC_STEPS.length) { clearInterval(timer.current); timer.current = null; }
    }, 300);
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
    // Deployment flow will be built later; Recce is the live flow.
    if (mode === "Deployment") {
      app.toast("Deployment", "Deployment flow coming soon. Opening store list for now.");
    }
    nav.replace("stores");
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.navy }}>
      <ScrollView contentContainerStyle={st.wrap}>
        <View style={st.brand}>
          <Text style={st.logo}>OAMS</Text>
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
          <TouchableOpacity onPress={() => app.toast("Unable to Login?", "Please contact the OAMS Team / your Coordinator to reset your password. Or tap Offline Mode to continue with the last synced data.")}>
            <Text style={st.link}>Unable to Login?</Text>
          </TouchableOpacity>
          <Text style={st.or}>or</Text>
          <Btn title="Offline Mode" kind="outline" onPress={onOffline} />
        </View>

        <Text style={st.version}>v{DATA.appVersion}</Text>
      </ScrollView>

      <Popup
        visible={configVisible}
        title="Configuring App"
        buttons={[
          { title: "Cancel", kind: "outline", onPress: () => { if (timer.current) clearInterval(timer.current); setConfigVisible(false); } },
          { title: "OK", kind: "primary", onPress: () => { if (syncDone >= SYNC_STEPS.length) { setConfigVisible(false); setWelcomeVisible(true); } } }
        ]}
      >
        {SYNC_STEPS.map((step, i) => (
          <View key={step} style={st.syncItem}>
            <View style={[st.syncDot, i < syncDone && st.syncDotOn]}>
              {i < syncDone ? <Text style={st.syncCheck}>✓</Text> : null}
            </View>
            <Text style={{ color: C.text }}>{step}</Text>
          </View>
        ))}
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
          {syncDone >= SYNC_STEPS.length ? "Sync complete. Tap OK." : "Syncing master data…"}
        </Text>
      </Popup>

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
  logo: { color: "#fff", fontSize: 44, fontWeight: "800", letterSpacing: 4 },
  sub: { color: "rgba(255,255,255,0.85)", fontSize: 13, letterSpacing: 2 },
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
  version: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 16 },
  syncItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  syncDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.line, marginRight: 10, alignItems: "center", justifyContent: "center" },
  syncDotOn: { backgroundColor: C.success, borderColor: C.success },
  syncCheck: { color: "#fff", fontSize: 12 }
});
