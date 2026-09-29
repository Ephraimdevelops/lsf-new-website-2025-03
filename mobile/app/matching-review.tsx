import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Decision = "approved" | "needs_changes" | "escalated" | "restricted";
type Filter = "pending_review" | "escalated" | "restricted" | "all";

export default function MatchingReviewScreen() {
  useSensitiveScreenProtection("matching-review");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [filter, setFilter] = useState<Filter>("pending_review");
  const [selected, setSelected] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role));
  const records = useQuery(api.justiceServices.staffMatchingDecisionQueue, allowed ? filter === "all" ? {} : { status: filter } : "skip");
  const review = useMutation(api.justiceServices.reviewMatchingDecision);
  const active = records?.find(({ decision: item }) => item._id === selected);

  async function save() {
    if (!active || !decision || busy) return;
    if (note.trim().length < 10) { setError(sw ? "Andika sababu ya uamuzi (herufi 10 au zaidi)." : "Add a reason for this decision (at least 10 characters)."); return; }
    setBusy(true); setError("");
    try {
      await review({ decisionId: active.decision._id as Id<"matching_decisions">, status: decision, reviewNote: note.trim(), restrictionReason: decision === "restricted" ? note.trim() : undefined });
      setSelected(null); setDecision(null); setNote("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Mapitio ya ulinganishaji" : "Matching review"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inapakia ruhusa..." : "Loading access..."}</Text></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF au ulinzi inahitajika." : "An LSF or safeguarding role is required."}</Text></Surface> : <>
      <View style={styles.hero}><Ionicons name="git-compare-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Pitia pendekezo kabla ya hatua inayofuata." : "Review the match before the next step."}</Text><Text style={styles.heroBody}>{sw ? "Kagua sababu, huduma zilizopendekezwa na ishara za usalama. Uamuzi huu hautumi rufaa kwa mtoa huduma." : "Check the reasons, proposed services and safety flags. This decision does not send a referral to a provider."}</Text></View>
      <View style={styles.filters}>{(["pending_review", "escalated", "restricted", "all"] as Filter[]).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: filter === item }} style={[styles.filter, filter === item && styles.filterOn]} onPress={() => { setFilter(item); setSelected(null); }}><Text style={[styles.filterText, filter === item && styles.filterTextOn]}>{item === "pending_review" ? (sw ? "Mapya" : "Pending") : item === "escalated" ? (sw ? "Yamepandishwa" : "Escalated") : item === "restricted" ? (sw ? "Yamezuiwa" : "Restricted") : (sw ? "Yote" : "All")}</Text></Pressable>)}</View>
      <Text style={styles.count}>{records === undefined ? (sw ? "Inapakia..." : "Loading...") : `${records.length} ${sw ? "maamuzi ya hivi karibuni" : "recent decisions"}`}</Text>
      {records?.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna maamuzi katika kundi hili." : "No matching decisions in this group."}</Text></Surface> : null}
      {records?.map((row) => <Surface key={row.decision._id} tone={row.decision.urgency === "immediate_safety" ? "orange" : "white"}>
        <Pressable accessibilityRole="button" onPress={() => { setSelected(selected === row.decision._id ? null : row.decision._id); setDecision(null); setNote(""); setError(""); }} style={styles.row}><View style={styles.icon}><Ionicons name={row.decision.safetyFlags.length ? "shield-outline" : "compass-outline"} size={23} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{row.case?.publicId ?? row.request?.publicId ?? (sw ? "Pendekezo la huduma" : "Service recommendation")}</Text><Text style={styles.muted}>{row.decision.issueCategory ?? row.decision.source} · {row.decision.reviewStatus ?? "pending_review"}</Text></View><Ionicons name={selected === row.decision._id ? "chevron-up" : "chevron-down"} size={19} color={colors.inkMuted} /></Pressable>
        <Text style={styles.muted}>{[row.decision.district, row.decision.region, row.decision.urgency].filter(Boolean).join(" · ")}</Text>
        {selected === row.decision._id ? <View style={styles.detail}>
          <Text style={styles.section}>{sw ? "Sababu za pendekezo" : "Why this match"}</Text>{row.decision.explanation.length ? row.decision.explanation.map((reason, index) => <Text key={index} style={styles.body}>• {reason}</Text>) : <Text style={styles.muted}>{sw ? "Hakuna maelezo yaliyohifadhiwa." : "No explanation recorded."}</Text>}
          {row.decision.safetyFlags.length ? <><Text style={styles.section}>{sw ? "Tahadhari za usalama" : "Safety flags"}</Text>{row.decision.safetyFlags.map((flag, index) => <Text key={index} style={styles.warning}>• {flag}</Text>)}</> : null}
          <Text style={styles.section}>{sw ? "Huduma zilizopendekezwa" : "Recommended services"}</Text>{row.recommendedServices.length ? row.recommendedServices.map((service) => <Text key={service._id} style={styles.body}>• {service.name} · {service.district ?? service.region ?? "—"} · {service.currentIntakeState ?? "—"}</Text>) : <Text style={styles.muted}>{sw ? "Hakuna huduma iliyopo kwenye rekodi." : "No current service record."}</Text>}
          {row.case ? <Button label={sw ? "Angalia kesi" : "Open case"} variant="quiet" onPress={() => router.push({ pathname: "/case/[id]", params: { id: row.case!._id } })} /> : null}
          <Text style={styles.section}>{sw ? "Uamuzi wa mapitio" : "Review decision"}</Text><View style={styles.filters}>{(["approved", "needs_changes", "escalated", "restricted"] as Decision[]).map((choice) => <Pressable key={choice} accessibilityRole="radio" accessibilityState={{ checked: decision === choice }} onPress={() => setDecision(choice)} style={[styles.filter, decision === choice && styles.filterOn]}><Text style={[styles.filterText, decision === choice && styles.filterTextOn]}>{choice.replaceAll("_", " ")}</Text></Pressable>)}</View>
          <TextInput accessibilityLabel={sw ? "Sababu ya uamuzi" : "Decision reason"} multiline value={note} onChangeText={setNote} placeholder={sw ? "Andika sababu na hatua inayofuata" : "Record reason and next action"} placeholderTextColor={colors.inkMuted} style={styles.input} />
          {error ? <Text style={styles.warning}>{error}</Text> : null}<Button label={sw ? "Hifadhi uamuzi" : "Save review decision"} loading={busy} disabled={!decision} onPress={() => Alert.alert(sw ? "Thibitisha uamuzi" : "Confirm review", sw ? "Hakikisha sababu na hali viko sahihi." : "Check the status and reason before saving.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Hifadhi" : "Save", onPress: () => void save() }])} />
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
