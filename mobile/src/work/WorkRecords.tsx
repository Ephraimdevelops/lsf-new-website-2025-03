import { BrandLoading } from '../components/BrandLoading';
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../backend/api";
import { useAuth } from "../auth";
import { Screen } from "../components/Screen";
import { CivicPageHeader } from "../components/CivicPageHeader";
import { ParalegalIntro } from "../components/ParalegalIntro";
import { ParalegalNavigation } from "../components/ParalegalNavigation";
import { SearchFilters } from "../components/SearchFilters";
import { Button } from "../components/Button";
import { IntakeSelect } from "../intake/IntakeSelect";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
import { useSensitiveScreenProtection } from "../useSensitiveScreenProtection";
export function WorkRecords({ kind }: { kind: "documents" | "appointments" }) {
 useSensitiveScreenProtection(`work-${kind}`);
 const { isSignedIn } = useAuth(); const { locale } = useLanguage(); const sw = locale === "sw";
 const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip"); const allowed = access?.roles.some(role => ["paralegal", "provider_staff"].includes(role));
 const docs = useQuery(api.caseManagement.myDocuments, allowed && kind === "documents" ? { context: "work" } : "skip");
 const appointments = useQuery(api.caseManagement.myAppointments, allowed && kind === "appointments" ? { context: "work" } : "skip");
 const [search, setSearch] = useState(""); const [status, setStatus] = useState("");
 const statusCopy: Record<string,string> = { pending_review: sw ? "Inasubiri ukaguzi" : "Needs review", accepted: sw ? "Imekubaliwa" : "Accepted", rejected: sw ? "Imekataliwa" : "Rejected", scheduled: sw ? "Imepangwa" : "Scheduled", completed: sw ? "Imekamilika" : "Completed", cancelled: sw ? "Imeghairiwa" : "Cancelled", missed: sw ? "Haikufanyika" : "Missed" };
 const rows = kind === "documents" ? docs : appointments;
 const visible = rows?.filter(item => item.context === "work" && (!status || status === item.status) && [item.casePublicId, item.caseSummary, "name" in item ? item.name : ""].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
 return <Screen footer={allowed ? <ParalegalNavigation current="cases" /> : undefined}>
  <CivicPageHeader compact back title={kind === "documents" ? (sw ? "Nyaraka za kazi" : "Work documents") : (sw ? "Miadi ya kazi" : "Work appointments")} />
  <ParalegalIntro pose={kind === "documents" ? "direction" : "contact"} title={kind === "documents" ? (sw ? "Pitia taarifa kwa uangalifu." : "Review the details with care.") : (sw ? "Jua miadi yako inayofuata." : "Know your next meeting.")} body={sw ? "Kesi unazosaidia pekee zinaonekana hapa." : "Only the cases you support appear here."} />
  {!isSignedIn ? <Button label={sw ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} /> : access === undefined ? <BrandLoading compact text={sw ? "Inapakia…" : "Loading…"}/> : !allowed ? <Text style={styles.body}>{sw ? "Idhini ya kazi inahitajika." : "Work approval required."}</Text> : <>
   <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta kesi au jina" : "Search case or name"} label={sw ? "Hali" : "Status"} title={sw ? "Chuja kwa hali" : "Filter by status"} count={status ? 1 : 0} onReset={() => setStatus("")}><IntakeSelect sw={sw} value={status} onChange={setStatus} label={sw ? "Hali" : "Status"} options={[{ value: "", label: sw ? "Zote" : "All" }, ...(kind === "documents" ? ["pending_review", "accepted", "rejected"] : ["scheduled", "completed", "cancelled", "missed"]).map(value => ({ value, label: statusCopy[value] }))]} /></SearchFilters>
   {rows && rows.length >= 100 && <Text style={styles.body}>{sw ? "Unaona rekodi 100 za hivi karibuni. Fungua kesi husika kupata rekodi za zamani." : "Showing the latest 100 records. Open the related case for older records."}</Text>}
   {rows === undefined ? <BrandLoading compact text={sw ? "Inapakia…" : "Loading…"}/> : visible?.length ? visible.map(item => <Pressable key={item._id} accessibilityRole="button" style={styles.card} onPress={() => "name" in item ? router.push({ pathname: "/document/[id]", params: { id: item._id } }) : router.push({ pathname: "/case/[id]", params: { id: item.caseId, section: "appointments" } })}>
    <Text style={styles.title}>{"name" in item ? item.name : new Date(item.startsAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam", dateStyle: "medium", timeStyle: "short" }) + " · EAT"}</Text><Text style={styles.body}>{item.casePublicId} · {statusCopy[item.status]}</Text><Text style={styles.body} numberOfLines={2}>{item.caseSummary}</Text>
   </Pressable>) : <Text style={styles.body}>{search || status ? (sw ? "Hakuna matokeo. Badili utafutaji." : "No matches. Change your search.") : kind === "documents" ? (sw ? "Nyaraka za kesi unazosaidia zitaonekana hapa." : "Documents from the cases you support will appear here.") : (sw ? "Panga miadi ndani ya kesi. Itaonekana hapa." : "Schedule an appointment inside a case. It will appear here.")}</Text>}
  </>}
 </Screen>;
}
const styles = StyleSheet.create({ card: { marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: colors.tealSoft, gap: 8 }, title: { fontFamily: type.semibold, fontSize: 18, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 16, lineHeight: 24, color: colors.inkMuted } });
