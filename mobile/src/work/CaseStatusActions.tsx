import { useMutation } from "convex/react";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import type { FunctionReturnType } from "convex/server";
import { api } from "../backend/api";
import { Button } from "../components/Button";
import { colors, type } from "../theme";
import { workCaseJourney, finalChecks, type WorkArea } from "../../../shared/workCaseJourney";
type Details = FunctionReturnType<typeof api.caseManagement.getCase>;
export function CaseStatusActions({ details, sw, onOutcome, onArea, finishing = false }: { details: Details; sw: boolean; onOutcome: () => void; onArea: (area: WorkArea) => void; finishing?: boolean }) {
  const update = useMutation(api.caseManagement.updateStatus);
  const [confirm, setConfirm] = useState(false); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState("");
  const journey = workCaseJourney(details.case.status, Boolean(details.outcome), details.closureReadiness?.canClose, sw);
  const transition = journey.transition;
  async function save() { if (!transition || busy) return; setBusy(true); setNotice(""); try { await update({ caseId: details.case._id, status: transition as Details["case"]["status"], expectedVersion: details.case.version }); setConfirm(false); setNotice(sw ? "Imehifadhiwa. Mtu atapata taarifa." : "Saved. The person will receive an update."); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save."); } finally { setBusy(false); } }
  return <View style={styles.box}><Text style={styles.title}>{finishing ? (details.case.status === "closed" ? (sw ? "Kesi imefungwa" : "Case closed") : details.outcome ? (sw ? "Kabla ya kufunga kesi" : "Before closing the case") : (sw ? "Rekodi matokeo" : "Record the result")) : journey.title}</Text><Text style={styles.body}>{finishing && !details.outcome ? (sw ? "Rekodi msaada uliotoa kazi inapokamilika. Kazi mpya haiwezi kuongezwa baada ya kuhifadhi matokeo." : "Record the help provided when work is finished. New work cannot be added after the result is saved.") : journey.description}</Text>
    {finishing && Boolean(details.outcome) && details.closureReadiness && details.case.status !== 'closed' && <><Text style={styles.body}>{sw ? "Kuhifadhi matokeo kunaomba maoni. Si lazima mtu ajibu kabla ya kufunga." : "Saving the result asks for feedback. The person does not need to reply before closure."}</Text>{finalChecks.map(check => { const ready = details.closureReadiness!.requirements[check.key]; return ready ? <Text key={check.key} style={styles.body}>✓ {sw ? check.doneSw : check.doneLabel}</Text> : <Button key={check.key} variant="quiet" label={`${sw ? check.sw : check.label} →`} onPress={() => onArea(check.area)} />; })}</>}
    {!finishing && journey.area !== 'overview' && <Button variant="secondary" label={journey.action} onPress={() => onArea(journey.area)} />}
    {transition && (transition === 'closed' ? finishing : !finishing) && <>{confirm ? <><Text style={styles.body}>{transition === 'closed' ? (sw ? 'Funga kesi hii? Kazi mpya haiwezi kuongezwa.' : 'Close this case? No new work can be added.') : (sw ? 'Thibitisha kuwa umeanza kusaidia. Mtu ataona taarifa hii.' : 'Confirm that you have started helping. The person will see this update.')}</Text><Button label={sw ? 'Thibitisha na hifadhi' : 'Confirm and save'} loading={busy} disabled={busy} onPress={() => void save()} /><Button variant="quiet" label={sw ? 'Ghairi' : 'Cancel'} disabled={busy} onPress={() => setConfirm(false)} /></> : <Button label={transition === 'closed' ? (sw ? 'Funga kesi' : 'Close case') : (sw ? 'Anza kusaidia' : 'Start helping')} onPress={() => setConfirm(true)} />}</>}
    {finishing && !details.outcome && details.case.status !== "closed" && <Text style={styles.body}>{sw ? 'Rekodi matokeo hapa chini kazi inapokamilika.' : 'Record the result below when the work is finished.'}</Text>}

    {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
  </View>;
}
const styles = StyleSheet.create({ box: { backgroundColor: colors.tealSoft, borderRadius: 16, padding: 16, gap: 12, marginBottom: 16 }, title: { fontFamily: type.semibold, fontSize: 19, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 16, lineHeight: 23, color: colors.inkMuted } });
