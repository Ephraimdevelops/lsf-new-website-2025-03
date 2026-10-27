import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useUser } from "./auth";
import { api } from "./backend/api";
import { useLanguage } from "./i18n";
import { useAccountSync } from "./useStoreUserEffect";

export function usePersonalIdentity() {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const { ready } = useAccountSync();
  const { locale } = useLanguage();
  const profile = useQuery(api.users.current, isAuthenticated && ready ? {} : "skip");
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const refresh = () => setHour(new Date().getHours());
    const timer = setInterval(refresh, 60000);
    const subscription = AppState.addEventListener("change", state => { if (state === "active") refresh(); });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  const name = profile?.name?.trim() || user?.fullName?.trim() || user?.firstName?.trim() || user?.username?.trim() || "";
  const firstName = name.split(/\s+/)[0];
  const imageUrl = profile?.imageUrl || user?.imageUrl;
  const isClerkPlaceholder = imageUrl === user?.imageUrl && user?.hasImage === false;
  const salutation = locale === "sw"
    ? (hour < 12 ? "Habari za asubuhi" : hour < 17 ? "Habari za mchana" : "Habari za jioni")
    : (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  return {
    name,
    imageUrl: isClerkPlaceholder ? undefined : imageUrl,
    initials: name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase(),
    greeting: firstName ? `${salutation}, ${firstName}` : salutation,
  };
}
