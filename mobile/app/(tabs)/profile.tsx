import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { useAuth, useUser } from "../../src/auth";
import { useLanguage } from "../../src/i18n";
import { resources } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";

export default function ProfileScreen() {
  const { locale, setLocale, t } = useLanguage();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { savedIds } = useSavedResources();
  const displayName = user?.fullName ?? user?.firstName ?? (locale === "sw" ? "Mgeni" : "Guest");
  const contact = user?.primaryEmailAddress?.emailAddress ?? (locale === "sw" ? "Hujaingia" : "Not signed in");
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "HY";
  const savedResources = savedIds.map((id) => resources.find((resource) => resource.id === id)).filter((resource) => resource !== undefined);

  return (
    <Screen>
      <Text style={styles.title}>{t("profile")}</Text>
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{contact}</Text>
          <Text style={styles.badge}>{isSignedIn ? (locale === "sw" ? "Akaunti salama imewashwa" : "Secure account active") : (locale === "sw" ? "Mgeni: rasilimali za umma pekee" : "Guest: public resources only")}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.row} onPress={() => router.push("/(tabs)/cases")}><Ionicons name="briefcase-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Kesi na maombi yangu" : "My cases and requests"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => void setLocale(locale === "sw" ? "en" : "sw")}><Ionicons name="language-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Lugha: Kiswahili" : "Language: English"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/offline")}><Ionicons name="cloud-offline-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Nje ya mtandao" : "Offline mode"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/documents")}><Ionicons name="document-text-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Nyaraka zangu" : "My documents"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/appointments")}><Ionicons name="calendar-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Miadi yangu" : "My appointments"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/privacy-security")}><Ionicons name="shield-checkmark-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Faragha na usalama" : "Privacy and security"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/support")}><Ionicons name="help-circle-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Msaada" : "Help and support"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/about")}><Ionicons name="information-circle-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Kuhusu Haki Yangu" : "About Haki Yangu"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
      </View>
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Miongozo uliyohifadhi" : "Saved guides"}</Text>
      <View style={styles.savedCard}>
        {savedResources.length ? savedResources.map((resource) => (
          <Pressable key={resource.id} style={styles.savedRow} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}>
            <Ionicons name={resource.icon} size={22} color={colors.burgundy} />
            <Text style={styles.rowText}>{resource.title[locale]}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        )) : <Text style={styles.emptySaved}>{locale === "sw" ? "Bado hujahifadhi mwongozo. Fungua Learn kisha hifadhi mwongozo." : "No saved guides yet. Open Learn and save a guide."}</Text>}
      </View>
      <Pressable accessibilityRole="button" onPress={() => isSignedIn ? void signOut() : router.push("/sign-in")} style={styles.secureButton}>
        <Ionicons name={isSignedIn ? "log-out-outline" : "lock-closed-outline"} size={18} color={colors.burgundy} />
        <Text style={styles.secureText}>{isSignedIn ? (locale === "sw" ? "Ondoka kwenye akaunti" : "Sign out") : (locale === "sw" ? "Ingia kwenye akaunti salama" : "Sign in to secure account")}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 30, marginTop: spacing.lg, marginBottom: spacing.xl },
  identity: { flexDirection: "row", gap: spacing.md, alignItems: "center", marginBottom: spacing.xl },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: type.bold, color: colors.surface, fontSize: 21 },
  identityCopy: { flex: 1, gap: 3 },
  name: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18 },
  email: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, marginTop: spacing.xs },
  badge: { alignSelf: "flex-start", overflow: "hidden", marginTop: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.softPink, paddingHorizontal: spacing.sm, paddingVertical: 4, fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.xl },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  rowText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 14 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 54 },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17, marginBottom: spacing.md },
  savedCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.xl, overflow: "hidden" },
  savedRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  emptySaved: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", padding: spacing.lg },
  secureButton: { marginTop: spacing.md, marginBottom: spacing.xl, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.sm },
  secureText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
});
