/*
 * Local Expo config plugin.
 * Expo's prebuild generates res/drawable/splashscreen.xml which references
 * @color/splashscreen_background, but the color itself is sometimes not
 * written into colors.xml (SDK 51 quirk) -> AAPT "resource not found".
 * This plugin guarantees the color exists so the Android build links cleanly.
 */
const { withAndroidColors, AndroidConfig } = require("@expo/config-plugins");

const COLOR = "#1F3864";

module.exports = function withSplashColor(config) {
  return withAndroidColors(config, (cfg) => {
    cfg.modResults = AndroidConfig.Colors.assignColorValue(cfg.modResults, {
      name: "splashscreen_background",
      value: COLOR
    });
    return cfg;
  });
};
