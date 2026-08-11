/*
 * Local Expo config plugin: restrict the packaged native ABIs to arm64-v8a.
 * A debug/release RN APK otherwise bundles arm64 + armeabi-v7a + x86 + x86_64,
 * which makes the APK very large. arm64-v8a covers essentially all modern
 * Android phones, keeping the APK small.
 */
const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAbiFilter(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== "groovy") return cfg;
    let contents = cfg.modResults.contents;
    if (!contents.includes('abiFilters "arm64-v8a"')) {
      contents = contents.replace(
        /defaultConfig\s*\{/,
        'defaultConfig {\n        ndk { abiFilters "arm64-v8a" }'
      );
    }
    cfg.modResults.contents = contents;
    return cfg;
  });
};
