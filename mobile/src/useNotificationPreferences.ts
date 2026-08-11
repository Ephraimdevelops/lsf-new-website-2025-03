import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./auth";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "./backend/api";

export type NotificationCategory = "cases" | "messages" | "appointments" | "documents" | "service";

export type NotificationPreferences = Record<NotificationCategory, boolean>;

const STORAGE_KEY = "haki-yangu:notification-preferences";

export const defaultNotificationPreferences: NotificationPreferences = {
  cases: true,
  messages: true,
  appointments: true,
  documents: true,
  service: true,
};

export function notificationCategory(type: string): NotificationCategory {
  if (type.startsWith("message.")) return "messages";
  if (type.startsWith("appointment.")) return "appointments";
  if (type.startsWith("document.")) return "documents";
  if (type.startsWith("case.") || type.startsWith("assignment.") || type.startsWith("request.")) return "cases";
  return "service";
}

export function useNotificationPreferences() {
  const { isSignedIn } = useAuth();
  const remotePreferences = useQuery(api.notifications.getPreferences, isSignedIn ? {} : "skip");
  const updateRemotePreferences = useMutation(api.notifications.updatePreferences);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed = JSON.parse(value) as Partial<NotificationPreferences>;
        setPreferences({ ...defaultNotificationPreferences, ...parsed });
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!remotePreferences) return;
    setPreferences({
      cases: remotePreferences.cases,
      messages: remotePreferences.messages,
      appointments: remotePreferences.appointments,
      documents: remotePreferences.documents,
      service: remotePreferences.service,
    });
  }, [remotePreferences]);

  async function updatePreference(category: NotificationCategory, enabled: boolean) {
    const next = { ...preferences, [category]: enabled };
    setPreferences(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (isSignedIn) {
      await updateRemotePreferences({ preferences: next });
    }
  }

  return {
    hydrated,
    preferences,
    updatePreference,
  };
}
