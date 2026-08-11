import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { C } from "../theme";
import { AppBar, Btn } from "../ui";

export default function TicketDetailScreen({ nav, app }) {
  const t = app.flow.ticket || {};
  const [gpsReady, setGpsReady] = useState(false);
  const [coords, setCoords] = useState(null);
  const timer = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    tryGps();
    timer.current = setInterval(tryGps, 3000);
    return () => { mounted.current = false; if (timer.current) clearInterval(timer.current); };
  }, []);

  async function tryGps() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      if (!mounted.current) return;
      const c = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      setCoords(c);
      setGpsReady(true);
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
    } catch (e) { /* keep polling */ }
  }

  function start() {
    app.setFlow({
      work: { photo: null, photoAddress: "", storeRemarks: "", coords, items: [] }
    });
    nav.push("store");
  }

  const KV = ({ k, v }) => (
    <View style={st.kv}>
      <Text style={st.kvKey}>{k}</Text>
      <Text style={st.kvVal}>{v}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <AppBar title="Ticket Detail" onBack={() => nav.pop()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={st.head}>
          <Text style={st.headTitle}>{t.ticketNo}</Text>
          <View style={st.headRow}>
            <Text style={st.headSub}>Status: {t.status}</Text>
            <Text style={st.headSub}>Stage: {t.stage}</Text>
          </View>
        </View>

        <View style={st.info}>
          <Text style={st.infoH}>STORE</Text>
          <KV k="Store Name" v={t.storeName} />
          <KV k="Store Code" v={t.storeCode} />
          <KV k="Category" v={t.category} />
        </View>

        <View style={st.info}>
          <Text style={st.infoH}>JOB INFO</Text>
          <KV k="Created By" v={t.createdBy} />
          <KV k="Coordinator" v={t.coordinatorName} />
          <KV k="Contact" v={t.coordinatorNumber} />
          <KV k="Tentative Date" v={t.tentativeDate} />
          <KV k="Remarks" v={t.remarks} />
        </View>

        <View style={st.info}>
          <Text style={st.infoH}>PLANNED ITEMS</Text>
          <View style={[st.trow, { backgroundColor: "#eef2fb" }]}>
            <Text style={[st.th, { flex: 2 }]}>Category</Text>
            <Text style={[st.th, { flex: 1 }]}>Qty</Text>
          </View>
          {(t.itemSummary || []).map((r, i) => (
            <View key={i} style={st.trow}>
              <Text style={[st.td, { flex: 2 }]}>{r.category}</Text>
              <Text style={[st.td, { flex: 1 }]}>{r.qty}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={st.bottom}>
        <Text style={[st.gps, gpsReady && { color: C.success }]}>
          {gpsReady ? "📍 Your location is available now!" : "📍 Please turn on your GPS to proceed further"}
        </Text>
        <Btn title="Start / Continue" onPress={start} disabled={!gpsReady} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  head: { backgroundColor: C.navy, borderRadius: 14, padding: 14, marginBottom: 14 },
  headTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  headSub: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  info: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 12 },
  infoH: { fontSize: 12, color: C.muted, fontWeight: "700", marginBottom: 8, letterSpacing: 0.5 },
  kv: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.line },
  kvKey: { color: C.muted, fontSize: 13.5, flex: 1 },
  kvVal: { color: C.text, fontSize: 13.5, fontWeight: "600", flex: 1.4, textAlign: "right" },
  trow: { flexDirection: "row", borderWidth: 1, borderColor: C.line, borderTopWidth: 0 },
  th: { padding: 7, fontSize: 13, color: C.navy, fontWeight: "700" },
  td: { padding: 7, fontSize: 13, color: C.text },
  bottom: { padding: 14, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line },
  gps: { textAlign: "center", marginBottom: 8, color: "#b1631a", fontSize: 13 }
});
