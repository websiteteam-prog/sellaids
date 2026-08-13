import React, { useState, useRef, useCallback } from "react";
import { View, Text, StatusBar, SafeAreaView } from "react-native";
import { Spinner, Popup } from "./src/ui";
import { C } from "./src/theme";
import { DATA } from "./src/data";

import LoginScreen from "./src/screens/LoginScreen";
import StoreListScreen from "./src/screens/StoreListScreen";
import StoreRecceScreen from "./src/screens/StoreRecceScreen";

const SCREENS = {
  login: LoginScreen,
  stores: StoreListScreen,
  recce: StoreRecceScreen
};

export default function App() {
  const [stack, setStack] = useState([{ name: "login", params: {} }]);
  const [session, setSession] = useState(null);
  const [master, setMaster] = useState({ elementTypes: DATA.elementTypes, surfaces: DATA.surfaces });
  const flowRef = useRef({ mode: "Recce", store: null, work: null });

  const [spin, setSpin] = useState({ visible: false, text: "" });
  const [toastState, setToastState] = useState({ visible: false, title: "", body: "" });
  const [confirmState, setConfirmState] = useState({ visible: false, title: "", body: "", onYes: null });

  const push = useCallback((name, params) => setStack((s) => [...s, { name, params: params || {} }]), []);
  const pop = useCallback((n = 1) => setStack((s) => (s.length > n ? s.slice(0, s.length - n) : s)), []);
  const popTo = useCallback((name) => setStack((s) => {
    const idx = s.map((x) => x.name).lastIndexOf(name);
    return idx >= 0 ? s.slice(0, idx + 1) : s;
  }), []);
  const replace = useCallback((name, params) => setStack((s) => [...s.slice(0, s.length - 1), { name, params: params || {} }]), []);
  const reset = useCallback((name, params) => setStack([{ name, params: params || {} }]), []);
  const nav = { push, pop, popTo, replace, reset };

  const app = {
    session, setSession,
    master, setMaster,
    flow: flowRef.current,
    setFlow: (obj) => { flowRef.current = Object.assign({}, flowRef.current, obj); },
    spinner: (visible, text) => setSpin({ visible: !!visible, text: text || "" }),
    toast: (title, body) => setToastState({ visible: true, title, body }),
    confirm: (title, body, onYes) => setConfirmState({ visible: true, title, body, onYes })
  };

  const current = stack[stack.length - 1];
  const Screen = SCREENS[current.name] || LoginScreen;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.navy }}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Screen key={current.name + stack.length} nav={nav} app={app} params={current.params} />
      </View>

      <Spinner visible={spin.visible} text={spin.text} />

      <Popup
        visible={toastState.visible}
        title={toastState.title}
        buttons={[{ title: "OK", onPress: () => setToastState({ visible: false, title: "", body: "" }) }]}
      >
        <Text style={{ color: C.text, fontSize: 14 }}>{toastState.body}</Text>
      </Popup>

      <Popup
        visible={confirmState.visible}
        title={confirmState.title}
        buttons={[
          { title: "Cancel", kind: "outline", onPress: () => setConfirmState({ visible: false, title: "", body: "", onYes: null }) },
          { title: "OK", kind: "primary", onPress: () => { const cb = confirmState.onYes; setConfirmState({ visible: false, title: "", body: "", onYes: null }); if (cb) cb(); } }
        ]}
      >
        <Text style={{ color: C.text, fontSize: 14 }}>{confirmState.body}</Text>
      </Popup>
    </SafeAreaView>
  );
}
