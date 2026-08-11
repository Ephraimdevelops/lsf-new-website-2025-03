import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { type NotificationCategory, useNotificationPreferences } from "../src/useNotificationPreferences";
import { colors, radius, spacing, type } from "../src/theme";

const categories: Array<{ key: NotificationCategory; icon: keyof typeof Ionicons.glyphMap; sw: string; en: string; swHelp: string; enHelp: string }> = [
  { key: "cases", icon: "briefcase-outline", sw: "Kesi na maombi", en: "Cases and requests", swHelp: "Hatua, hali, na mabadiliko ya kesi.", enHelp: "Case steps, status, and assignment changes." },
  { key: "messages", icon: "chatbubble-outline", sw: "Ujumbe", en: "Messages", swHelp: "Ujumbe kutoka timu yako ya kesi.", enHelp: "Messages from your case team." },
  { key: "appointments", icon: "calendar-outline", sw: "Miadi", en: "Appointments", swHelp: "Miadi iliyopangwa au kuombwa.", enHelp: "Scheduled or requested appointments." },
  { key: "documents", icon: "document-text-outline", sw: "Nyaraka", en: "Documents", swHelp: "Mapitio na maombi kuhusu nyaraka.", enHelp: "Document reviews and document requests." },
  { key: "service", icon: "megaphone-outline", sw: "Huduma", en: "Service", swHelp: "Taarifa za mfumo na usaidizi.", enHelp: "System and support notices." },
];

export default function NotificationSettingsScreen() {
  const { locale } = useLanguage();
  const { preferences, updatePreference } = useNotificationPreferences();

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
              ? "Mipangilio hii inadhibiti arifa zinazoonekana ndani ya app hii. Arifa muhimu za usalama zinaweza kuendelea kuonekana."
              : "These settings control what appears inside this app. Critical safety notices may still appear."}
          </Text>
        </View>
      </View>

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
                onValueChange={(value) => void updatePreference(category.key, value)}
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
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, backgroundColor: colors.softPink, borderRadius: radius.md, padding: spacing.lg },
  heroCopy: { flex: 1 },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 20, lineHeight: 26 },
  body: { marginTop: spacing.xs, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  card: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: "hidden" },
  row: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  iconChip: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  rowTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  rowHelp: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 70 },
});
