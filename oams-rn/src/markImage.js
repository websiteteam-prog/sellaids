/* =========================================================================
 * Image marking (draw on a photo) — WEB implementation (DOM canvas).
 * Opens a full-screen editor: pencil + box tools, colour, undo, clear.
 * Returns a flattened JPEG data URL of the marked photo.
 * Native uses components/MarkImageModal.native.js instead.
 * ========================================================================= */
export function markImageWeb(dataUrl, onDone, onCancel) {
  const doc = window.document;
  const overlay = doc.createElement("div");
  overlay.setAttribute("data-marker", "1");
  overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:#151a2e;display:flex;flex-direction:column;";

  const bar = doc.createElement("div");
  bar.style.cssText = "display:flex;gap:6px;padding:10px;background:#0e1324;flex-wrap:wrap;align-items:center;justify-content:center;";
  const area = doc.createElement("div");
  area.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px;";
  const canvas = doc.createElement("canvas");
  canvas.style.cssText = "max-width:100%;max-height:100%;touch-action:none;background:#000;cursor:crosshair;border-radius:6px;";
  area.appendChild(canvas);
  overlay.appendChild(bar);
  overlay.appendChild(area);
  doc.body.appendChild(overlay);

  function cleanup() { try { doc.body.removeChild(overlay); } catch (e) {} }

  const img = new window.Image();
  img.onload = function () {
    const MAX = 1400;
    let iw = img.width, ih = img.height;
    const sc = Math.min(1, MAX / Math.max(iw, ih));
    iw = Math.max(1, Math.round(iw * sc)); ih = Math.max(1, Math.round(ih * sc));
    canvas.width = iw; canvas.height = ih;
    const ctx = canvas.getContext("2d");
    const penSize = Math.max(3, Math.round(iw / 200));

    let strokes = [], cur = null, tool = "pen", color = "#ff0000";

    function drawStroke(s) {
      ctx.strokeStyle = s.color; ctx.lineWidth = s.size; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (s.tool === "pen") {
        ctx.beginPath();
        s.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      } else if (s.tool === "rect") {
        ctx.strokeRect(s.x0, s.y0, s.x1 - s.x0, s.y1 - s.y0);
      }
    }
    function redraw() {
      ctx.clearRect(0, 0, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih);
      strokes.forEach(drawStroke);
      if (cur) drawStroke(cur);
    }
    function pt(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (iw / r.width), y: (e.clientY - r.top) * (ih / r.height) };
    }
    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
      const p = pt(e);
      cur = tool === "pen"
        ? { tool: "pen", color: color, size: penSize, points: [p] }
        : { tool: "rect", color: color, size: penSize, x0: p.x, y0: p.y, x1: p.x, y1: p.y };
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!cur) return; const p = pt(e);
      if (cur.tool === "pen") cur.points.push(p); else { cur.x1 = p.x; cur.y1 = p.y; }
      redraw();
    });
    function endStroke() { if (cur) { strokes.push(cur); cur = null; redraw(); } }
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    redraw();

    // ---- toolbar ----
    function btn(label, on, active) {
      const b = doc.createElement("button");
      b.textContent = label;
      b.style.cssText = "border:0;border-radius:8px;padding:9px 12px;font-size:14px;font-weight:600;cursor:pointer;color:#fff;background:" + (active ? "#2f80ed" : "#33405f") + ";";
      b.onclick = on;
      bar.appendChild(b);
      return b;
    }
    function refresh() {
      bar.innerHTML = "";
      btn("✏️ Pencil", () => { tool = "pen"; refresh(); }, tool === "pen");
      btn("▭ Box", () => { tool = "rect"; refresh(); }, tool === "rect");
      // colours
      [["#ff0000", "Red"], ["#ffd400", "Yellow"], ["#00b050", "Green"], ["#111111", "Black"]].forEach(([c]) => {
        const cb = doc.createElement("button");
        cb.style.cssText = "width:26px;height:26px;border-radius:50%;border:" + (color === c ? "3px solid #fff" : "2px solid #667") + ";background:" + c + ";cursor:pointer;";
        cb.onclick = () => { color = c; refresh(); };
        bar.appendChild(cb);
      });
      btn("↶ Undo", () => { strokes.pop(); redraw(); });
      btn("Clear", () => { strokes = []; redraw(); });
      const sp = doc.createElement("div"); sp.style.cssText = "flex-basis:100%;height:0"; bar.appendChild(sp);
      btn("Cancel", () => { cleanup(); onCancel && onCancel(); });
      const d = btn("✓ Done", () => { const out = canvas.toDataURL("image/jpeg", 0.7); cleanup(); onDone(out); }, true);
      d.style.background = "#1f9d55";
    }
    refresh();
  };
  img.onerror = function () { cleanup(); onCancel && onCancel(); };
  img.src = dataUrl;
}
