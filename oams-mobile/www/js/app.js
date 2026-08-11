/* =========================================================================
 * OAMS Field App — client logic (standalone / offline demo build)
 * Runs both inside the Capacitor APK (real camera + GPS) and in a browser
 * (graceful fallbacks) so it can be tested anywhere.
 * ========================================================================= */
(function () {
  "use strict";

  var D = window.OAMS_DATA;
  var Cap = window.Capacitor || null;
  var isNative = !!(Cap && typeof Cap.isNativePlatform === "function" && Cap.isNativePlatform());
  function plugin(name) { return (Cap && Cap.Plugins && Cap.Plugins[name]) || null; }

  // ---------- tiny helpers ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---------- state ----------
  var state = {
    session: null,
    module: "recce",
    ticket: null,
    work: null,          // { photo, photoAddress, storeRemarks, coords, items[] }
    gpsReady: false,
    gpsTimer: null,
    editingIndex: null,
    itemTab: { locType: "All", cat: "OT" }
  };

  var STORE_KEY = "oams_state_v1";
  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function persist(obj) {
    var cur = loadDone();
    Object.assign(cur, obj);
    localStorage.setItem(STORE_KEY, JSON.stringify(cur));
  }
  function doneTickets() { return loadDone().done || {}; }
  function markDone(no) {
    var d = doneTickets(); d[no] = true; persist({ done: d });
  }
  function savedWork() { return loadDone().work || {}; }
  function saveWork(no, work) {
    var w = savedWork(); w[no] = work; persist({ work: w });
  }

  // ---------- navigation ----------
  function show(id) {
    var scr = document.querySelectorAll(".screen");
    for (var i = 0; i < scr.length; i++) scr[i].classList.remove("active");
    $(id).classList.add("active");
    $(id).querySelector(".content") && ($(id).querySelector(".content").scrollTop = 0);
  }
  function overlay(id, on) { $(id).classList.toggle("show", !!on); }

  function spinner(on, text) {
    if (text) $("spinnerText").textContent = text;
    overlay("ov-spinner", on);
  }

  function toast(title, body, cb) {
    $("toastTitle").textContent = title;
    $("toastBody").innerHTML = body;
    overlay("ov-toast", true);
    $("btnToastOk").onclick = function () { overlay("ov-toast", false); if (cb) cb(); };
  }

  // dynamic choice popup
  function popupChoice(opts) {
    var ov = el("div", "overlay show");
    var pop = el("div", "popup popup-sm");
    pop.appendChild(el("div", "popup-title", esc(opts.title)));
    if (opts.body) pop.appendChild(el("div", "popup-body", opts.body));
    var acts = el("div", "popup-actions");
    (opts.buttons || []).forEach(function (b) {
      var btn = el("button", "btn " + (b.style || "btn-primary") + (opts.buttons.length === 1 ? " btn-block" : ""), esc(b.text));
      btn.onclick = function () { document.body.removeChild(ov); if (b.onClick) b.onClick(); };
      acts.appendChild(btn);
    });
    pop.appendChild(acts);
    ov.appendChild(pop);
    document.body.appendChild(ov);
  }

  // =======================================================================
  // PAGE 1 — LOGIN
  // =======================================================================
  function initLogin() {
    $("verTag").textContent = D.appVersion;

    $("btnLogin").onclick = function () {
      var code = $("loginEmpCode").value.trim();
      var pass = $("loginPassword").value.trim();
      if (!code || !pass) { toast("Login", "Please enter Employee Code and Password."); return; }
      var mode = (document.querySelector('input[name="appMode"]:checked') || {}).value || "Deployment";
      state.session = { empCode: code, mode: mode, offline: false };
      if ($("rememberMe").checked) persist({ remember: code });
      startConfigSync();
    };

    $("btnUnableLogin").onclick = function () {
      toast("Unable to Login?",
        "Please contact the OAMS Team / your Coordinator to reset your password.<br/><br/>Or tap <b>Offline Mode</b> to continue with the last synced data.");
    };

    $("btnOffline").onclick = function () {
      state.session = { empCode: $("loginEmpCode").value.trim() || "OFFLINE", mode: "Deployment", offline: true };
      showWelcome();
    };

    var remembered = loadDone().remember;
    if (remembered) { $("loginEmpCode").value = remembered; $("rememberMe").checked = true; }
  }

  // =======================================================================
  // PAGE 2 — CONFIGURING APP (sync popup)
  // =======================================================================
  function startConfigSync() {
    var steps = ["Module", "Element", "Configuration", "Location", "Material Checklist"];
    var list = $("syncList");
    list.innerHTML = "";
    var rows = steps.map(function (s) {
      var row = el("div", "sync-item");
      var chk = el("span", "sync-check", "");
      row.appendChild(chk);
      row.appendChild(el("span", "", esc(s)));
      list.appendChild(row);
      return chk;
    });
    $("btnConfigOk").disabled = true;
    overlay("ov-config", true);

    var i = 0;
    var t = setInterval(function () {
      if (i < rows.length) {
        rows[i].classList.add("done");
        rows[i].textContent = "✓";
        i++;
      } else {
        clearInterval(t);
        $("btnConfigOk").disabled = false;
      }
    }, 350);

    $("btnConfigCancel").onclick = function () { clearInterval(t); overlay("ov-config", false); };
    $("btnConfigOk").onclick = function () { overlay("ov-config", false); showWelcome(); };
  }

  // =======================================================================
  // PAGE 3 — WELCOME ANNOUNCEMENT
  // =======================================================================
  function showWelcome() {
    $("welcomeTitle").textContent = D.announcement.title;
    var body = $("welcomeBody");
    body.innerHTML = "";
    D.announcement.lines.forEach(function (l) {
      body.appendChild(el("div", "welcome-line", esc(l)));
    });
    overlay("ov-welcome", true);
    $("btnWelcomeOk").onclick = function () { overlay("ov-welcome", false); goHome(); };
  }

  // =======================================================================
  // PAGE 4 — HOME
  // =======================================================================
  function goHome() {
    $("helloStrip").innerHTML = "Hi, <b>" + esc(state.session.empCode) + "</b> · " +
      esc(state.session.mode) + (state.session.offline ? " · Offline" : "");
    var grid = $("moduleGrid");
    grid.innerHTML = "";
    D.modules.forEach(function (m) {
      var tile = el("div", "module-tile");
      tile.appendChild(el("div", "module-icon", m.icon));
      tile.appendChild(el("div", "module-name", esc(m.title)));
      tile.onclick = function () { openModule(m.key, m.title); };
      grid.appendChild(tile);
    });
    show("screen-home");
  }

  $("btnInfo") && ($("btnInfo").onclick = function () { overlay("ov-info", true); });

  function bindHome() {
    $("btnRefreshMaster").onclick = function () {
      spinner(true, "Re-syncing master data…");
      setTimeout(function () { spinner(false); toast("Refresh Master", "Store list & material checklist synced from server."); }, 1200);
    };
    $("btnLogout").onclick = function () {
      popupChoice({
        title: "Logout", body: "Log out and return to Login screen?",
        buttons: [
          { text: "Cancel", style: "btn-outline" },
          { text: "Logout", style: "btn-danger", onClick: function () { state.session = null; show("screen-login"); } }
        ]
      });
    };
  }

  // =======================================================================
  // PAGE 5 — TICKET LIST
  // =======================================================================
  function openModule(key, title) {
    state.module = key;
    $("listTitle").textContent = title;
    $("searchBar").classList.add("hidden");
    $("searchInput").value = "";
    renderList("");
    show("screen-list");
  }

  function moduleTickets() {
    return (D.tickets[state.module] || []).filter(function (t) {
      return !doneTickets()[t.ticketNo];
    });
  }

  function renderList(query) {
    var all = moduleTickets();
    var q = (query || "").toLowerCase();
    var list = all.filter(function (t) {
      return !q || (t.storeName + " " + t.storeCode + " " + t.ticketNo).toLowerCase().indexOf(q) >= 0;
    });
    $("ticketCount").textContent = list.length;
    var box = $("ticketList");
    box.innerHTML = "";
    $("listEmpty").classList.toggle("hidden", list.length > 0);
    if (!list.length && all.length === 0) $("listEmpty").textContent = "No Tickets Available";
    else if (!list.length) $("listEmpty").textContent = "No matching tickets";

    list.forEach(function (t) {
      var card = el("div", "ticket-card");
      card.innerHTML =
        '<div class="tc-top"><span class="tc-code">' + esc(t.ticketNo) + '</span>' +
        '<span class="tc-badge">' + esc(t.status) + '</span></div>' +
        '<div class="tc-store">' + esc(t.storeName) + '</div>' +
        '<div class="tc-meta">' + esc(t.storeCode) + ' · ' + esc(t.category) + ' · ' + esc(t.date) + '</div>';
      card.onclick = function () { openTicket(t); };
      box.appendChild(card);
    });
  }

  function bindList() {
    document.querySelectorAll("[data-back]").forEach(function (b) {
      b.onclick = function () { stopGps(); show(b.getAttribute("data-back")); };
    });
    $("btnSearchToggle").onclick = function () {
      $("searchBar").classList.toggle("hidden");
      if (!$("searchBar").classList.contains("hidden")) $("searchInput").focus();
    };
    $("searchInput").oninput = function () { renderList(this.value); };
    $("btnSync").onclick = function () {
      spinner(true, "Uploading pending data…");
      setTimeout(function () { spinner(false); toast("Sync", "All pending data uploaded to server."); }, 1300);
    };
    $("btnReport").onclick = function () { exportReport(); };
  }

  // =======================================================================
  // PAGE 6 — TICKET DETAIL (Before) + GPS check
  // =======================================================================
  function openTicket(t) {
    state.ticket = t;
    state.work = savedWork()[t.ticketNo] || { photo: null, photoAddress: "", storeRemarks: "", coords: null, items: [] };
    renderDetail(t);
    show("screen-detail");
    startGps();
  }

  function renderDetail(t) {
    var rows = t.itemSummary.map(function (r) {
      return "<tr><td>" + esc(r.category) + "</td><td>" + esc(r.qty) + "</td></tr>";
    }).join("");
    $("detailContent").innerHTML =
      '<div class="detail-head"><h2>' + esc(t.ticketNo) + '</h2>' +
      '<div class="dh-row"><span>Status: ' + esc(t.status) + '</span><span>Stage: ' + esc(t.stage) + '</span></div></div>' +

      '<div class="info-card"><h3>Store</h3>' +
      kv("Store Name", t.storeName) + kv("Store Code", t.storeCode) + kv("Category", t.category) + '</div>' +

      '<div class="info-card"><h3>Job Info</h3>' +
      kv("Created By", t.createdBy) + kv("Coordinator", t.coordinatorName) +
      kv("Contact", t.coordinatorNumber) + kv("Tentative Date", t.tentativeDate) +
      kv("Remarks", t.remarks) + '</div>' +

      '<div class="info-card"><h3>Planned Items</h3>' +
      '<table class="sum"><tr><th>Category</th><th>Qty</th></tr>' + rows + '</table></div>';
  }
  function kv(k, v) { return '<div class="kv"><span>' + esc(k) + '</span><span>' + esc(v) + '</span></div>'; }

  function setGpsState(ready, coords) {
    state.gpsReady = ready;
    state.work.coords = coords || state.work.coords;
    var msg = $("gpsMsg");
    if (ready) {
      msg.textContent = "📍 Your location is available now!";
      msg.classList.add("ok");
      $("btnStart").disabled = false;
    } else {
      msg.textContent = "📍 Please turn on your GPS to proceed further";
      msg.classList.remove("ok");
      $("btnStart").disabled = true;
    }
  }

  async function getCoords() {
    var Geo = plugin("Geolocation");
    if (Geo) {
      try { await Geo.requestPermissions(); } catch (e) {}
      var pos = await Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
    }
    if (navigator.geolocation) {
      return new Promise(function (res, rej) {
        navigator.geolocation.getCurrentPosition(
          function (p) { res({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }); },
          function (e) { rej(e); }, { enableHighAccuracy: true, timeout: 10000 });
      });
    }
    throw new Error("Geolocation not supported");
  }

  function startGps() {
    setGpsState(false);
    stopGps();
    var tick = function () {
      getCoords().then(function (c) {
        setGpsState(true, c);
        stopGps(); // got it; stop polling
      }).catch(function () { /* keep waiting */ });
    };
    tick();
    state.gpsTimer = setInterval(tick, 3000);
  }
  function stopGps() { if (state.gpsTimer) { clearInterval(state.gpsTimer); state.gpsTimer = null; } }

  function bindDetail() {
    $("btnStart").onclick = function () {
      if (!state.gpsReady) return;
      stopGps();
      openStore();
    };
  }

  // =======================================================================
  // PAGE 7 — STORE OVERVIEW (photo + items)
  // =======================================================================
  function openStore() {
    var t = state.ticket;
    $("storeHead").innerHTML = "<b>" + esc(t.storeName) + "</b><br/><span class='tc-meta'>" +
      esc(t.storeCode) + " · " + esc(t.ticketNo) + "</span>";
    $("photoAddress").value = state.work.photoAddress || "";
    $("storeRemarks").value = state.work.storeRemarks || "";
    renderPhoto();
    renderItems();
    show("screen-store");
  }

  function renderPhoto() {
    var area = $("photoArea");
    if (state.work.photo) {
      area.className = "";
      area.innerHTML = '<img src="' + state.work.photo + '" alt="store photo" />';
    } else {
      area.className = "photo-empty";
      area.textContent = "No photo captured yet";
    }
  }

  function coordsToAddress(c) {
    if (!c) return "Location unavailable";
    return "Lat " + c.lat.toFixed(6) + ", Lng " + c.lng.toFixed(6) +
      (c.acc ? " (±" + Math.round(c.acc) + "m)" : "");
  }

  // capture a photo and return a dataURL
  async function rawPhoto() {
    var Camera = plugin("Camera");
    if (Camera) {
      try { await Camera.requestPermissions({ permissions: ["camera"] }); } catch (e) {}
      var photo = await Camera.getPhoto({
        quality: 70, allowEditing: false, resultType: "dataUrl", source: "CAMERA", saveToGallery: false
      });
      return photo.dataUrl;
    }
    // browser fallback -> file input
    return new Promise(function (res, rej) {
      var inp = document.createElement("input");
      inp.type = "file"; inp.accept = "image/*"; inp.capture = "environment";
      inp.onchange = function () {
        var f = inp.files && inp.files[0];
        if (!f) return rej(new Error("No file"));
        var r = new FileReader();
        r.onload = function () { res(r.result); };
        r.onerror = function () { rej(new Error("Read failed")); };
        r.readAsDataURL(f);
      };
      inp.click();
    });
  }

  // draw address + timestamp stamp onto the photo
  function stampImage(dataUrl, address) {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () {
        var maxW = 1280;
        var scale = Math.min(1, maxW / img.width);
        var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        var cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        var ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        var lines = [address, new Date().toLocaleString()];
        var pad = Math.round(w * 0.02);
        var fs = Math.max(14, Math.round(w * 0.028));
        var barH = pad * 2 + lines.length * (fs + 4);
        ctx.fillStyle = "rgba(15,22,45,0.62)";
        ctx.fillRect(0, h - barH, w, barH);
        ctx.fillStyle = "#fff";
        ctx.font = fs + "px sans-serif";
        ctx.textBaseline = "top";
        lines.forEach(function (ln, i) {
          ctx.fillText(ln, pad, h - barH + pad + i * (fs + 4), w - pad * 2);
        });
        res(cv.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { res(dataUrl); };
      img.src = dataUrl;
    });
  }

  async function captureStorePhoto() {
    try {
      spinner(true, "Opening camera…");
      var raw = await rawPhoto();
      spinner(false);
      var coords = state.work.coords;
      if (!coords) { try { coords = await getCoords(); state.work.coords = coords; } catch (e) {} }
      var addr = $("photoAddress").value.trim() || coordsToAddress(coords);
      spinner(true, "Stamping location…");
      var stamped = await stampImage(raw, addr);
      spinner(false);
      state.work.photo = stamped;
      state.work.photoAddress = addr;
      $("photoAddress").value = addr;
      renderPhoto();
    } catch (e) {
      spinner(false);
      toast("Camera", "Could not capture photo. " + (e && e.message ? esc(e.message) : ""));
    }
  }

  function renderItems() {
    var box = $("itemCards");
    box.innerHTML = "";
    if (!state.work.items.length) {
      box.appendChild(el("div", "empty-state small", "No Item Added"));
      return;
    }
    state.work.items.forEach(function (it, idx) {
      var card = el("div", "item-card");
      card.innerHTML =
        '<div class="ic-main"><div class="ic-title">' + esc(it.material) + '</div>' +
        '<div class="ic-meta">' + esc(it.location) + ' · ' + esc(it.locType) + '/' + esc(it.category) + '<br/>' +
        'W ' + esc(it.width) + '" × H ' + esc(it.height) + '" = ' + esc(it.total) + '"' +
        (it.scaffold ? ' · Scaf ' + esc(it.scaffold) + 'sqft' : '') + '</div></div>';
      var acts = el("div", "ic-actions");
      var edit = el("button", "mini-btn", "✏️");
      edit.onclick = function () { openItemForm(idx); };
      var del = el("button", "mini-btn del", "✕");
      del.onclick = function () {
        popupChoice({
          title: "Delete Item", body: "Remove this item?",
          buttons: [
            { text: "Cancel", style: "btn-outline" },
            { text: "Delete", style: "btn-danger", onClick: function () { state.work.items.splice(idx, 1); renderItems(); } }
          ]
        });
      };
      acts.appendChild(edit); acts.appendChild(del);
      card.appendChild(acts);
      box.appendChild(card);
    });
  }

  function bindStore() {
    $("btnCamera").onclick = captureStorePhoto;
    $("photoAddress").oninput = function () { state.work.photoAddress = this.value; };
    $("storeRemarks").oninput = function () { state.work.storeRemarks = this.value; };
    $("btnAddItem").onclick = function () { openItemForm(null); };
    $("btnFinalSave").onclick = finalSave;
  }

  // =======================================================================
  // PAGE 8 — ITEM ENTRY FORM
  // =======================================================================
  function fillSelect(sel, arr, val) {
    sel.innerHTML = "";
    arr.forEach(function (o) {
      var op = document.createElement("option");
      op.value = o; op.textContent = o;
      if (o === val) op.selected = true;
      sel.appendChild(op);
    });
  }
  function buildTabs(container, arr, active, onPick) {
    container.innerHTML = "";
    arr.forEach(function (name) {
      var t = el("div", "tab" + (name === active ? " active" : ""), esc(name));
      t.onclick = function () {
        container.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
        onPick(name);
      };
      container.appendChild(t);
    });
  }

  function openItemForm(index) {
    state.editingIndex = index;
    var it = index != null ? state.work.items[index] : null;
    state.itemTab.locType = it ? it.locType : D.locationTypeTabs[0];
    state.itemTab.cat = it ? it.category : D.categoryTabs[0];

    buildTabs($("locTypeTabs"), D.locationTypeTabs, state.itemTab.locType, function (n) { state.itemTab.locType = n; });
    buildTabs($("catTabs"), D.categoryTabs, state.itemTab.cat, function (n) { state.itemTab.cat = n; });

    fillSelect($("itemLocation"), D.locations, it ? it.location : D.locations[0]);
    fillSelect($("itemMaterial"), D.materials, it ? it.material : D.materials[0]);
    $("itemWidth").value = it ? it.width : "";
    $("itemHeight").value = it ? it.height : "";
    $("itemScaffold").value = it ? it.scaffold : "";
    $("itemRemarks").value = it ? it.remarks : "";
    recalcTotal();
    overlay("ov-item", true);
  }

  function recalcTotal() {
    var w = parseFloat($("itemWidth").value) || 0;
    var h = parseFloat($("itemHeight").value) || 0;
    $("itemTotal").value = (w * h) ? (w * h).toFixed(2) : "0";
  }

  function bindItemForm() {
    $("itemWidth").oninput = recalcTotal;
    $("itemHeight").oninput = recalcTotal;
    $("btnItemCancel").onclick = function () { overlay("ov-item", false); };
    $("btnItemSave").onclick = function () {
      var w = parseFloat($("itemWidth").value) || 0;
      var h = parseFloat($("itemHeight").value) || 0;
      if (!w || !h) { toast("Item", "Please enter Width and Height."); return; }
      var item = {
        locType: state.itemTab.locType,
        category: state.itemTab.cat,
        location: $("itemLocation").value,
        material: $("itemMaterial").value,
        width: w, height: h, total: (w * h).toFixed(2),
        scaffold: parseFloat($("itemScaffold").value) || 0,
        remarks: $("itemRemarks").value.trim()
      };
      if (state.editingIndex != null) state.work.items[state.editingIndex] = item;
      else state.work.items.push(item);
      overlay("ov-item", false);
      renderItems();
    };
  }

  // =======================================================================
  // PAGE 9 — FINAL SAVE
  // =======================================================================
  function finalSave() {
    if (!state.work.items.length && !state.work.photo) {
      toast("Save", "Add at least a store photo or one item before saving.");
      return;
    }
    saveWork(state.ticket.ticketNo, state.work);
    markDone(state.ticket.ticketNo);
    spinner(true, "Submitting…");
    setTimeout(function () {
      spinner(false);
      popupChoice({
        title: "Recce Saved ✅",
        body: "Data + photo submitted for <b>" + esc(state.ticket.ticketNo) + "</b>.",
        buttons: [
          { text: "Download PPT", style: "btn-outline", onClick: function () { exportPPT([{ ticket: state.ticket, work: state.work }]); backToList(); } },
          { text: "OK", style: "btn-primary", onClick: backToList }
        ]
      });
    }, 1000);
  }
  function backToList() {
    renderList($("searchInput").value);
    show("screen-list");
  }

  // =======================================================================
  // PAGE 10 — REPORT / EXPORT (PPT)
  // =======================================================================
  function collectReportData() {
    var w = savedWork();
    var all = (D.tickets[state.module] || []);
    var out = [];
    all.forEach(function (t) {
      if (w[t.ticketNo]) out.push({ ticket: t, work: w[t.ticketNo] });
    });
    // include current in-progress ticket if any
    if (state.ticket && state.work && !w[state.ticket.ticketNo] &&
        (state.work.items.length || state.work.photo)) {
      out.push({ ticket: state.ticket, work: state.work });
    }
    return out;
  }

  function exportReport() {
    var data = collectReportData();
    if (!data.length) {
      toast("Report", "No saved recce data yet. Complete & save a ticket first, then download the PPT.");
      return;
    }
    exportPPT(data);
  }

  async function exportPPT(data) {
    if (typeof PptxGenJS === "undefined") { toast("Report", "PPT engine not loaded."); return; }
    spinner(true, "Generating PowerPoint…");
    try {
      var pptx = new PptxGenJS();
      pptx.defineLayout({ name: "OAMS", width: 13.33, height: 7.5 });
      pptx.layout = "OAMS";
      var NAVY = "1F3864";

      // cover slide
      var cover = pptx.addSlide();
      cover.background = { color: NAVY };
      cover.addText("OAMS Field Report", { x: 0.6, y: 2.4, w: 12, h: 1, fontSize: 40, bold: true, color: "FFFFFF" });
      cover.addText((D.modules.find(function (m) { return m.key === state.module; }) || {}).title || "Recce",
        { x: 0.6, y: 3.5, w: 12, h: 0.6, fontSize: 22, color: "AEC1E8" });
      cover.addText(new Date().toLocaleString() + "  ·  " + data.length + " store(s)",
        { x: 0.6, y: 4.2, w: 12, h: 0.5, fontSize: 14, color: "CBD6EE" });

      data.forEach(function (d) {
        var t = d.ticket, wk = d.work;
        var s = pptx.addSlide();
        s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.9, fill: { color: NAVY } });
        s.addText(t.storeName, { x: 0.4, y: 0.12, w: 9, h: 0.7, fontSize: 22, bold: true, color: "FFFFFF" });
        s.addText(t.ticketNo + " · " + t.storeCode, { x: 10, y: 0.22, w: 3, h: 0.5, fontSize: 12, color: "CBD6EE", align: "right" });

        // photo
        if (wk.photo) {
          s.addImage({ data: wk.photo, x: 0.4, y: 1.2, w: 5.6, h: 4.2 });
          if (wk.photoAddress) s.addText(wk.photoAddress, { x: 0.4, y: 5.45, w: 5.6, h: 0.5, fontSize: 10, color: "666666" });
        } else {
          s.addText("No photo captured", { x: 0.4, y: 3, w: 5.6, h: 0.5, fontSize: 14, italic: true, color: "999999", align: "center" });
        }

        // details block
        var info = [
          ["Category", t.category], ["Stage", t.stage],
          ["Coordinator", t.coordinatorName], ["Contact", t.coordinatorNumber],
          ["Tentative Date", t.tentativeDate]
        ];
        var infoRows = info.map(function (r) {
          return [{ text: r[0], options: { bold: true, color: NAVY } }, { text: String(r[1]), options: {} }];
        });
        s.addTable(infoRows, { x: 6.4, y: 1.2, w: 6.5, colW: [2.2, 4.3], fontSize: 11, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.32 });

        // items table
        var head = [
          { text: "Location", options: { bold: true, color: "FFFFFF", fill: NAVY } },
          { text: "Material", options: { bold: true, color: "FFFFFF", fill: NAVY } },
          { text: "W", options: { bold: true, color: "FFFFFF", fill: NAVY } },
          { text: "H", options: { bold: true, color: "FFFFFF", fill: NAVY } },
          { text: "Total", options: { bold: true, color: "FFFFFF", fill: NAVY } }
        ];
        var rows = [head];
        (wk.items || []).forEach(function (it) {
          rows.push([it.location, it.material, String(it.width), String(it.height), String(it.total)]);
        });
        if ((wk.items || []).length === 0) rows.push([{ text: "No items added", options: { colspan: 5, italic: true, color: "999999" } }]);
        s.addText("Items", { x: 6.4, y: 3.3, w: 6, h: 0.4, fontSize: 14, bold: true, color: NAVY });
        s.addTable(rows, { x: 6.4, y: 3.7, w: 6.5, colW: [2.0, 2.1, 0.8, 0.8, 0.8], fontSize: 10, border: { pt: 0.5, color: "DDDDDD" }, rowH: 0.3 });

        if (wk.storeRemarks) s.addText("Remarks: " + wk.storeRemarks, { x: 6.4, y: 6.2, w: 6.5, h: 0.6, fontSize: 10, italic: true, color: "444444" });
      });

      var fileName = "OAMS_Report_" + state.module + "_" + Date.now() + ".pptx";

      if (isNative) {
        var b64 = await pptx.write({ outputType: "base64" });
        var FS = plugin("Filesystem");
        var Share = plugin("Share");
        var res = await FS.writeFile({ path: fileName, data: b64, directory: "DOCUMENTS", recursive: true });
        spinner(false);
        popupChoice({
          title: "Report Ready 📄",
          body: "Saved as <b>" + esc(fileName) + "</b> in Documents.",
          buttons: [
            { text: "Share", style: "btn-outline", onClick: async function () {
                try { await Share.share({ title: "OAMS Report", url: res.uri, files: [res.uri] }); } catch (e) {}
              } },
            { text: "OK", style: "btn-primary" }
          ]
        });
      } else {
        await pptx.writeFile({ fileName: fileName });
        spinner(false);
        toast("Report", "PowerPoint downloaded: " + esc(fileName));
      }
    } catch (e) {
      spinner(false);
      toast("Report", "Could not generate PPT. " + (e && e.message ? esc(e.message) : ""));
    }
  }

  // =======================================================================
  // generic close buttons + boot
  // =======================================================================
  function bindGeneric() {
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.onclick = function () { overlay(b.getAttribute("data-close"), false); };
    });
  }

  function boot() {
    initLogin();
    bindHome();
    bindList();
    bindDetail();
    bindStore();
    bindItemForm();
    bindGeneric();
    show("screen-login");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
