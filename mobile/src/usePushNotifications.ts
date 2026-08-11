import { useAuth } from "./auth";
import { useMutation } from "convex/react";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { api } from "./backend/api";
import { appConfig } from "./config";

export function usePushNotificationRegistration(enabled: boolean) {
  const { isSignedIn } = useAuth();
  const registerPushToken = useMutation(api.notifications.registerPushToken);

  useEffect(() => {
    if (!enabled || !isSignedIn || !appConfig.easProjectId) return;
    let cancelled = false;

    async function register() {
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("case-updates", {
            name: "Case updates",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const current = await Notifications.getPermissionsAsync();
        const finalStatus = current.granted
          ? current.status
          : (await Notifications.requestPermissionsAsync()).status;
        if (finalStatus !== "granted" || cancelled) return;

        const token = await Notifications.getExpoPushTokenAsync({
          projectId: appConfig.easProjectId,
        });
        if (cancelled) return;
        await registerPushToken({
          token: token.data,
          platform: Platform.OS,
          projectId: appConfig.easProjectId,
        });
      } catch (error) {
        console.warn("Push notification registration failed", error);
      }
    }

    void register();
    return () => {
      cancelled = true;
    };
  }, [enabled, isSignedIn, registerPushToken]);
}
