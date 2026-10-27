import { BrandLoading } from '../src/components/BrandLoading';
import { AdminIntro } from "../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { SearchFilters } from "../src/components/SearchFilters";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Tab = "reviews" | "offers" | "cases";

export default function SupervisionScreen() {
  useSensitiveScreenProtection("supervision");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const { view } = useLocalSearchParams<{view?: string}>();
  const [tab, setTab] = useState<Tab>(view === "offers" || view === "cases" ? view : "reviews");
  const [search, setSearch] = useState("");
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  useEffect(() => { if (view === "offers" || view === "cases" || view === "reviews") setTab(view); }, [view]);
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => role === "admin" || role === "supervisor" || role === "staff");
  const submitted = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "submitted" } : "skip");
  const inReview = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "under_review" } : "skip");
  const offers = useQuery(api.caseManagement.staffAssignmentOffers, allowed ? { status: "offered" } : "skip");
  const cases = useQuery(api.caseManagement.staffCaseQueue, allowed ? {} : "skip");
  const reviews = [...(submitted ?? []), ...(inReview ?? [])];
  const openCases = cases?.filter((item) => !["resolved", "closed", "closed_unresolved"].includes(item.status)) ?? [];
  const overdue = offers?.filter((item) => item.history.isOverdue) ?? [];
  const matches = (...values: (string | undefined)[]) => values.join(" ").toLowerCase().includes(search.trim().toLowerCase());
  const visibleReviews = reviews.filter(item => matches(item.case?.publicId, item.review.note, item.review.reason));
  const visibleOffers = offers?.filter(item => (!onlyOverdue || item.history.isOverdue) && matches(item.case?.publicId, item.assignee?.name));
  const visibleCases = openCases.filter(item => matches(item.publicId, item.summary, item.status));
  const reasonLabels: Record<string,string> = sw ? { safety_concern:"Suala la usalama", reassignment:"Kubadilisha mtoa msaada", no_response:"Hakuna jibu", service_concern:"Ubora wa huduma", other:"Suala lingine" } : { safety_concern:"Safety concern", reassignment:"Change of helper", no_response:"No reply", service_concern:"Service quality", other:"Other concern" };

  if (access === undefined) return <Screen><AppHeader back title={sw ? "Usimamizi" : "Supervision"} /><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Usimamizi" : "Supervision"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Eneo hili linahitaji ruhusa ya msimamizi wa LSF." : "LSF operations access is required."}</Text></Surface></Screen>;

  return <Screen>
    <AppHeader back title={sw ? "Usimamizi na ubora" : "Case reviews & follow-up"} eyebrow="LSF · RESTRICTED" />
    <AdminIntro icon="book-outline" eyebrow="LSF" title={sw ? "Tambua kilichokwama. Linda ubora." : "See what needs attention. Protect quality."} description={sw ? "Maombi ya kupitia kesi, ofa zilizochelewa na kesi zilizo wazi kutoka kwenye rekodi halisi za LSF." : "Case review requests, overdue offers and open cases from live LSF records."} />
    <View style={styles.metrics}><Metric value={reviews.length} label={sw ? "Mapitio wazi" : "Open reviews"} /><Metric value={overdue.length} label={sw ? "Ofa zilizochelewa" : "Overdue offers"} /><Metric value={openCases.length} label={sw ? "Kesi zinazoendelea" : "Open cases"} /></View>
    <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta kesi au ombi" : "Find a case or request"} label={sw ? "Onyesha" : "Show"} title={sw ? "Kazi za kupitia" : "Work to review"} count={Number(tab !== "reviews") + Number(onlyOverdue)} summary={tab === "reviews" ? (sw ? "Mapitio wazi" : "Open reviews") : tab === "offers" ? (sw ? "Ofa zinazosubiri jibu" : "Offers awaiting a reply") : (sw ? "Kesi zinazoendelea" : "Open cases")} onReset={() => { setTab("reviews"); setOnlyOverdue(false); }}><IntakeSelect sw={sw} value={tab} onChange={value => { setTab(value as Tab); setSearch(""); }} label={sw ? "Onyesha" : "Show"} options={[{value:"reviews",label:sw?"Mapitio":"Reviews"},{value:"offers",label:sw?"Ofa":"Offers"},{value:"cases",label:sw?"Kesi":"Cases"}]} />{tab === "offers" && <Button label={onlyOverdue ? (sw?"Onyesha ofa zote":"Show all offers") : (sw?"Zilizochelewa pekee":"Only overdue offers")} variant="secondary" onPress={() => setOnlyOverdue(value => !value)} />}</SearchFilters>

    {tab === "reviews" ? <>
      <SectionHeading title={sw ? "Maombi yanayohitaji uamuzi" : "Requests needing review"} />
      {submitted === undefined || inReview === undefined ? <Empty text={sw ? "Inapakia mapitio..." : "Loading reviews..."} /> : visibleReviews.length === 0 ? <Empty text={sw ? "Hakuna ombi la kupitia kesi lililo wazi." : "No matching review request."} /> : visibleReviews.map((item) => <Surface key={item.review._id} tone={item.review.reason === "safety_concern" ? "orange" : "white"}>
        <View style={styles.row}><View style={styles.icon}><Ionicons name={item.review.reason === "safety_concern" ? "shield-outline" : "chatbubble-ellipses-outline"} size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.case?.publicId ?? (sw ? "Kesi haipatikani" : "Case unavailable")}</Text><Text style={styles.muted}>{reasonLabels[item.review.reason] ?? item.review.reason.replaceAll("_", " ")} · {item.review.status === "submitted" ? (sw ? "Jipya" : "New") : (sw ? "Linapitiwa" : "Being reviewed")}</Text></View></View>
        <Text style={styles.body} numberOfLines={3}>{item.review.note}</Text>
        <Button label={sw ? "Pitia ombi" : "Review request"} variant="secondary" onPress={() => router.push({ pathname: "/safeguarding-review/[id]", params: { id: item.review._id, returnTo: "supervision" } })} />
      </Surface>)}
    </> : null}

    {tab === "offers" ? <>
      <SectionHeading title={sw ? "Ofa zinazohitaji ufuatiliaji" : "Offers needing follow-up"} />
      {offers === undefined ? <Empty text={sw ? "Inapakia ofa..." : "Loading offers..."} /> : visibleOffers?.length === 0 ? <Empty text={sw ? "Hakuna ofa inayosubiri jibu." : "No matching offer. Clear your search or change the filters."} /> : visibleOffers?.map((item) => <Surface key={item.assignment._id} tone={item.history.isOverdue ? "orange" : "white"}>
        <View style={styles.row}><View style={styles.icon}><Ionicons name="time-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.case?.publicId ?? "—"}</Text><Text style={styles.muted}>{item.history.isOverdue ? (sw ? "Muda umepita" : "Overdue") : (sw ? "Inasubiri jibu" : "Awaiting response")}</Text></View></View>
        <Text style={styles.body}>{sw ? "Iliyotumwa kwa" : "Offered to"} {item.assignee?.name ?? (sw ? "mtoa huduma" : "provider")} · {sw ? "Saa" : "Hours"} {item.history.offerAgeHours}</Text>
        <Button label={sw ? "Kagua kesi na ofa" : "Review case and offer"} variant="secondary" disabled={!item.case} onPress={() => item.case && router.push({ pathname: "/case/[id]", params: { id: item.case._id } })} />
        {item.case ? <Button label={sw ? "Kagua kubadilisha mtoa msaada" : "Review reassignment"} variant="quiet" onPress={() => router.push({ pathname: "/case-matching/[id]", params: { id: item.case!._id } })} /> : null}
      </Surface>)}
    </> : null}

    {tab === "cases" ? <>
      <SectionHeading title={sw ? "Kesi zilizo wazi" : "Open cases"} />
      {cases === undefined ? <Empty text={sw ? "Inapakia kesi..." : "Loading cases..."} /> : visibleCases.length === 0 ? <Empty text={sw ? "Hakuna kesi iliyo wazi." : "No matching open case."} /> : visibleCases.map((item) => <Surface key={item._id} tone={item.priority === "safeguarding" ? "orange" : "white"}>
        <View style={styles.row}><View style={styles.icon}><Ionicons name="folder-open-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.publicId}</Text><Text style={styles.muted}>{item.priority} · {item.status.replaceAll("_", " ")}</Text></View></View>
        <Text style={styles.body} numberOfLines={2}>{item.summary}</Text>
        <Button label={sw ? "Angalia kesi na utayari wa kufunga" : "View case and closure readiness"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })} />
        <Button label={sw ? "Kagua kufunga kesi" : "Review closure checklist"} variant="quiet" onPress={() => router.push({ pathname: "/closure-review/[id]", params: { id: item._id } })} />
      </Surface>)}
    </> : null}
    <Surface tone="teal"><Text style={styles.title}>{sw ? "Hatua za usimamizi" : "Supervisor tools"}</Text><Text style={styles.body}>{sw ? "Pitia ulinganishaji, washirika, ulinzi na rekodi za ukaguzi." : "Review matching, partner activity, safeguarding and audit history."}</Text><Button label={sw ? "Pitia ulinganishaji" : "Review matching"} variant="secondary" onPress={() => router.push("/matching-review")} /><Button label={sw ? "Utendaji wa washirika" : "Partner performance"} variant="quiet" onPress={() => router.push("/partner-performance")} /><Button label={sw ? "Fungua ulinzi" : "Open safeguarding"} variant="quiet" onPress={() => router.push("/safeguarding")} /><Button label={sw ? "Fungua ukaguzi" : "Open audit log"} variant="quiet" onPress={() => router.push("/audit-log")} /></Surface>
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
function Empty({ text }: { text: string }) { return <Surface><Text style={styles.muted}>{text}</Text></Surface>; }

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 33 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, minHeight: 95, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm, backgroundColor: colors.tealSoft }, metricValue: { color: colors.teal, fontFamily: type.bold, fontSize: 25 },
  muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, tabs: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl }, tab: { flex: 1, minHeight: 46, justifyContent: "center", alignItems: "center", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 12 }, tabTextActive: { color: colors.surface },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 19, marginVertical: spacing.md },
});
