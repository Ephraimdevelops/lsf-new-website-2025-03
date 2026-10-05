import { useAuth } from "./auth";
import { useMutation, useQuery } from "convex/react";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { api } from "./backend/api";
import { appConfig } from "./config";

export function usePushNotificationRegistration(enabled: boolean) {
  const { isSignedIn } = useAuth();
  const preferences = useQuery(api.notifications.getPreferences, enabled && isSignedIn ? {} : "skip");
  const registerPushToken = useMutation(api.notifications.registerPushToken);
  const setPushEnabled = useMutation(api.notifications.setPushEnabled);

  useEffect(() => {
    if (!enabled || !isSignedIn || !preferences || !appConfig.easProjectId || Platform.OS === "web") return;
    let cancelled = false;

    async function register() {
      try {
        const pushEnabled = preferences?.pushEnabled === true;
        if (pushEnabled && Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("case-updates", {
            name: "Case updates",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const current = await Notifications.getPermissionsAsync();
        if (!current.granted) {
          if (pushEnabled) await setPushEnabled({ enabled: false });
          return;
        }
        if (cancelled) return;

        const token = await Notifications.getExpoPushTokenAsync({
          projectId: appConfig.easProjectId,
        });
        if (cancelled) return;
        await registerPushToken({
          token: token.data,
          platform: Platform.OS,
          projectId: appConfig.easProjectId,
          enabled: pushEnabled,
        });
      } catch (error) {
        console.warn("Push notification registration failed", error);
      }
    }

    void register();
    return () => {
      cancelled = true;
    };
  }, [enabled, isSignedIn, preferences?.pushEnabled, registerPushToken, setPushEnabled]);
}
