import { plainError } from "../../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAction } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { api } from "../backend/api";
import { useAuth } from "../auth";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
import { Button } from "./Button";

export function DeleteAccount() {
  const { isSignedIn, signOut } = useAuth();
  const sw = useLanguage().locale === "sw";
  const remove = useAction(api.accountDeletion.deleteMyAccount);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!isSignedIn) return null;
  async function deleteAccount() {
    if (busy || confirmation !== "DELETE") return;
    setBusy(true); setError("");
    try {
      const result = await remove({ confirmation: "DELETE" });
      Alert.alert(sw ? "Ufikiaji wa akaunti umefungwa" : "Account access closed", result.deleted
        ? (sw ? "Akaunti yako ya kuingia imefutwa. Rekodi za kesi na historia ya mabadiliko zimehifadhiwa." : "Your login has been deleted. Case and audit records have been retained.")
        : (sw ? "Ufikiaji wako umefungwa. Kufuta akaunti ya kuingia kunaendelea; wasiliana na LSF ikiwa una matatizo." : "Your access is closed. Login deletion is still processing; contact LSF if you have trouble."));
      try { await signOut(); } finally { router.replace("/(tabs)"); }
    } catch (cause) { setError(plainError(cause, sw ? "sw" : "en", sw ? "Akaunti haijafutwa. Jaribu tena." : "Account deletion did not finish. Try again.")); }
    finally { setBusy(false); }
  }
  function confirm() {
    Alert.alert(sw ? "Futa akaunti yako?" : "Delete your account?", sw ? "Hutaweza kuingia kwa akaunti hii tena. Rekodi za kesi na historia ya mabadiliko hazitafutwa." : "You will no longer be able to sign in with this account. Case and audit records will not be deleted.", [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" },
      { text: sw ? "Futa akaunti" : "Delete account", style: "destructive", onPress: () => void deleteAccount() },
    ]);
  }
  return <View style={styles.section}>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} disabled={busy} style={styles.toggle} onPress={() => { setOpen(!open); setConfirmation(""); setError(""); }}><Ionicons name="settings-outline" size={20} color={colors.inkMuted} /><Text style={styles.title}>{sw ? "Usimamizi wa akaunti" : "Account management"}</Text><Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.inkMuted} /></Pressable>
    {open ? <View style={styles.content}>
      <Text style={styles.title}>{sw ? "Futa akaunti" : "Delete account"}</Text>
      <Text style={styles.body}>{sw ? "Akaunti yako ya kuingia na ufikiaji vitafutwa kabisa. LSF itabaki na rekodi za kesi na historia ya mabadiliko. Andika DELETE kuthibitisha kufuta akaunti." : "Your login and access will be permanently removed. LSF will retain case and audit records. Type DELETE to confirm."}</Text>
      <TextInput accessibilityLabel={sw ? "Andika DELETE" : "Type DELETE"} value={confirmation} onChangeText={setConfirmation} editable={!busy} autoCapitalize="characters" autoCorrect={false} style={styles.input} />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Button label={sw ? "Futa akaunti" : "Delete account"} loading={busy} disabled={busy || confirmation !== "DELETE"} onPress={confirm} />
    </View> : null}
  </View>;
}
const styles = StyleSheet.create({
  section: { marginTop: 24, borderTopWidth: 1, borderTopColor: colors.line },
  toggle: { flexDirection: "row", gap: 10, minHeight: 56, alignItems: "center" },
  title: { fontFamily: type.semibold, fontSize: 16, color: colors.ink, flexShrink: 1 },
  content: { gap: 12, paddingBottom: 20 },
  body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 12, fontFamily: type.regular, color: colors.ink },
  error: { fontFamily: type.regular, fontSize: 14, color: colors.danger },
});
