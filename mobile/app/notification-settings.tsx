import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { type NotificationCategory, useNotificationPreferences } from "../src/useNotificationPreferences";
import { colors, radius, spacing, type } from "../src/theme";
import { appConfig } from "../src/config";
import { useAuth } from "../src/auth";

const categories: Array<{ key: NotificationCategory; icon: keyof typeof Ionicons.glyphMap; sw: string; en: string; swHelp: string; enHelp: string }> = [
  { key: "cases", icon: "briefcase-outline", sw: "Kesi na maombi", en: "Cases and requests", swHelp: "Hatua, hali, na mabadiliko ya kesi.", enHelp: "Case steps, status, and assignment changes." },
  { key: "messages", icon: "chatbubble-outline", sw: "Ujumbe", en: "Messages", swHelp: "Ujumbe kutoka timu yako ya kesi.", enHelp: "Messages from your case team." },
  { key: "appointments", icon: "calendar-outline", sw: "Miadi", en: "Appointments", swHelp: "Miadi iliyopangwa au kuombwa.", enHelp: "Scheduled or requested appointments." },
  { key: "documents", icon: "document-text-outline", sw: "Nyaraka", en: "Documents", swHelp: "Mapitio na maombi kuhusu nyaraka.", enHelp: "Document reviews and document requests." },
  { key: "service", icon: "megaphone-outline", sw: "Huduma", en: "Service", swHelp: "Taarifa za akaunti na msaada.", enHelp: "Account and support updates." },
];

export default function NotificationSettingsScreen() {
  const { locale } = useLanguage();
  const { isSignedIn } = useAuth();
  const { hydrated, preferences, pushEnabled, updatePreference, updatePushEnabled } = useNotificationPreferences();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pushAvailable = Platform.OS !== "web" && Boolean(appConfig.easProjectId);

  async function changePush(enabled: boolean) {
    setBusy(true);
    setError("");
    try { await updatePushEnabled(enabled); }
    catch (caught) {
      const denied = caught instanceof Error && caught.message.includes("permission");
      setError(denied
        ? (locale === "sw" ? "Kifaa hakijaruhusu arifa. Badili ruhusa kwenye mipangilio ya kifaa." : "Notifications are not allowed. Change permission in your device settings.")
        : (locale === "sw" ? "Hatukuweza kuthibitisha mabadiliko ya arifa. Angalia mipangilio kabla ya kujaribu tena." : "We could not confirm the alert changes. Check the settings before retrying."));
    }
    finally { setBusy(false); }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Mipangilio ya arifa" : "Notification settings"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.hero}>
        <Ionicons name="notifications-outline" size={34} color={colors.burgundy} />
        <View style={styles.heroCopy}>
          <Text style={styles.title}>{locale === "sw" ? "Chagua arifa muhimu" : "Choose what matters"}</Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "Taarifa zitaendelea kuonekana ndani ya programu. Chagua kama kifaa hiki kipokee arifa nje ya programu."
              : "Updates remain in the app. Choose whether this device receives alerts outside it."}
          </Text>
        </View>
      </View>
      {!isSignedIn ? <Text style={[styles.rowHelp, { marginTop: spacing.md }]}>{locale === "sw" ? "Ingia ili kuhifadhi mipangilio ya arifa kwenye akaunti yako." : "Sign in to save notification settings to your account."}</Text> : null}

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconChip}><Ionicons name="phone-portrait-outline" size={21} color={colors.burgundy} /></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>{locale === "sw" ? "Arifa nje ya programu" : "Alerts outside the app"}</Text>
            <Text style={styles.rowHelp}>{!pushAvailable
              ? (locale === "sw" ? "Hazipatikani kwenye toleo hili la programu." : "Unavailable in this app build.")
              : (locale === "sw" ? "Kifaa kitaomba ruhusa. Maombi yaliyowekwa “ndani ya programu pekee” au “usiwasiliane nami” hayataleta arifa nje ya programu." : "Your device will ask permission. In-app-only and do-not-contact requests will not trigger alerts outside the app.")}</Text>
          </View>
          <Switch accessibilityLabel={locale === "sw" ? "Arifa nje ya programu" : "Alerts outside the app"} value={pushEnabled} disabled={!isSignedIn || !hydrated || !pushAvailable || busy} onValueChange={(value) => void changePush(value)} trackColor={{ false: "#D8D8D8", true: "#E8B8CC" }} thumbColor={pushEnabled ? colors.burgundy : colors.surface} />
        </View>
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.rowHelp}>{error}</Text> : null}

      <Text style={[styles.rowHelp, { marginTop: spacing.lg }]}>{locale === "sw" ? "Aina za arifa za nje ya programu. Kuzima aina hakufuti taarifa kwenye kikasha chako." : "External alert categories. Turning one off does not remove updates from your inbox."}</Text>
      <View style={styles.card}>
        {categories.map((category, index) => (
          <View key={category.key}>
            <View style={styles.row}>
              <View style={styles.iconChip}>
                <Ionicons name={category.icon} size={21} color={colors.burgundy} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.rowTitle}>{category[locale]}</Text>
                <Text style={styles.rowHelp}>{locale === "sw" ? category.swHelp : category.enHelp}</Text>
              </View>
              <Switch
                value={preferences[category.key]}
                disabled={!isSignedIn || !hydrated || busy}
                onValueChange={(value) => void updatePreference(category.key, value).catch(() => setError(locale === "sw" ? "Imeshindikana kuhifadhi mpangilio." : "Could not save this setting."))}
                trackColor={{ false: "#D8D8D8", true: "#E8B8CC" }}
                thumbColor={preferences[category.key] ? colors.burgundy : colors.surface}
              />
            </View>
            {index < categories.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, backgroundColor: colors.softPink, borderRadius: radius.md, padding: spacing.lg },
  heroCopy: { flex: 1 },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 20, lineHeight: 26 },
  body: { marginTop: spacing.xs, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  card: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: "hidden" },
  row: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  iconChip: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  rowTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  rowHelp: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 70 },
});
