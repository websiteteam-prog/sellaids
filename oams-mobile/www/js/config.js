/* =========================================================================
 * OAMS Field App — CONFIG (edit this file)
 * -------------------------------------------------------------------------
 * API_BASE decides where the app gets its data from:
 *
 *   ""  (empty)  -> AUTO:
 *                    • opened in a browser over http/https  -> uses <same site>/api
 *                      (so running the backend with `node server.js` and opening
 *                       http://localhost:4000 "just works" — app is connected)
 *                    • installed as an APK (file://)         -> runs fully OFFLINE
 *                      using the bundled demo data in js/data.js
 *
 *   "https://your-server.com/api"  -> ALWAYS use this backend URL.
 *      Put your hosted backend URL here to make the *APK* talk to your database,
 *      then rebuild the APK (push to the branch → GitHub Actions rebuilds).
 * ========================================================================= */
window.OAMS_CONFIG = {
  API_BASE: ""
};
