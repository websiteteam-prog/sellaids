import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { C } from "../theme";
import { AppBar, IconBtn, Spinner } from "../ui";
import { getStores } from "../api";

export default function StoreListScreen({ nav, app }) {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(true);

  async function load() {
    setBusy(true);
    const list = await getStores();
    setStores(list);
    setBusy(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = stores.filter((s) => {
    const q = query.trim().toLowerCase();
    return !q || (s.storeName + " " + s.storeCode + " " + (s.city || "")).toLowerCase().indexOf(q) >= 0;
  });

  function openStore(store) {
    app.setFlow({
      store,
      work: { storeImages: [], storeRemark: "", elements: [], finalRemark: "" }
    });
    nav.push("recce");
  }

  function logout() {
    app.confirm("Logout", "Log out and return to Login?", () => {
      app.setSession(null);
      nav.reset("login");
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar
        title="Select Store"
        right={<IconBtn label="⎋" onPress={logout} />}
      />
      <View style={{ padding: 16, paddingBottom: 6 }}>
        <TextInput
          style={st.search}
          placeholder="🔍  Search store name / code / city"
          placeholderTextColor="#8b93a3"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <Text style={st.count}>{filtered.length} store(s)</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }} keyboardShouldPersistTaps="handled">
        {filtered.length === 0 && !busy ? (
          <Text style={st.empty}>No matching stores</Text>
        ) : null}
        {filtered.map((s) => (
          <TouchableOpacity key={s.storeCode} style={st.card} onPress={() => openStore(s)} activeOpacity={0.85}>
            <View style={{ flex: 1 }}>
              <Text style={st.name}>{s.storeName}</Text>
              <Text style={st.meta}>{s.storeCode} · {s.category} · {s.city}</Text>
            </View>
            <Text style={st.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Spinner visible={busy} text="Loading stores…" />
    </View>
  );
}

const st = StyleSheet.create({
  search: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fff", color: C.text, fontSize: 15 },
  count: { color: C.muted, fontSize: 12, marginTop: 8 },
  empty: { textAlign: "center", color: C.muted, paddingVertical: 40 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: C.navy, flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "700", color: C.text, marginBottom: 3 },
  meta: { fontSize: 12, color: C.muted },
  arrow: { fontSize: 26, color: C.muted, marginLeft: 8 }
});
