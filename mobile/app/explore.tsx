import Ionicons from "@expo/vector-icons/Ionicons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../src/components/AppHeader";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

type Destination = {
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  sw: string;
  en: string;
  detailSw: string;
  detailEn: string;
  private?: boolean;
};

const groups: { sw: string; en: string; stepsSw: string; stepsEn: string; destinations: Destination[] }[] = [
  {
    sw: "Safari ya mnufaika", en: "Beneficiary journey",
    stepsSw: "Tafuta msaada → omba msaada → fuatilia → pata hatua inayofuata",
    stepsEn: "Find Help → Request Help → track progress → next step",
    destinations: [
      { route: "/find-services", icon: "search-outline", sw: "Tafuta Msaada", en: "Find Help", detailSw: "Anza na tatizo lako", detailEn: "Start with your issue" },
      { route: "/saved-services", icon: "bookmark-outline", sw: "Msaada uliohifadhi", en: "Saved Help", detailSw: "Orodha na mipango yako hulindwa", detailEn: "Your saved list and plans are private", private: true },
      { route: "/service-visit", icon: "calendar-outline", sw: "Safari ya huduma", en: "Service visit", detailSw: "Panga na fuatilia ziara", detailEn: "Plan and follow up a visit", private: true },
      { route: "/paralegals", icon: "people-outline", sw: "Paralegal", en: "Paralegals", detailSw: "Tafuta msaada wa jamii", detailEn: "Find community legal help" },
      { route: "/intake", icon: "document-text-outline", sw: "Omba Msaada", en: "Request Help", detailSw: "Hatua nane hadi kukagua ombi", detailEn: "Eight steps through request review" },
      { route: "/(tabs)/cases", icon: "folder-outline", sw: "Maombi na kesi", en: "Requests and cases", detailSw: "Historia binafsi inahitaji akaunti", detailEn: "Personal history requires an account", private: true },
      { route: "/(tabs)/help", icon: "chatbubbles-outline", sw: "Ujumbe", en: "Messages", detailSw: "Mazungumzo ya kesi hulindwa", detailEn: "Case conversations are protected", private: true },
      { route: "/documents", icon: "folder-open-outline", sw: "Nyaraka", en: "Documents", detailSw: "Faili zako hulindwa", detailEn: "Your files are protected", private: true },
      { route: "/appointments", icon: "time-outline", sw: "Miadi", en: "Appointments", detailSw: "Miadi yako hulindwa", detailEn: "Your appointments are protected", private: true },
      { route: "/notifications", icon: "notifications-outline", sw: "Arifa", en: "Notifications", detailSw: "Taarifa zako hulindwa", detailEn: "Your updates are protected", private: true },
    ],
  },
  {
    sw: "Haki Yangu AI na maarifa", en: "Haki Yangu AI and knowledge",
    stepsSw: "Uliza → jifunze → kagua hati → andaa hatua",
    stepsEn: "Ask → learn → check a document → prepare an action",
    destinations: [
      { route: "/sara", icon: "chatbubble-ellipses-outline", sw: "Haki Yangu AI", en: "Haki Yangu AI", detailSw: "Tazama mazungumzo; kutuma swali kunahitaji akaunti", detailEn: "See chat; sending a question requires an account", private: true },
      { route: "/(tabs)/learn", icon: "book-outline", sw: "Jua Haki Zako", en: "Know Your Rights", detailSw: "Soma miongozo inayopatikana", detailEn: "Read available guides" },
      { route: "/document-checker", icon: "scan-outline", sw: "Kagua hati", en: "Check a document", detailSw: "Angalia zana ya hati", detailEn: "Explore the document tool" },
      { route: "/letter-builder", icon: "create-outline", sw: "Andaa barua", en: "Build a letter", detailSw: "Andika na kagua rasimu", detailEn: "Draft and review a letter" },
      { route: "/safety", icon: "shield-checkmark-outline", sw: "Vidokezo vya usalama", en: "Safety tips", detailSw: "Msaada wa awali wa usalama", detailEn: "First steps for safety" },
    ],
  },
  {
    sw: "Paralegal na taasisi", en: "Paralegal and organisation",
    stepsSw: "Tuma maombi → uthibitishwe → fanya kazi → fuatilia matokeo",
    stepsEn: "Apply → get verified → work cases → track impact",
    destinations: [
      { route: "/paralegal-onboarding", icon: "ribbon-outline", sw: "Kujiunga kwa paralegal", en: "Paralegal onboarding", detailSw: "Maombi na hali ya uthibitishaji", detailEn: "Application and approval status", private: true },
      { route: "/paralegal-learning", icon: "book-outline", sw: "Kituo cha kujifunza", en: "Learning hub", detailSw: "Miongozo iliyopitiwa na msaada wa kazi", detailEn: "Reviewed guides and work support", private: false },
      { route: "/workspace", icon: "briefcase-outline", sw: "Sehemu ya kazi", en: "Workspace", detailSw: "Kazi halisi zinahitaji jukumu lililoidhinishwa", detailEn: "Real work requires an approved role", private: true },
      { route: "/paralegal-tasks", icon: "checkbox-outline", sw: "Kazi zangu", en: "My tasks", detailSw: "Kazi za kesi na tarehe za kufuatilia", detailEn: "Case tasks and follow-up dates", private: true },
      { route: "/paralegal-assignments", icon: "folder-open-outline", sw: "Kesi nilizopewa", en: "My assignments", detailSw: "Ofa mpya na kesi zinazoendelea", detailEn: "New offers and active cases", private: true },
      { route: "/paralegal-availability", icon: "calendar-outline", sw: "Upatikanaji", en: "Availability", detailSw: "Hali, saa na uwezo wa kazi", detailEn: "Status, hours and capacity", private: true },
      { route: "/my-organisation", icon: "business-outline", sw: "Taasisi yangu", en: "My organisation", detailSw: "Taarifa za ndani za taasisi", detailEn: "Private organisation details", private: true },
      { route: "/provider-referrals", icon: "git-compare-outline", sw: "Rufaa nilizopokea", en: "Incoming referrals", detailSw: "Pitia na jibu rufaa zilizokubaliwa", detailEn: "Review and respond to consented referrals", private: true },
      { route: "/paralegal-performance", icon: "stats-chart-outline", sw: "Matokeo", en: "Performance", detailSw: "Vipimo vya kazi binafsi", detailEn: "Personal work metrics", private: true },
      { route: "/paralegal-support", icon: "heart-outline", sw: "Msaada wa paralegal", en: "Paralegal support", detailSw: "Ustawi na usimamizi", detailEn: "Wellbeing and supervision", private: true },
      { route: "/paralegal-wellbeing", icon: "heart-circle-outline", sw: "Ustawi na usimamizi", en: "Wellbeing and supervision", detailSw: "Chagua msaada wa kazi unaofaa", detailEn: "Choose the right work support", private: false },
    ],
  },
  {
    sw: "LSF na utawala", en: "LSF and governance",
    stepsSw: "Triage → ulinzi → idhini → maarifa → ripoti",
    stepsEn: "Triage → safeguarding → approvals → knowledge → reporting",
    destinations: [
      { route: "/operations", icon: "file-tray-full-outline", sw: "Uendeshaji", en: "Operations", detailSw: "Foleni ya maombi na kesi", detailEn: "Request and case queue", private: true },
      { route: "/referral-oversight", icon: "git-compare-outline", sw: "Usimamizi wa rufaa", en: "Referral oversight", detailSw: "Ridhaa, majibu na ushahidi", detailEn: "Consent, responses and evidence", private: true },
      { route: "/supervision", icon: "shield-checkmark-outline", sw: "Usimamizi na ubora", en: "Supervision & quality", detailSw: "Mapitio, ofa na kesi zilizo wazi", detailEn: "Reviews, offers and open cases", private: true },
      { route: "/matching-review", icon: "git-network-outline", sw: "Mapitio ya ulinganishaji", en: "Matching review", detailSw: "Sababu, tahadhari na uamuzi", detailEn: "Reasons, safety flags and decision", private: true },
      { route: "/partner-performance", icon: "stats-chart-outline", sw: "Utendaji wa washirika", en: "Partner performance", detailSw: "Majibu na rufaa zilizochelewa", detailEn: "Responses and overdue referrals", private: true },
      { route: "/safeguarding", icon: "shield-outline", sw: "Ulinzi", en: "Safeguarding", detailSw: "Kesi nyeti zinalindwa", detailEn: "Sensitive cases are protected", private: true },
      { route: "/governance", icon: "people-circle-outline", sw: "Idhini na ufikiaji", en: "Access and approvals", detailSw: "Majukumu na uamuzi wa idhini", detailEn: "Roles and approval decisions", private: true },
      { route: "/directory-management", icon: "business-outline", sw: "Orodha ya huduma", en: "Service directory", detailSw: "Uthibitishaji wa huduma", detailEn: "Service verification", private: true },
      { route: "/saada-governance", icon: "library-outline", sw: "Utawala wa Haki Yangu AI", en: "Haki Yangu AI governance", detailSw: "Vyanzo na majibu ya hatari", detailEn: "Sources and flagged answers", private: true },
      { route: "/editorial-workspace", icon: "book-outline", sw: "Uhariri wa miongozo", en: "Guide editorial", detailSw: "Chanzo, rasimu na idhini huru", detailEn: "Sources, drafts and independent approval", private: true },
      { route: "/reporting", icon: "bar-chart-outline", sw: "Ripoti", en: "Reporting", detailSw: "Taarifa za athari", detailEn: "Impact reports", private: true },
      { route: "/audit-log", icon: "list-outline", sw: "Rekodi za ukaguzi", en: "Audit log", detailSw: "Historia ya hatua muhimu", detailEn: "History of important actions", private: true },
    ],
  },
];

export default function ExploreScreen() {
  const { locale } = useLanguage();
  const sw = locale === "sw";
  return <Screen>
    <AppHeader back title={sw ? "Angalia programu" : "Explore the app"} eyebrow="HAKI YANGU" />
    <View style={styles.hero}><Text style={styles.heroTitle}>{sw ? "Safari zote. Mahali pamoja." : "Every journey, one place."}</Text><Text style={styles.heroBody}>{sw ? "Fungua skrini za programu bila kuingia. Taarifa binafsi na kazi za wafanyakazi hubaki salama hadi mtu mwenye ruhusa aingie." : "Open app screens without signing in. Personal records and staff work stay protected until an authorised user signs in."}</Text></View>
    {groups.map((group) => <View key={group.en} style={styles.group}>
      <Text style={styles.groupTitle}>{sw ? group.sw : group.en}</Text>
      <Text style={styles.steps}>{sw ? group.stepsSw : group.stepsEn}</Text>
      <View style={styles.list}>{group.destinations.map((item) => <Pressable key={String(item.route)} accessibilityRole="button" style={styles.row} onPress={() => router.push(item.route)}>
        <View style={styles.icon}><Ionicons name={item.icon} size={21} color={colors.burgundy} /></View>
        <View style={styles.copy}><Text style={styles.rowTitle}>{sw ? item.sw : item.en}</Text><Text style={styles.rowBody}>{sw ? item.detailSw : item.detailEn}</Text></View>
        {item.private ? <Ionicons name="lock-closed-outline" size={15} color={colors.inkMuted} /> : null}
        <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
      </Pressable>)}</View>
    </View>)}
    <View style={styles.note}><Ionicons name="information-circle-outline" size={20} color={colors.teal} /><Text style={styles.noteText}>{sw ? "Alama ya kufuli inaonyesha data au hatua zinazohitaji ruhusa; skrini bado inaweza kufunguliwa kuangalia hali yake ya sasa." : "A lock marks private data or actions that require permission; you can still open the route to see its current screen state."}</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.sm },
  heroTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 26, lineHeight: 31 },
  heroBody: { fontFamily: type.regular, color: "#F9E8EF", fontSize: 14, lineHeight: 21 },
  group: { marginTop: spacing.xxl },
  groupTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 20 },
  steps: { marginTop: spacing.xs, marginBottom: spacing.md, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  list: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, overflow: "hidden" },
  row: { minHeight: 68, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  rowTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 14 },
  rowBody: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  note: { marginTop: spacing.xxl, flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.tealSoft },
  noteText: { flex: 1, fontFamily: type.regular, color: colors.ink, fontSize: 13, lineHeight: 19 },
});
