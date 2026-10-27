import { BrandLoading } from '../src/components/BrandLoading';
import { workCaseJourney } from "../../shared/workCaseJourney";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/auth";
import { api } from "../src/backend/api";
import { caseStatusLabels } from "../src/caseLabels";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { CivicObject } from "../src/components/CivicObject";
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import { SearchFilters } from "../src/components/SearchFilters";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, type } from "../src/theme";
const completed = ["closed"];
export default function ParalegalAssignmentsScreen() {
  const { isSignedIn } = useAuth(); const { locale } = useLanguage(); const sw = locale === "sw";
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [tab, setTab] = useState<"offers" | "active">(view === "active" ? "active" : "offers");
  useEffect(() => { setTab(view === "active" ? "active" : "offers"); }, [view]);
  const [search, setSearch] = useState(""); const [history, setHistory] = useState(false);
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some(role => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const offers = useQuery(api.caseManagement.assignmentInbox, allowed ? {} : "skip");
  const cases = useQuery(api.caseManagement.myCases, allowed ? {} : "skip");
  const term = search.trim().toLocaleLowerCase();
  const matches = (record: { publicId?: string; summary?: string } | null) => !term || [record?.publicId, record?.summary].join(" ").toLocaleLowerCase().includes(term);
  const visibleOffers = offers?.filter(item => matches(item.case));
  const assigned = cases?.filter(record => record.beneficiaryId !== access?.user._id && completed.includes(record.status) === history && matches(record));
  return <Screen footer={allowed ? <ParalegalNavigation current="cases" /> : undefined}>
    <CivicPageHeader compact back title={sw ? "Kesi za kazi" : "Your work cases"} />
    <ParalegalIntro pose="review" title={sw ? "Pitia. Kubali. Saidia." : "Review. Accept. Help."} body={sw ? "Angalia kesi kabla ya kuamua. Kesi ulizopokea hukaa hapa." : "Read the case before deciding. Accepted cases stay here."} />
    {!isSignedIn ? <Button label={sw ? "Ingia kuona kesi" : "Sign in to see cases"} onPress={() => router.push("/sign-in")} /> : access === undefined ? <BrandLoading compact text={sw ? "Tunapakia ruhusa…" : "Loading access…"}/> : !allowed ? <><Text style={styles.muted}>{sw ? "Idhini ya kazi inahitajika." : "Work access requires approval."}</Text><Button label={sw ? "Angalia kujiunga" : "View setup"} onPress={() => router.push("/paralegal-onboarding")} /></> : <>
      <View style={styles.tabs}>{(["offers", "active"] as const).map(item => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.selected]}><Text style={[styles.tabText, tab === item && styles.selectedText]}>{item === "offers" ? (sw ? "Kesi za kupokea" : "Cases to accept") : (sw ? "Kesi nilizopokea" : "Accepted cases")}</Text></Pressable>)}</View>
      <SearchFilters value={search} onChange={setSearch} placeholder={sw ? "Tafuta kesi" : "Search cases"} sw={sw} label={sw ? "Hali" : "Status"} title={sw ? "Kesi gani?" : "Which cases?"} count={history ? 1 : 0} onReset={() => setHistory(false)} summary={tab === "offers" ? (offers === undefined ? "" : `${visibleOffers?.length ?? 0} ${sw ? "ofa" : "offers"}`) : (cases === undefined ? "" : `${assigned?.length ?? 0} ${sw ? "kesi" : "cases"}`)}>{tab === "active" ? <View>{[false, true].map(value => <Pressable key={String(value)} accessibilityRole="radio" accessibilityState={{ checked: history === value }} aria-checked={history === value} style={styles.option} onPress={() => setHistory(value)}><Text style={styles.rowTitle}>{value ? (sw ? "Zilizofungwa" : "Closed") : (sw ? "Zinaendelea" : "In progress")}</Text><Ionicons name={history === value ? "radio-button-on" : "radio-button-off"} size={22} color={colors.burgundy} /></Pressable>)}</View> : null}</SearchFilters>
      {tab === "offers" ? offers === undefined ? <BrandLoading compact text={sw ? "Tunapakia ofa…" : "Loading offers…"}/> : visibleOffers?.length ? visibleOffers.map(({ assignment, case: record }) => <Pressable key={assignment._id} accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: "/assignment/[id]", params: { id: assignment._id } })}><View style={styles.top}><Text style={styles.reference}>{record?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")}</Text><Ionicons name="arrow-forward" size={20} color={colors.teal} /></View><Text style={styles.rowTitle} numberOfLines={3}>{record?.summary ?? (sw ? "Kagua maelezo yanayopatikana" : "Review available details")}</Text>{assignment.expiresAt ? <Text style={styles.muted}>{sw ? "Jibu kabla ya" : "Respond by"} {new Date(assignment.expiresAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text> : null}<Text style={styles.action}>{sw ? "Kagua kabla ya kujibu" : "Review before responding"}</Text></Pressable>) : <Empty sw={sw} searching={!!term} offers />
      : cases === undefined ? <BrandLoading compact text={sw ? "Tunapakia kesi…" : "Loading cases…"}/> : assigned?.length ? assigned.map(record => <Pressable key={record._id} accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: "/case/[id]", params: { id: record._id } })}><View style={styles.top}><Text style={styles.reference}>{record.publicId}</Text><Ionicons name="arrow-forward" size={20} color={colors.teal} /></View><Text style={styles.rowTitle} numberOfLines={2}>{record.summary}</Text><Text style={styles.muted}>{workCaseJourney(record.status, false, false, sw).title}</Text><Text style={styles.action}>{sw ? "Angalia hatua inayofuata" : "See the next step"}</Text></Pressable>) : <Empty sw={sw} searching={!!term} />}
      {!!term && (tab === "offers" ? visibleOffers?.length === 0 : assigned?.length === 0) ? <Button variant="quiet" label={sw ? "Futa utafutaji" : "Clear search"} onPress={() => setSearch("")} /> : null}
    </>}
  </Screen>;
}
function Empty({ sw, searching, offers }: { sw: boolean; searching: boolean; offers?: boolean }) { return <View style={styles.empty}><CivicObject kind="empty" size={96} /><Text style={styles.rowTitle}>{searching ? (sw ? "Hakuna kesi inayolingana." : "No matching cases.") : offers ? (sw ? "Hakuna ofa mpya kwa sasa." : "No new offers right now.") : (sw ? "Kesi zako zitaonekana hapa." : "Your cases will appear here.")}</Text><Text style={styles.muted}>{searching ? (sw ? "Jaribu maneno mengine au futa utafutaji." : "Try another word or clear your search.") : (sw ? "Baada ya kupokea kesi, fungua kuona ujumbe na hatua zinazofuata." : "Once you accept a case, open it for messages and next steps.")}</Text></View>; }
const styles = StyleSheet.create({ tabs: { flexDirection: "row", backgroundColor: "#F4F2F3", padding: 4, borderRadius: 12, marginBottom: 20 }, tab: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 9, padding: 6 }, selected: { backgroundColor: colors.surface }, tabText: { fontFamily: type.medium, fontSize: 13, color: colors.inkMuted }, selectedText: { color: colors.burgundy }, top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, reference: { flex: 1, fontFamily: type.medium, fontSize: 12, color: colors.teal }, card: { backgroundColor: "#F4F6F5", borderRadius: 12, padding: 18, marginBottom: 12, gap: 10 }, rowTitle: { fontFamily: type.semibold, fontSize: 16, lineHeight: 23, color: colors.ink }, muted: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted }, action: { fontFamily: type.medium, fontSize: 14, color: colors.burgundy }, empty: { alignItems: "center", gap: 12, paddingVertical: 24 }, option: { minHeight: 56, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 } });
