import { useAuth } from "./auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "./backend/api";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { appConfig } from "./config";

export type NotificationCategory = "cases" | "messages" | "appointments" | "documents" | "service";
export type NotificationPreferences = Record<NotificationCategory, boolean>;

export const defaultNotificationPreferences: NotificationPreferences = {
  cases: true,
  messages: true,
  appointments: true,
  documents: true,
  service: true,
};

export function useNotificationPreferences() {
  const { isSignedIn } = useAuth();
  const remotePreferences = useQuery(api.notifications.getPreferences, isSignedIn ? {} : "skip");
  const updateRemotePreferences = useMutation(api.notifications.updatePreferences);
  const setRemotePushEnabled = useMutation(api.notifications.setPushEnabled);
  const registerPushToken = useMutation(api.notifications.registerPushToken);
  const preferences: NotificationPreferences = remotePreferences ? {
    cases: remotePreferences.cases,
    messages: remotePreferences.messages,
    appointments: remotePreferences.appointments,
    documents: remotePreferences.documents,
    service: remotePreferences.service,
  } : defaultNotificationPreferences;

  async function updatePreference(category: NotificationCategory, enabled: boolean) {
    if (!isSignedIn || !remotePreferences) throw new Error("Sign in and wait for your settings to load.");
    await updateRemotePreferences({ preferences: { ...preferences, [category]: enabled } });
  }

  async function updatePushEnabled(enabled: boolean) {
    if (!isSignedIn || !remotePreferences) throw new Error("Sign in and wait for your settings to load.");
    if (!enabled) {
      await setRemotePushEnabled({ enabled: false });
      return;
    }
    if (Platform.OS === "web" || !appConfig.easProjectId) throw new Error("Push is unavailable in this build.");
    if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("case-updates", {
      name: "Haki Yangu updates",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    const current = await Notifications.getPermissionsAsync();
    const permission = current.granted ? current : await Notifications.requestPermissionsAsync();
    if (!permission.granted) throw new Error("Device notification permission was not granted.");
    const token = await Notifications.getExpoPushTokenAsync({ projectId: appConfig.easProjectId });
    await setRemotePushEnabled({ enabled: true });
    try {
      await registerPushToken({ token: token.data, platform: Platform.OS, projectId: appConfig.easProjectId, enabled: true });
    } catch (error) {
      await setRemotePushEnabled({ enabled: false });
      throw error;
    }
  }

  return {
    hydrated: !isSignedIn || remotePreferences !== undefined,
    preferences,
    pushEnabled: remotePreferences?.pushEnabled === true,
    updatePreference,
    updatePushEnabled,
  };
}
