# OAMS Field App

Android field-operations app (Recce / Installation survey) built from the
"App Screen Flow" brief. Implemented as a **Capacitor** app (web UI + native
Android shell) so it installs as a real APK with **real camera + GPS**.

> This is a **standalone / offline demo build**: there is no backend server, so
> login accepts any credentials, and tickets + material master come from bundled
> demo data (`www/js/data.js`). Camera, GPS, photo geo-stamping and PPT export
> are fully functional. To go live, replace the demo data / stubbed sync in
> `www/js/app.js` with real API calls.

## Screen flow (matches the brief)

1. **Login** — Employee Code, Password, Deployment/Maintenance, Remember me, Unable to Login, Offline Mode
2. **Configuring App** — master-data sync popup
3. **Welcome Announcement** — OAMS usage notes
4. **Home** — FAS Installation / GSB Preinstallation / Installation / Recce, Refresh Master, Logout, Info
5. **Ticket List** — counter, search, upload/sync, PPT report
6. **Ticket Detail** — store + job info, planned items, **GPS check** gate
7. **Store Overview** — **geo-tagged camera photo** (address stamped on image), remarks
8. **Item Entry** — All/WOD + OT/MBO/ISB tabs, Location & Material dropdowns, Width×Height **auto-total**, Scaffolding, remarks
9. **Save / Confirmation** — item cards (edit/delete), Final Save, "Recce Saved"
10. **Report** — **Download as PPT** (.pptx) with photo + details per store

## Build the APK

The APK is built automatically by GitHub Actions
(`.github/workflows/build-apk.yml`) on every push to the feature branch. The
built APK is uploaded as a workflow **artifact** and committed to
`dist/oams-field-app-debug.apk`.

### Build locally (needs Android SDK)

```bash
cd oams-mobile
npm ci
npx cap sync android
cd android && ./gradlew assembleDebug
# APK -> android/app/build/outputs/apk/debug/app-debug.apk
```

## Tech

- Capacitor 6 (`@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/filesystem`, `@capacitor/share`)
- Vanilla HTML/CSS/JS (no bundler) — `www/` is the web root
- PptxGenJS (vendored at `www/js/vendor/pptxgen.bundle.js`) for PPT export
- App id: `com.oams.fieldapp` · min SDK 22 · target SDK 34
