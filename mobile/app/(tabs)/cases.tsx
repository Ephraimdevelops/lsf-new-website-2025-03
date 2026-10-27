import { BrandLoading } from '../../src/components/BrandLoading';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Button } from "../../src/components/Button";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
import { CivicIllustration } from "../../src/components/CivicIllustration";
import { CivicObject } from "../../src/components/CivicObject";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { colors, type } from "../../src/theme";

const requestStatus: Record<string, { sw: string; en: string }> = {
  draft: { sw: "Rasimu", en: "Draft" },
  submitted: { sw: "Limepokelewa", en: "Received" },
  under_review: { sw: "Linakaguliwa", en: "Under review" },
  waiting_for_information: { sw: "Taarifa zinahitajika", en: "Information needed" },
  information_only: { sw: "Mwongozo umetolewa", en: "Guidance provided" },
  referred: { sw: "Limeelekezwa", en: "Referred" },
  withdrawn: { sw: "Limeondolewa", en: "Withdrawn" },
  closed: { sw: "Limefungwa", en: "Closed" },
};
const completedCases = new Set(["resolved", "closed", "closed_unresolved"]);
const completedRequests = new Set(["information_only", "withdrawn", "closed"]);
const issueLabels: Record<string, { sw: string; en: string }> = {
  employment: { sw: "Msaada kuhusu ajira", en: "Employment support" },
  land: { sw: "Msaada kuhusu ardhi", en: "Land support" },
  family: { sw: "Msaada kuhusu familia", en: "Family support" },
  safety: { sw: "Msaada kuhusu usalama", en: "Safety support" },
  consumer: { sw: "Msaada kuhusu haki za mlaji", en: "Consumer rights support" },
};

export default function CasesScreen() {
  const { isSignedIn } = useAuth();
  const { ready: accountReady } = useAccountSync();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [view, setView] = useState<"active" | "history">("active");
  const allCases = useQuery(api.caseManagement.myCases, isSignedIn && accountReady ? {} : "skip");
  const access = useQuery(api.users.currentAccess, isSignedIn && accountReady ? {} : "skip");
  const cases = allCases?.filter(item => item.beneficiaryId === access?.user._id);
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn && accountReady ? {} : "skip");
  const visibleRequests = requests?.filter((item) => item.status !== "converted_to_case") ?? [];
  const loading = isSignedIn && (cases === undefined || requests === undefined);
  const filteredCases = cases?.filter((item) => completedCases.has(item.status) === (view === "history")) ?? [];
  const filteredRequests = visibleRequests.filter((item) => completedRequests.has(item.status) === (view === "history"));
  const activeCount = (cases?.filter((item) => !completedCases.has(item.status)).length ?? 0) + visibleRequests.filter((item) => !completedRequests.has(item.status)).length;
  const historyCount = (cases?.length ?? 0) + visibleRequests.length - activeCount;
  const hasResults = filteredCases.length + filteredRequests.length > 0;

  return <Screen>
    <CivicPageHeader compact title={sw ? "Maombi na kesi" : "Requests and cases"} actionIcon="add" actionLabel={sw ? "Omba msaada mpya" : "Request new help"} onAction={() => router.push("/intake")} />
    {isSignedIn ? <View style={styles.intro}><View style={styles.supportCopy}><Text style={styles.emptyTitle}>{sw ? "Hatua zako, pamoja." : "Your next steps, together."}</Text><Text style={styles.emptyBody}>{sw ? "Fuatilia ombi lako na hatua inayofuata." : "Follow your request and see what comes next."}</Text></View><CivicIllustration pose="review" size={100} /></View> : null}

    {isSignedIn ? <View accessibilityRole="tablist" style={styles.tabs}>
      {(["active", "history"] as const).map((tab) => <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: view === tab }} onPress={() => setView(tab)} style={[styles.tab, view === tab && styles.tabActive]}><Text style={[styles.tabText, view === tab && styles.tabTextActive]}>{tab === "active" ? (sw ? "Yanayoendelea" : "In progress") : (sw ? "Historia" : "History")}{!loading ? `  ${tab === "active" ? activeCount : historyCount}` : ""}</Text></Pressable>)}
    </View> : null}

    {!isSignedIn ? <View style={styles.empty}>
      <CivicIllustration pose="review" size={124} />
      <Text style={styles.emptyTitle}>{sw ? "Kila hatua, mahali pamoja." : "Every step, in one place."}</Text>
      <Text style={styles.emptyBody}>{sw ? "Ingia kufuatilia ombi lako na kuwasiliana na mtoa msaada wako." : "Sign in to follow your request and keep in touch with your support provider."}</Text>
      <View style={styles.benefits}>
        {[
          { icon: "checkmark-circle-outline" as const, text: sw ? "Hali ya ombi na hatua inayofuata" : "Request status and your next step" },
          { icon: "chatbubble-outline" as const, text: sw ? "Ujumbe kutoka kwa mtoa msaada" : "Messages from your support provider" },
          { icon: "calendar-outline" as const, text: sw ? "Miadi na nyaraka za kesi" : "Appointments and case documents" },
        ].map((item) => <View key={item.text} style={styles.benefit}><Ionicons name={item.icon} size={20} color={colors.teal} /><Text style={styles.benefitText}>{item.text}</Text></View>)}
      </View>
      <Button label={sw ? "Ingia kwenye akaunti" : "Sign in to your account"} style={styles.button} onPress={() => router.push("/sign-in")} />
    </View> : loading ? <View style={styles.loading}><BrandLoading compact text={sw ? "Tunapakua taarifa zako..." : "Loading your updates..."}/></View> : hasResults ? <>
      {filteredRequests.length ? <Text style={styles.sectionLabel}>{sw ? "MAOMBI" : "REQUESTS"}</Text> : null}
      {filteredRequests.map((item) => <Pressable accessibilityRole="button" key={item._id} style={({ pressed }) => [styles.record, pressed && styles.pressed]} onPress={() => router.push({ pathname: "/request/[id]", params: { id: item._id } })}>
        <View style={styles.recordTop}><Text style={styles.reference}>{item.publicId}</Text><Ionicons name="arrow-forward" size={19} color={colors.inkMuted} /></View>
        <Text style={styles.recordTitle}>{issueLabels[item.issueCategory ?? ""]?.[locale] ?? (sw ? "Ombi la msaada wa kisheria" : "Legal help request")}</Text>
        <View style={styles.statusRow}><View style={[styles.statusDot, item.status === "waiting_for_information" && styles.attentionDot]} /><Text style={styles.statusText}>{requestStatus[item.status]?.[locale] ?? item.status.replaceAll("_", " ")}</Text></View>
        <View style={styles.recordFooter}><Ionicons name={item.status === "waiting_for_information" ? "alert-circle-outline" : "time-outline"} size={16} color={colors.burgundy} /><Text style={styles.nextStep}>{item.status === "waiting_for_information" ? (sw ? "Fungua kuona taarifa zinazohitajika" : "See what information is needed") : (sw ? "Angalia maendeleo ya ombi" : "View request progress")}</Text></View>
      </Pressable>)}
      {filteredCases.length ? <Text style={styles.sectionLabel}>{sw ? "KESI" : "CASES"}</Text> : null}
      {filteredCases.map((item) => <Pressable accessibilityRole="button" key={item._id} style={({ pressed }) => [styles.record, pressed && styles.pressed]} onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })}>
        <View style={styles.recordTop}><Text style={styles.reference}>{item.publicId}</Text><Text style={styles.date}>{new Date(item.updatedAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short" })}</Text></View>
        <Text style={styles.recordTitle} numberOfLines={2}>{item.summary}</Text>
        <View style={styles.statusRow}><View style={[styles.statusDot, item.status === "waiting_for_information" && styles.attentionDot]} /><Text style={styles.statusText}>{caseStatusLabels[locale][item.status]}</Text></View>
        <View style={styles.recordFooter}><Text style={styles.nextStep}>{sw ? "Fungua kesi" : "Open case"}</Text><Ionicons name="arrow-forward" size={17} color={colors.burgundy} /></View>
      </Pressable>)}
    </> : <View style={styles.empty}>
      <CivicObject kind="empty" size={104} />
      <Text style={styles.emptyTitle}>{view === "history" ? (sw ? "Historia yako itakuwa hapa." : "Your history will be here.") : (sw ? "Tuanze na unachohitaji." : "Start with what you need.")}</Text>
      <Text style={styles.emptyBody}>{view === "history" ? (sw ? "Maombi na kesi zilizokamilika zitaonekana hapa." : "Completed requests and cases will appear here.") : (sw ? "Ukishatuma ombi, utaona maendeleo yake na hatua zinazofuata hapa." : "Once you send a request, its progress and next steps will appear here.")}</Text>
      {view === "active" ? <Button label={sw ? "Omba msaada" : "Request help"} style={styles.button} onPress={() => router.push("/intake")} /> : null}
    </View>}

    <Pressable accessibilityRole="button" style={styles.supportLink} onPress={() => router.push("/find-services")}><Ionicons name="compass-outline" size={22} color={colors.teal} /><View style={styles.supportCopy}><Text style={styles.supportTitle}>{sw ? "Unahitaji pa kuanzia?" : "Need a place to start?"}</Text><Text style={styles.muted}>{sw ? "Tafuta msaada unaokufaa" : "Find the right help"}</Text></View><Ionicons name="arrow-forward" size={19} color={colors.teal} /></Pressable>
    <View style={styles.privacy}><Ionicons name="lock-closed-outline" size={13} color={colors.inkMuted} /><Text style={styles.privacyText}>{sw ? "Taarifa zako za kesi ni za faragha." : "Your case information is private."}</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", backgroundColor: "#F4F2F3", padding: 4, borderRadius: 10, marginBottom: 24 },
  tab: { flex: 1, minHeight: 44, justifyContent: "center", alignItems: "center", paddingHorizontal: 6, borderRadius: 7 },
  tabActive: { backgroundColor: colors.surface },
  tabText: { fontFamily: type.medium, fontSize: 13, color: colors.inkMuted },
  tabTextActive: { color: colors.burgundy, fontFamily: type.semibold },
  sectionLabel: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 11, marginBottom: 12, marginTop: 8 },
  intro: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 },
  record: { padding: 18, marginBottom: 12, borderRadius: 8, backgroundColor: "#F4F6F5", gap: 10 },
  recordTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  reference: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  date: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 },
  recordTitle: { fontFamily: type.semibold, fontSize: 16, lineHeight: 23, color: colors.ink },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  attentionDot: { backgroundColor: colors.warning },
  statusText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  recordFooter: { flexDirection: "row", alignItems: "center", gap: 7, paddingTop: 5 },
  nextStep: { flex: 1, fontFamily: type.medium, color: colors.burgundy, fontSize: 12, lineHeight: 18 },
  empty: { paddingTop: 20, paddingBottom: 24 },
  emptyIcon: { width: 58, height: 58, backgroundColor: colors.burgundySoft, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontFamily: type.editorial, fontSize: 25, lineHeight: 32, color: colors.ink },
  emptyBody: { marginTop: 9, fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted },
  benefits: { marginTop: 23, gap: 18 },
  benefit: { flexDirection: "row", alignItems: "center", gap: 12 },
  benefitText: { flex: 1, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.ink },
  button: { marginTop: 26, borderRadius: 10 },
  supportLink: { minHeight: 80, flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  supportCopy: { flex: 1, gap: 3 },
  supportTitle: { fontFamily: type.semibold, fontSize: 14, color: colors.ink },
  muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  privacy: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 20 },
  privacyText: { flex: 1, fontFamily: type.regular, fontSize: 11, lineHeight: 17, color: colors.inkMuted },
  loading: { minHeight: 160, gap: 14, justifyContent: "center", alignItems: "center" },
  pressed: { opacity: 0.7 },
});
