import { plainError } from "../../../shared/plainLanguage";
import { finalChecks } from "../../../shared/workCaseJourney";
import { AdminIntro } from "../../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { AdminScreen as Screen } from "../../src/admin/AdminScreen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function ClosureReviewScreen() {
  useSensitiveScreenProtection("closure-review");
  const { id } = useLocalSearchParams<{ id: string }>(); const caseId = id as Id<"cases">;
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const details = useQuery(api.caseManagement.getCase, allowed && id ? { caseId } : "skip");
  const updateStatus = useMutation(api.caseManagement.updateStatus);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const terminal = details?.case.status === "closed";
  const eligible = details?.case.status === "resolved" || details?.case.status === "closed_unresolved";
  async function close() {
    if (!details || busy || !eligible || !details.closureReadiness?.canClose) return;
    setBusy(true); setError("");
    try { await updateStatus({ caseId, status: "closed", expectedVersion: details.case.version }); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  return <Screen>
    <AppHeader back title={sw ? "Kagua kabla ya kufunga kesi" : "Finish case"} eyebrow="LSF · QUALITY REVIEW" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} /> : details === undefined ? <State text={sw ? "Inapakia kesi..." : "Loading case..."} /> : !details ? <State text={sw ? "Kesi haipatikani." : "Case not found."} /> : <>
      <AdminIntro icon="book-outline" eyebrow="LSF" title={details.case.publicId} description={sw ? "Kagua matokeo, nyaraka na maoni kabla ya kufunga." : "Check outcome, documents and feedback before closing."} />
      <Surface tone={details.closureReadiness?.canClose ? "teal" : "orange"}><Text style={styles.title}>{terminal ? (sw ? "Kesi imefungwa" : "Case is closed") : details.closureReadiness?.canClose ? (sw ? "Vigezo vimekamilika" : "Checks are complete") : (sw ? "Kuna hatua ambazo hazijakamilika" : "There are outstanding steps")}</Text><Text style={styles.body}>{sw ? "Hali" : "Status"}: {details.case.status.replaceAll("_", " ")}</Text></Surface>
      <Surface><Text style={styles.section}>{sw ? "Orodha ya uhakiki" : "Closure checklist"}</Text>{details.closureReadiness ? <>
        <Text style={styles.body}>{sw ? "Gusa hatua ili kuikamilisha. Si lazima mtu ajibu maoni kabla ya kufunga." : "Tap a check to complete it. The person does not need to reply to feedback before closure."}</Text>
        {finalChecks.map(check => <Button key={check.key} variant="quiet" label={`${details.closureReadiness!.requirements[check.key] ? '✓' : '○'} ${sw ? check.sw : check.label}`} onPress={() => check.key === 'reviewRequestsResolved' ? router.push('/supervision') : router.push({ pathname: '/case/[id]', params: { id: caseId, section: check.area === 'outcome' ? 'feedback' : check.area } })} />)}
      </> : <Text style={styles.body}>{sw ? "Orodha haipatikani kwa akaunti hii." : "Checklist is unavailable for this account."}</Text>}</Surface>
      {details.outcome ? <Surface><Text style={styles.section}>{sw ? "Matokeo" : "Outcome"}</Text><Text style={styles.title}>{details.outcome.outcomeCode.replaceAll("_", " ")}</Text><Text style={styles.body}>{details.outcome.summary}</Text></Surface> : null}
      <Surface><Text style={styles.section}>{sw ? "Hatua zinazofuata" : "Next actions"}</Text><Button label={sw ? "Pitia kesi na nyaraka" : "Review case and documents"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: caseId } })} />{!terminal ? <Button label={sw ? "Pitia mtoa msaada" : "Review provider assignment"} variant="quiet" onPress={() => router.push({ pathname: "/case-matching/[id]", params: { id: caseId } })} /> : null}</Surface>
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.warning}>{error}</Text></Surface> : null}
      {eligible && !terminal ? <Button label={sw ? "Funga kesi" : "Close case"} disabled={!details.closureReadiness?.canClose || busy} loading={busy} onPress={() => Alert.alert(sw ? "Funga kesi?" : "Close this case?", sw ? "Mnufaika ataona hali mpya. Hakikisha taarifa zote zimekaguliwa." : "The beneficiary will see the new status. Confirm all checks are complete.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Funga" : "Close", onPress: () => void close() }])} /> : null}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Check({ ok, label }: { ok: boolean; label: string }) { return <View style={styles.check}><Ionicons name={ok ? "checkmark-circle" : "ellipse-outline"} size={21} color={ok ? colors.success : colors.orange} /><Text style={styles.body}>{label}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 17, marginBottom: spacing.sm }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, warning: { color: colors.orange, fontFamily: type.medium, fontSize: 13, lineHeight: 20 }, check: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginVertical: spacing.xs } });
