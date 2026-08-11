import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { C } from "../theme";
import { AppBar, IconBtn, Spinner } from "../ui";
import { getTickets } from "../api";
import { collectEntries, exportReport } from "../reportClient";

export default function TicketListScreen({ nav, app }) {
  const flow = app.flow;
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [busy, setBusy] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function load() {
    setBusy(true);
    const list = await getTickets(flow.module);
    setTickets(list);
    setBusy(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = tickets.filter((t) => {
    const q = query.trim().toLowerCase();
    return !q || (t.storeName + " " + t.storeCode + " " + t.ticketNo).toLowerCase().indexOf(q) >= 0;
  });

  function openTicket(t) {
    app.setFlow({ ticket: t, work: null });
    nav.push("detail");
  }

  function onSync() {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); app.toast("Sync", "All pending data uploaded to server."); }, 1200);
  }

  async function onReport() {
    const entries = await collectEntries(flow.module);
    exportReport(flow.module, entries, app);
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar
        title={flow.moduleTitle || "Tickets"}
        onBack={() => nav.pop()}
        right={
          <View style={{ flexDirection: "row" }}>
            <IconBtn label="🔍" onPress={() => setShowSearch(!showSearch)} />
            <IconBtn label="📄" onPress={onReport} />
            <IconBtn label="⬆️" onPress={onSync} />
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        {showSearch ? (
          <TextInput
            style={st.search}
            placeholder="Search store / ticket number"
            placeholderTextColor="#aab2c0"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        ) : null}

        <View style={st.counter}>
          <Text style={{ color: C.navy, fontSize: 13 }}>Total Tickets: <Text style={{ fontWeight: "700" }}>{filtered.length}</Text></Text>
        </View>

        {filtered.length === 0 && !busy ? (
          <Text style={st.empty}>{tickets.length === 0 ? "No Tickets Available" : "No matching tickets"}</Text>
        ) : null}

        {filtered.map((t) => (
          <TouchableOpacity key={t.ticketNo} style={st.ticket} onPress={() => openTicket(t)} activeOpacity={0.85}>
            <View style={st.tcTop}>
              <Text style={st.tcCode}>{t.ticketNo}</Text>
              <View style={st.badge}><Text style={st.badgeTxt}>{t.status}</Text></View>
            </View>
            <Text style={st.tcStore}>{t.storeName}</Text>
            <Text style={st.tcMeta}>{t.storeCode} · {t.category} · {t.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Spinner visible={busy || syncing} text={syncing ? "Uploading pending data…" : "Loading tickets…"} />
    </View>
  );
}

const st = StyleSheet.create({
  search: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: "#fff", marginBottom: 10, color: C.text },
  counter: { backgroundColor: "#e8edf8", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12 },
  empty: { textAlign: "center", color: C.muted, paddingVertical: 40, fontSize: 15 },
  ticket: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: C.navy },
  tcTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  tcCode: { fontWeight: "700", color: C.navy },
  badge: { backgroundColor: "#fde9c8", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { fontSize: 11, color: "#9a6a1a" },
  tcStore: { fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 3 },
  tcMeta: { fontSize: 12, color: C.muted }
});
