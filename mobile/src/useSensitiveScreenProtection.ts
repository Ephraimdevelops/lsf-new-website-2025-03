import * as ScreenCapture from "expo-screen-capture";
import { useEffect } from "react";
import { Platform } from "react-native";

const activeAppSwitcherKeys = new Set<string>();

async function preventScreenCapture(key: string) {
  try {
    if (await ScreenCapture.isAvailableAsync()) {
      await ScreenCapture.preventScreenCaptureAsync(key);
    }
  } catch {
    // Privacy protection should never crash a legal-aid flow on unsupported devices.
  }
}

async function allowScreenCapture(key: string) {
  try {
    if (await ScreenCapture.isAvailableAsync()) {
      await ScreenCapture.allowScreenCaptureAsync(key);
    }
  } catch {
    // Best-effort cleanup only; the OS resets capture policy when the app restarts.
  }
}

async function enableAppSwitcherProtection(key: string) {
  if (Platform.OS !== "ios") return;
  activeAppSwitcherKeys.add(key);
  try {
    await ScreenCapture.enableAppSwitcherProtectionAsync(0.85);
  } catch {
    activeAppSwitcherKeys.delete(key);
  }
}

async function disableAppSwitcherProtection(key: string) {
  if (Platform.OS !== "ios") return;
  activeAppSwitcherKeys.delete(key);
  if (activeAppSwitcherKeys.size > 0) return;
  try {
    await ScreenCapture.disableAppSwitcherProtectionAsync();
  } catch {
    // App-switcher blur is iOS-only and may be unavailable in some runtimes.
  }
}

export function useSensitiveScreenProtection(screenKey: string) {
  useEffect(() => {
    const key = `haki-yangu:${screenKey}`;
    void preventScreenCapture(key);
    void enableAppSwitcherProtection(key);

    return () => {
      void allowScreenCapture(key);
      void disableAppSwitcherProtection(key);
    };
  }, [screenKey]);
}
