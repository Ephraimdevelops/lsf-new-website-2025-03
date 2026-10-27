import { LoadingText } from '../src/components/BrandLoading';
import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import { SearchFilters } from "../src/components/SearchFilters";
import { AdminIntro } from "../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

import { safetyLabel, safetyActionLabel } from "../src/safeguarding/labels";

type Decision = "approved" | "needs_changes" | "escalated" | "restricted";
type Filter = "pending_review" | "escalated" | "restricted" | "all";

export default function MatchingReviewScreen() {
  useSensitiveScreenProtection("matching-review");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [search, setSearch] = useState("");
  const params = useLocalSearchParams<{id?: string; history?: string}>();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState<{status: Decision; note: string; reviewedAt: number; previousStatus: "pending_review" | Decision} | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { setSelected(params.id ?? null); setDecision(null); setNote(""); setConfirmation(null); setNotice(""); }, [params.id, params.history, filter]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role));
  const records = useQuery(api.justiceServices.staffMatchingDecisionQueue, allowed ? params.id ? {decisionId: params.id as Id<"matching_decisions">} : filter === "all" ? {} : { status: filter } : "skip");
  const visible = records?.filter(row => [row.case?.publicId, row.request?.publicId, ...row.recommendedServices.map(service => service.name)].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
  const review = useMutation(api.justiceServices.reviewMatchingDecision);
  const active = records?.find(({ decision: item }) => item._id === selected);

  async function save() {
    if (!active || !confirmation || busy) return;
    if (note.trim().length < 10) { setError(sw ? "Andika sababu ya uamuzi (herufi 10 au zaidi)." : "Add a reason for this decision (at least 10 characters)."); return; }
    setBusy(true); setError("");
    try {
      await review({ decisionId: active.decision._id as Id<"matching_decisions">, status: confirmation.status, reviewNote: confirmation.note, restrictionReason: confirmation.status === "restricted" ? confirmation.note : undefined, expectedReviewedAt: confirmation.reviewedAt, expectedReviewStatus: confirmation.previousStatus });
      setDecision(null); setNote(""); setConfirmation(null); setNotice(sw ? "Uamuzi umerekodiwa." : "Decision recorded.");
    } catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua huduma zilizopendekezwa" : "Service match review"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF au ulinzi inahitajika." : "An LSF or safeguarding role is required."}</Text></Surface> : <>
      <AdminIntro icon="people-outline" eyebrow="LSF" title={sw ? "Kagua huduma zilizopendekezwa." : "Review the suggested services."} description={sw ? "Kagua sababu, huduma zilizopendekezwa na ishara za usalama. Uamuzi huu hautumi rufaa kwa mtoa huduma." : "Check the reasons, proposed services and safety flags. This decision does not send a referral to a provider."} />
      {params.id ? <Button label={sw?"Onyesha mapendekezo yote":"Show all service matches"} variant="quiet" onPress={()=>router.replace("/matching-review")}/> : null}
      <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta kesi au huduma" : "Find a case or service"} label={sw ? "Hali" : "Status"} title={sw ? "Hali ya mapitio" : "Review status"} count={Number(filter !== "all")} onReset={() => setFilter("all")}>{params.id ? null : <View style={{gap:8}}>{(["pending_review","escalated","restricted","all"] as Filter[]).map(item => <Button key={item} label={item === "pending_review" ? (sw ? "Zinahitaji mapitio" : "Need review") : item === "escalated" ? (sw ? "Zimepelekwa kwa msimamizi" : "Need senior review") : item === "restricted" ? (sw ? "Zilizolindwa" : "Protected") : (sw ? "Zote" : "All")} variant={filter === item ? "primary" : "secondary"} onPress={() => setFilter(item)} />)}</View>}</SearchFilters>
      {notice ? <Surface tone="teal"><Text accessibilityRole="alert" style={styles.body}>{notice}</Text><Button label={sw?"Fungua historia":"Open history"} variant="secondary" onPress={()=>router.push("/safeguarding?view=history")}/></Surface> : null}
      <LoadingText style={styles.count}>{records === undefined ? (sw ? "Inapakia..." : "Loading...") : `${visible?.length ?? 0} ${sw ? "maamuzi ya hivi karibuni" : "recent decisions"}`}</LoadingText>
      {visible?.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna maamuzi katika kundi hili." : "No matching decisions in this group."}</Text></Surface> : null}
      {visible?.map((row) => <Surface key={row.decision._id} tone={row.decision.urgency === "immediate_safety" ? "orange" : "white"}>
        <Pressable accessibilityRole="button" onPress={() => { setSelected(selected === row.decision._id ? null : row.decision._id); setDecision(null); setNote(""); setConfirmation(null); setError(""); }} style={styles.row}><View style={styles.icon}><Ionicons name={row.decision.safetyFlags.length ? "shield-outline" : "compass-outline"} size={23} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{row.case?.publicId ?? row.request?.publicId ?? (sw ? "Pendekezo la huduma" : "Service recommendation")}</Text><Text style={styles.muted}>{safetyLabel(row.decision.reviewStatus ?? "pending_review",sw)}</Text></View><Ionicons name={selected === row.decision._id ? "chevron-up" : "chevron-down"} size={19} color={colors.inkMuted} /></Pressable>
        <Text style={styles.muted}>{[row.decision.district, row.decision.region].filter(Boolean).join(" · ")}</Text>
        {selected === row.decision._id ? <View style={styles.detail}>
          <Text style={styles.section}>{sw ? "Sababu za pendekezo" : "Why this match"}</Text>{row.decision.explanation.length ? row.decision.explanation.map((reason, index) => <Text key={index} style={styles.body}>• {reason}</Text>) : <Text style={styles.muted}>{sw ? "Hakuna maelezo yaliyohifadhiwa." : "No explanation recorded."}</Text>}
          {row.decision.safetyFlags.length ? <><Text style={styles.section}>{sw ? "Tahadhari za usalama" : "Safety flags"}</Text>{row.decision.safetyFlags.map((flag, index) => <Text key={index} style={styles.warning}>• {flag === "immediate_safety_review_required" ? (sw?"Mapitio ya usalama yanahitajika kabla ya kuendelea.":"A safety review is required before proceeding.") : (sw?"Timu inahitaji kukagua tahadhari hii.":"The team needs to review this safety flag.")}</Text>)}</> : null}
          <Text style={styles.section}>{sw ? "Huduma zilizopendekezwa" : "Recommended services"}</Text>{row.recommendedServices.length ? row.recommendedServices.map((service) => <Text key={service._id} style={styles.body}>• {service.name} · {service.district ?? service.region ?? "—"} · {service.currentIntakeState ?? "—"}</Text>) : <Text style={styles.muted}>{sw ? "Hakuna huduma iliyopo kwenye rekodi." : "No current service record."}</Text>}
          {row.case && access?.roles.some(role=>["admin","supervisor"].includes(role)) ? <Button label={sw ? "Angalia kesi" : "Open case"} variant="quiet" onPress={() => router.push({ pathname: "/case/[id]", params: { id: row.case!._id } })} /> : null}
          {row.decision.reviewNote ? <Surface tone="teal"><Text style={styles.section}>{sw?"Sababu iliyohifadhiwa":"Recorded reason"}</Text><Text style={styles.body}>{row.decision.reviewNote}</Text><Text style={styles.muted}>{row.decision.reviewedAt ? new Date(row.decision.reviewedAt).toLocaleString(sw?"sw-TZ":"en-TZ",{timeZone:"Africa/Dar_es_Salaam"})+" · EAT" : ""}</Text></Surface> : null}
          {row.decision.restrictionReason && row.decision.restrictionReason !== row.decision.reviewNote ? <Surface tone="orange"><Text style={styles.section}>{sw?"Sababu ya ulinzi":"Protection reason"}</Text><Text style={styles.body}>{row.decision.restrictionReason}</Text></Surface> : null}
          {params.history!=="1" ? <><Text style={styles.section}>{sw ? "Uamuzi wa mapitio" : "Review decision"}</Text><View style={styles.filters}>{(["approved", "needs_changes", "escalated", "restricted"] as Decision[]).map((choice) => <Pressable key={choice} accessibilityRole="radio" accessibilityState={{ checked: decision === choice }} aria-checked={decision === choice} onPress={() => {setDecision(choice);setConfirmation(null);}} style={[styles.filter, decision === choice && styles.filterOn]}><Text style={[styles.filterText, decision === choice && styles.filterTextOn]}>{safetyActionLabel(choice,sw)}</Text></Pressable>)}</View>
          <TextInput accessibilityLabel={sw ? "Sababu ya uamuzi" : "Decision reason"} multiline value={note} onChangeText={value=>{setNote(value);setConfirmation(null);}} maxLength={2000} placeholder={sw ? "Andika sababu na hatua inayofuata" : "Record reason and next action"} placeholderTextColor={colors.inkMuted} style={styles.input} />
          {error ? <Text style={styles.warning}>{error}</Text> : null}<Button label={sw ? "Pitia uamuzi" : "Review decision"} loading={busy} disabled={!decision} onPress={() => { if(note.trim().length<10){setError(sw?"Andika sababu ya angalau herufi 10.":"Write a reason of at least 10 characters.");return;} if(decision)setConfirmation({status:decision,note:note.trim(),reviewedAt:row.decision.reviewedAt??0,previousStatus:row.decision.reviewStatus??"pending_review"}); }} />
          {confirmation ? <Surface tone="pink"><Text style={styles.title}>{sw?"Thibitisha":"Confirm"}: {safetyLabel(confirmation.status,sw)}</Text><Text style={styles.body}>{confirmation.note}</Text><Button label={sw?"Thibitisha na hifadhi":"Confirm and save"} loading={busy} onPress={()=>void save()}/><Button label={sw?"Hariri":"Edit"} variant="secondary" onPress={()=>setConfirmation(null)}/></Surface> : null}</> : null}
        </View> : null}
      </Surface>)}
      <Text style={styles.foot}>{sw ? "Orodha inaonyesha hadi maamuzi 100 ya hivi karibuni katika kila kundi." : "Each view shows up to 100 recent decisions."}</Text>
    </>}
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }, filter: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md }, filterOn: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, filterText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 12, textTransform: "capitalize" }, filterTextOn: { color: colors.surface },
  count: { marginTop: spacing.lg, color: colors.burgundy, fontFamily: type.bold, fontSize: 13 }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm }, icon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 19 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 13, marginTop: spacing.md }, warning: { color: colors.orange, fontFamily: type.bold, fontSize: 13, lineHeight: 20 }, detail: { borderTopWidth: 1, borderColor: colors.line, marginTop: spacing.md, paddingTop: spacing.md, gap: spacing.sm }, input: { minHeight: 95, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, fontFamily: type.regular, textAlignVertical: "top" }, foot: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, marginTop: spacing.md },
});
