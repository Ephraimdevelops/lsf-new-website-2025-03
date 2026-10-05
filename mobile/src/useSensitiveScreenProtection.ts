import * as ScreenCapture from "expo-screen-capture";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Platform } from "react-native";
import { createScreenProtection } from "./screenProtection";

const protection = createScreenProtection({
  async enable() {
    if (!(await ScreenCapture.isAvailableAsync())) return;
    await ScreenCapture.preventScreenCaptureAsync("haki-yangu:sensitive");
    if (Platform.OS === "ios") {
      try { await ScreenCapture.enableAppSwitcherProtectionAsync(0.85); } catch { /* Unsupported runtime. */ }
    }
  },
  async disable() {
    await ScreenCapture.allowScreenCaptureAsync("haki-yangu:sensitive");
    if (Platform.OS === "ios") {
      try { await ScreenCapture.disableAppSwitcherProtectionAsync(); } catch { /* Unsupported runtime. */ }
    }
  },
});

export function useSensitiveScreenProtection(screenKey: string) {
  useFocusEffect(useCallback(() => protection.acquire(screenKey), [screenKey]));
}
