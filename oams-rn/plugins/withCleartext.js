/*
 * Local Expo config plugin: allow cleartext (http://) traffic so the installed
 * APK can talk to an http backend on your LAN (e.g. http://192.168.x.x:4000).
 * Without this, Android 9+ blocks plain-http requests in release builds.
 */
const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCleartext(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application && cfg.modResults.manifest.application[0];
    if (app && app.$) {
      app.$["android:usesCleartextTraffic"] = "true";
    }
    return cfg;
  });
};
