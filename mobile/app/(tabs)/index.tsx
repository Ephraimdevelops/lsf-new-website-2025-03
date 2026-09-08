import { useAuth, useUser } from "../../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { Screen } from "../../src/components/Screen";
import { caseStatusLabels } from "../../src/caseLabels";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

const primaryActions = [
  { key: "findHelp", label: { sw: "Tafuta msaada", en: "Find Help" }, meta: { sw: "Pata huduma sahihi au paralegal karibu nawe.", en: "Find the right legal or public service for your situation." }, icon: "compass-outline", route: "/find-services", accent: colors.burgundy, selected: true },
  { key: "askSaada", label: { sw: "Uliza Saada", en: "Ask Saada" }, meta: { sw: "Pata majibu wazi kutoka kwa msaidizi wa sheria.", en: "Get clear answers from our AI legal assistant." }, icon: "chatbubble-ellipses-outline", route: "/sara", accent: colors.burgundy, selected: false },
  { key: "requestHelp", label: { sw: "Omba msaada", en: "Request help" }, meta: { sw: "Wasilisha tatizo lako upate msaada sahihi.", en: "Submit your legal issue and get the right help." }, icon: "document-text-outline", route: "/intake", accent: colors.orange, selected: false },
  { key: "knowRights", label: { sw: "Jua haki zako", en: "Know your rights" }, meta: { sw: "Soma miongozo rahisi ya haki zako.", en: "Explore simple guides to understand your rights." }, icon: "shield-checkmark-outline", route: "/(tabs)/learn", accent: colors.orange, selected: false },
] as const;

const quickTools = [
  { label: { sw: "Kagua hati", en: "Document check" }, icon: "scan-outline", route: "/document-checker" },
  { label: { sw: "Barua ya madai", en: "Demand letter" }, icon: "create-outline", route: "/letter-builder" },
  { label: { sw: "Nyaraka", en: "My documents" }, icon: "folder-open-outline", route: "/documents" },
  { label: { sw: "Huduma", en: "Find a service" }, icon: "business-outline", route: "/find-services" },
  { label: { sw: "Miadi" , en: "My appointments" }, icon: "calendar-outline", route: "/appointments" },
  { label: { sw: "Jifunze", en: "Learn" }, icon: "book-outline", route: "/(tabs)/learn" },
] as const;

export default function HomeScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { locale, t } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const activeCase = cases?.find((item) => !["closed", "closed_unresolved"].includes(item.status));
  const displayName = user?.firstName ? `${t("greeting")}, ${user.firstName}` : locale === "sw" ? "Habari, Asha" : "Hello, Asha";

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        {user?.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}><Text style={styles.avatarText}>{user?.firstName?.[0] ?? "A"}</Text></View>
        )}
        <View style={styles.headerCopy}>
          <Text style={styles.greeting}>{displayName}{locale === "sw" ? "" : " 👋"}</Text>
          <Text style={styles.subheading}>{locale === "sw" ? "Tunawezaje kukusaidia leo?" : "How can we help you today?"}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Arifa" : "Notifications"} onPress={() => router.push("/notifications")} style={styles.bell}>
          <Ionicons name="notifications-outline" size={24} color={colors.charcoal} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <View style={styles.primaryGrid}>
        {primaryActions.map((action) => (
          <Pressable key={action.key} style={[styles.primaryAction, action.selected && styles.primaryActionSelected]} onPress={() => router.push(action.route)}>
            <View style={styles.primaryIcon}>
              <Ionicons name={action.icon} size={26} color={action.accent} />
            </View>
            <Text style={styles.primaryActionText}>{action.label[locale]}</Text>
            <Text style={styles.primaryActionMeta}>{action.meta[locale]}</Text>
            <View style={[styles.cardArrow, action.selected ? styles.cardArrowSelected : styles.cardArrowMuted]}>
              <Ionicons name="arrow-forward" size={18} color={action.selected ? colors.surface : action.accent} />
            </View>
          </Pressable>
        ))}
      </View>

      {activeCase ? (
        <Pressable style={styles.requestCard} onPress={() => router.push({ pathname: "/case/[id]", params: { id: activeCase._id } })}>
          <View style={styles.requestIconWrap}>
            <Ionicons name="briefcase-outline" size={24} color={colors.burgundy} />
          </View>
          <View style={styles.requestCopy}>
            <Text style={styles.requestTitle}>{activeCase.publicId}</Text>
            <Text style={styles.requestMeta}>{caseStatusLabels[locale][activeCase.status]}</Text>
            <Text style={styles.requestBody} numberOfLines={2}>{activeCase.summary}</Text>
          </View>
          <View style={styles.requestArt}><Ionicons name="scale-outline" size={42} color="#E9B9C8" /></View>
        </Pressable>
      ) : (
        <Pressable style={styles.requestCard} onPress={() => router.push("/intake")}>
          <View style={styles.requestIconWrap}>
            <Ionicons name="clipboard-outline" size={24} color={colors.burgundy} />
          </View>
          <View style={styles.requestCopy}>
            <Text style={styles.requestTitle}>{locale === "sw" ? "Hakuna ombi linaloendelea" : "No active request yet"}</Text>
            <Text style={styles.requestBody}>{locale === "sw" ? "Bado hujawasilisha ombi. Tuko hapa unapohitaji msaada." : "You haven't submitted any requests. We're here when you need us."}</Text>
          </View>
          <View style={styles.requestArt}><Ionicons name="scale-outline" size={42} color="#E9B9C8" /></View>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>{locale === "sw" ? "Zana za haraka" : "Quick tools"}</Text>
      <View style={styles.quickGrid}>
        <Pressable style={styles.quickTool} onPress={() => router.push("/document-checker")}>
          <View style={styles.quickIcon}><Ionicons name="scan-outline" size={22} color={colors.burgundy} /></View>
          <Text style={styles.quickToolText}>{quickTools[0].label[locale]}</Text>
        </Pressable>
        <Pressable style={styles.quickTool} onPress={() => router.push("/letter-builder")}>
          <View style={styles.quickIcon}><Ionicons name="create-outline" size={22} color={colors.burgundy} /></View>
          <Text style={styles.quickToolText}>{quickTools[1].label[locale]}</Text>
        </Pressable>
        <Pressable style={styles.quickTool} onPress={() => router.push("/documents")}>
          <View style={styles.quickIcon}><Ionicons name="folder-open-outline" size={22} color={colors.burgundy} /></View>
          <Text style={styles.quickToolText}>{quickTools[2].label[locale]}</Text>
        </Pressable>
        <Pressable style={styles.quickTool} onPress={() => router.push("/appointments")}>
          <View style={styles.quickIcon}><Ionicons name="calendar-outline" size={22} color={colors.burgundy} /></View>
          <Text style={styles.quickToolText}>{quickTools[4].label[locale]}</Text>
        </Pressable>
        <Pressable style={styles.quickTool} onPress={() => router.push("/find-services")}>
          <View style={styles.quickIcon}><Ionicons name="business-outline" size={22} color={colors.burgundy} /></View>
          <Text style={styles.quickToolText}>{quickTools[3].label[locale]}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl + spacing.xs },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F1D8DD" },
  avatarFallback: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F1D8DD", alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 24 },
  headerCopy: { flex: 1, gap: 3 },
  greeting: { fontFamily: type.bold, color: colors.charcoal, fontSize: 22, letterSpacing: -0.6 },
  subheading: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 20 },
  bell: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", position: "relative" },
  bellDot: { position: "absolute", top: 8, right: 8, width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.burgundy },
  primaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  primaryAction: { width: "47%", minHeight: 164, borderRadius: 24, backgroundColor: "#FFFAF7", borderWidth: 1, borderColor: "#F1E2E8", padding: spacing.lg, justifyContent: "space-between" },
  primaryActionSelected: { borderColor: colors.burgundy, shadowColor: colors.burgundy, shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  primaryIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, borderWidth: 1, borderColor: "#F3E7EB", alignItems: "center", justifyContent: "center" },
  primaryActionText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, lineHeight: 22, letterSpacing: -0.4 },
  primaryActionMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, paddingRight: spacing.sm },
  cardArrow: { alignSelf: "flex-end", width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  cardArrowSelected: { backgroundColor: colors.burgundy },
  cardArrowMuted: { backgroundColor: "#FBE8E0" },
  requestCard: { marginTop: spacing.xl, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.md },
  requestIconWrap: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  requestCopy: { flex: 1, gap: 5 },
  requestTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 16, lineHeight: 20 },
  requestMeta: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  requestBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 19 },
  requestArt: { width: 58, alignItems: "center", justifyContent: "center", opacity: 0.9 },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, marginTop: spacing.xl + spacing.sm, marginBottom: spacing.md },
  quickGrid: { flexDirection: "row", gap: spacing.sm },
  quickTool: { flex: 1, minHeight: 98, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xs, gap: spacing.sm },
  quickIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  quickToolText: { fontFamily: type.medium, color: colors.charcoal, fontSize: 11, textAlign: "center", lineHeight: 15 },
});
