import { BrandLoadingMark } from './BrandLoading';
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../auth";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
import { useSafeSignOut } from "../useSafeSignOut";

export function LogOutButton() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const signOut = useSafeSignOut();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  if (!isSignedIn) return null;
  async function logOut() {
    if (busy) return;
    setBusy(true); setError(false);
    try { await signOut(); router.replace("/(tabs)"); }
    catch { setError(true); }
    finally { setBusy(false); }
  }
  return <View>
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={() => void logOut()} style={styles.button}>
      {busy ? <BrandLoadingMark small/> : <Ionicons name="log-out-outline" size={20} color={colors.burgundy} />}
      <Text style={styles.label}>{busy ? (locale === "sw" ? "Unatoka..." : "Logging out...") : (locale === "sw" ? "Toka kwenye akaunti" : "Log out")}</Text>
    </Pressable>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{locale === "sw" ? "Hatukuweza kutoka. Angalia mtandao na ujaribu tena." : "Could not log out. Check your connection and try again."}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  button: { minHeight: 48, flexDirection: "row", gap: 10, alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 14, marginVertical: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 8 },
  label: { fontFamily: type.semibold, fontSize: 15, color: colors.burgundy },
  error: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.burgundy },
});
