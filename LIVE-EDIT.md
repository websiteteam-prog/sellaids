# OAMS — App ko edit karke live dekhna (2 tareeke)

Tumhe app ke andar text / stores / elements badalne hain aur turant result
dekhna hai. Do rasta hai. **Tareeka 1 sabse aasaan aur pakka chalega.**

---

## ✅ Tareeka 1 — BROWSER PREVIEW (recommended, 100% chalega)

Isme phone ki zaroorat hi nahi. App tumhare **computer ke browser** me khulega.
Jaise hi file save karoge, browser apne aap refresh ho jaayega. Koi QR, koi
wifi-match, koi "download update" error nahi.

**Ek baar ka setup:**
```
cd oams-rn
npm install
```

**Har baar edit karne ke liye:**
```
cd oams-rn
npx expo start --web
```
- Terminal browser khol dega (ya `http://localhost:8081` khud kholo).
- App login screen dikhega. **"Offline Mode"** dabao — stores list aa jaayegi.
- Ab koi file edit karo (jaise `src/data.js` me store ka naam badlo) aur
  **save (Ctrl+S)** karo → browser turant update ho jaayega. **Yahi live edit hai.**

> Note: Camera / GPS browser me pura kaam nahi karega (wo sirf phone ke liye
> hai), lekin poori app, saare screens, text, colours, stores, elements —
> sab yahin dikhte aur edit hote hain. UI/text/data badalne ke liye yeh perfect hai.

---

## 📱 Tareeka 2 — PHONE pe live edit (Dev APK)

Agar phone pe hi dekhna hai to **Expo Go mat use karo** (uski version tumhare
project se nayi hai, isiliye "Something went wrong" / "failed to download
remote update" aata hai).

Iske badle humne tumhare project ke liye ek **apna Dev APK** banaya hai:

**Download (phone me):**
```
https://github.com/websiteteam-prog/sellaids/releases/download/oams-dev-latest/oams-field-app-dev.apk
```
Install karo (naam: **OAMS Field App**). Yeh Expo Go ki jagah lega.

**PC pe (project folder me):**
```
cd oams-rn
npm install
npx expo start --dev-client --tunnel
```
- `--tunnel` zaroori hai — isse phone aur PC alag wifi pe ho tab bhi chalega,
  aur "failed to download remote update" wali problem khatam.
- Pehli baar `--tunnel` chalane pe `@expo/ngrok` install karne ko bole to
  `y` / yes dab dena.
- Terminal me QR aayega → wo naya **OAMS Field App** (jo abhi install kiya)
  usse QR scan karo. App download hoke chal jaayega, aur edit karte hi
  live reload hoga.

---

## Final APK (client ko dene ke liye)

Yeh dono upar wale sirf **editing/testing** ke liye hain. Jab app final ho jaaye,
toh **standalone installable APK** yahan se milega (JS andar embedded, kisi PC
ki zaroorat nahi):
```
https://github.com/websiteteam-prog/sellaids/releases/download/oams-rn-latest/oams-field-app-rn.apk
```
Yeh har commit pe apne aap dobara ban jaata hai.
