import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { router, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import { notificationTapKey } from "./notificationTap";
export function useNotificationNavigation(ready: boolean) {
  const navigation = useRootNavigationState();
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (Platform.OS === "web" || !ready || !navigation?.key) return;
    let active = true;
    function open(response: Notifications.NotificationResponse | null) {
      const key = notificationTapKey(response, Notifications.DEFAULT_ACTION_IDENTIFIER);
      if (!active || !key || handled.current === key) return;
      handled.current = key;
      // The inbox query enforces account ownership; it resolves resource access on tap.
      // Do not follow external URLs or mark a message as read from an OS tap alone.
      router.push("/notifications");
      void Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
    }
    const listener = Notifications.addNotificationResponseReceivedListener(open);
    void Notifications.getLastNotificationResponseAsync().then(open).catch(() => undefined);
    return () => { active = false; listener.remove(); };
  }, [ready, navigation?.key]);
}
