import React, { useRef, useReducer, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, PanResponder } from "react-native";
import Svg, { Polyline, Rect } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import { C } from "../theme";

const COLORS = ["#ff0000", "#ffd400", "#00b050", "#111111"];

// Native draw-on-image editor (pencil + box). Flattens to a JPEG data URL via view-shot.
export default function MarkImageModal({ visible, image, onDone, onCancel }) {
  const strokesRef = useRef([]);
  const curRef = useRef(null);
  const toolRef = useRef("pen");
  const colorRef = useRef("#ff0000");
  const shotRef = useRef(null);
  const boxRef = useRef({ w: 1, h: 1 });
  const [, force] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (visible) {
      strokesRef.current = []; curRef.current = null; toolRef.current = "pen"; colorRef.current = "#ff0000";
      if (image) {
        Image.getSize(image, (w, h) => {
          const bw = boxRef.current.w || 1;
          boxRef.current.h = Math.max(1, Math.round(bw * (h / w)));
          force();
        }, () => {});
      }
      force();
    }
  }, [visible, image]);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX: x, locationY: y } = e.nativeEvent;
      curRef.current = toolRef.current === "pen"
        ? { tool: "pen", color: colorRef.current, points: [{ x, y }] }
        : { tool: "rect", color: colorRef.current, x0: x, y0: y, x1: x, y1: y };
      force();
    },
    onPanResponderMove: (e) => {
      const c = curRef.current; if (!c) return;
      const { locationX: x, locationY: y } = e.nativeEvent;
      if (c.tool === "pen") c.points.push({ x, y }); else { c.x1 = x; c.y1 = y; }
      force();
    },
    onPanResponderRelease: () => { if (curRef.current) { strokesRef.current.push(curRef.current); curRef.current = null; force(); } },
    onPanResponderTerminate: () => { if (curRef.current) { strokesRef.current.push(curRef.current); curRef.current = null; force(); } },
  })).current;

  async function done() {
    try {
      const uri = await captureRef(shotRef, { format: "jpg", quality: 0.7, result: "data-uri" });
      onDone(uri);
    } catch (e) { onDone(image); }
  }

  const box = boxRef.current;
  const allStrokes = strokesRef.current.concat(curRef.current ? [curRef.current] : []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={st.overlay}>
        <View style={st.toolbar}>
          <TouchableOpacity style={[st.tb, toolRef.current === "pen" && st.tbOn]} onPress={() => { toolRef.current = "pen"; force(); }}><Text style={st.tbTxt}>✏️ Pencil</Text></TouchableOpacity>
          <TouchableOpacity style={[st.tb, toolRef.current === "rect" && st.tbOn]} onPress={() => { toolRef.current = "rect"; force(); }}><Text style={st.tbTxt}>▭ Box</Text></TouchableOpacity>
          {COLORS.map((c) => (
            <TouchableOpacity key={c} onPress={() => { colorRef.current = c; force(); }} style={[st.color, { backgroundColor: c, borderColor: colorRef.current === c ? "#fff" : "#556" }]} />
          ))}
          <TouchableOpacity style={st.tb} onPress={() => { strokesRef.current.pop(); force(); }}><Text style={st.tbTxt}>↶ Undo</Text></TouchableOpacity>
          <TouchableOpacity style={st.tb} onPress={() => { strokesRef.current = []; force(); }}><Text style={st.tbTxt}>Clear</Text></TouchableOpacity>
        </View>

        <View style={st.area}>
          <View
            ref={shotRef}
            style={{ width: "100%", height: box.h }}
            onLayout={(e) => { const w = e.nativeEvent.layout.width; if (w && Math.abs(w - box.w) > 1) { boxRef.current.w = w; if (image) Image.getSize(image, (iw, ih) => { boxRef.current.h = Math.max(1, Math.round(w * (ih / iw))); force(); }, () => {}); } }}
            {...pan.panHandlers}
          >
            {image ? <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" /> : null}
            <Svg style={StyleSheet.absoluteFill}>
              {allStrokes.map((s, i) => s.tool === "pen"
                ? <Polyline key={i} points={s.points.map((p) => p.x + "," + p.y).join(" ")} fill="none" stroke={s.color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                : <Rect key={i} x={Math.min(s.x0, s.x1)} y={Math.min(s.y0, s.y1)} width={Math.abs(s.x1 - s.x0)} height={Math.abs(s.y1 - s.y0)} fill="none" stroke={s.color} strokeWidth={4} />
              )}
            </Svg>
          </View>
        </View>

        <View style={st.bottom}>
          <TouchableOpacity style={[st.btn, st.cancel]} onPress={onCancel}><Text style={st.btnTxt}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={[st.btn, st.doneBtn]} onPress={done}><Text style={[st.btnTxt, { color: "#fff" }]}>✓ Done</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#151a2e" },
  toolbar: { flexDirection: "row", flexWrap: "wrap", gap: 6, padding: 10, backgroundColor: "#0e1324", alignItems: "center", justifyContent: "center" },
  tb: { backgroundColor: "#33405f", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  tbOn: { backgroundColor: "#2f80ed" },
  tbTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
  color: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, marginHorizontal: 2 },
  area: { flex: 1, alignItems: "center", justifyContent: "center", padding: 8 },
  bottom: { flexDirection: "row", padding: 12, backgroundColor: "#0e1324" },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 13, alignItems: "center", marginHorizontal: 6 },
  cancel: { backgroundColor: "#fff" },
  doneBtn: { backgroundColor: "#1f9d55" },
  btnTxt: { fontWeight: "700", fontSize: 15, color: C.navy }
});
