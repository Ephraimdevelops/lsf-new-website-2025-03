import { BrandLoading } from '../../src/components/BrandLoading';
import { plainError } from "../../../shared/plainLanguage";
import { AdminIntro } from "../../src/admin/AdminIntro";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { AdminScreen as Screen } from "../../src/admin/AdminScreen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";
import type { Id } from "../../../convex/_generated/dataModel";

export default function DirectoryCorrectionReview() {
  useSensitiveScreenProtection("directory-correction-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role) => ["admin", "staff", "supervisor"].includes(role)) ?? false;
  const canDecide = access?.roles.some((role) => ["admin", "staff"].includes(role)) ?? false;
  const request = useQuery(api.justiceServices.getDirectoryCorrectionForReview, allowed && id ? { id: id as Id<"directory_correction_requests"> } : "skip");
  const review = useMutation(api.justiceServices.reviewDirectoryCorrection);
  const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function decide(decision: "applied" | "rejected") {
    if (!request || busy) return; setBusy(true); setError("");
    try { await review({ id: request._id, decision, note: note.trim() }); router.replace("/directory-management"); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  return <Screen>
    <AppHeader back title={sw ? "Pitia marekebisho" : "Review correction"} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia..." : "Loading..."}/></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."}</Text></Surface> : request === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia ombi..." : "Loading request..."}/></Surface> : !request ? <Surface><Text style={styles.body}>{sw ? "Ombi halipatikani." : "Request unavailable."}</Text></Surface> : <>
      <AdminIntro icon="shield-checkmark-outline" eyebrow="LSF" title={request.serviceName} description={sw ? "Marekebisho yaliyopendekezwa na mtoa huduma" : "Provider-proposed correction"} />
      <Surface><Text style={styles.title}>{sw ? "Hali ya ombi" : "Request status"}</Text><Text style={styles.body}>{request.status === "pending" ? (sw ? "Linasubiri ukaguzi" : "Awaiting review") : request.status === "applied" ? (sw ? "Marekebisho yamerekodiwa" : "Correction recorded") : (sw ? "Limekataliwa" : "Rejected")}</Text>{request.reviewNote ? <><Text style={styles.title}>{sw ? "Sababu ya uamuzi" : "Decision reason"}</Text><Text style={styles.body}>{request.reviewNote}</Text></> : null}<Text style={styles.title}>{sw ? "Aliyeomba" : "Requested by"}</Text><Text style={styles.body}>{request.requestedByName}</Text><Text style={styles.title}>{sw ? "Sababu" : "Reason"}</Text><Text style={styles.body}>{request.reason}</Text><Text style={styles.title}>{sw ? "Taarifa zinazopendekezwa" : "Proposed details"}</Text><Text style={styles.body}>{request.proposedDetails}</Text><Text style={styles.body}>{new Date(request.submittedAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></Surface>
      <Button label={sw ? "Linganisha na rekodi ya sasa" : "Compare with current record"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: request.serviceId } })} />
      {canDecide && request.status === "pending" ? <Surface tone="pink"><Text style={styles.title}>{sw ? "Hatua ya LSF" : "LSF decision"}</Text><Text style={styles.body}>{sw ? "Hariri rekodi kutoka kwenye ombi hili ili kuunganisha mabadiliko na ushahidi. Mabadiliko ya msingi yatahitaji uthibitisho mpya kabla ya kuchapishwa." : "Edit the record from this request to link the change and evidence. Material changes require re-verification before publication."}</Text><Button label={sw ? "Fungua fomu ya marekebisho" : "Edit service record"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service-form", params: { id: request.serviceId, correctionId: request._id } })} />{request.linkedServiceUpdateAt ? <Surface tone="teal"><Text style={styles.body}>{sw ? "Mabadiliko yameunganishwa" : "Linked edit recorded"}: {new Date(request.linkedServiceUpdateAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text><Text style={styles.body}>{request.linkedServiceUpdateNote}</Text></Surface> : <Text style={styles.body}>{sw ? "Hifadhi marekebisho kutoka kwenye fomu kabla ya kuweka ombi kuwa limefanyika." : "Save an edit from this request before marking it applied."}</Text>}<TextInput value={note} onChangeText={setNote} multiline maxLength={1000} style={styles.input} placeholder={sw ? "Andika ushahidi na sababu ya uamuzi" : "Record evidence and decision reason"} placeholderTextColor={colors.inkMuted} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={sw ? "Rekodi marekebisho yamefanyika" : "Mark correction applied"} disabled={busy || note.trim().length < 10 || !request.linkedServiceUpdateAt} onPress={() => void decide("applied")} /><Button label={sw ? "Kataa ombi" : "Reject request"} variant="secondary" disabled={busy || note.trim().length < 10} onPress={() => void decide("rejected")} /></Surface> : null}
    </>}
  </Screen>;
}
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26 }, heroBody: { color: colors.peach, fontFamily: type.regular, fontSize: 14 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15, marginTop: spacing.sm }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, input: { minHeight: 94, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.ink, padding: spacing.md, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 } });
