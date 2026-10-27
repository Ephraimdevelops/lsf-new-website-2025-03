import { displayLabel } from "../../../shared/plainLanguage";
import type { Id } from "../../../convex/_generated/dataModel";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import { CivicPageHeader as AppHeader } from "../../src/components/CivicPageHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

const modeLabels = {
  phone: { sw: "Kwa simu", en: "Phone call", icon: "call-outline" },
  remote: { sw: "Mtandaoni", en: "Remote meeting", icon: "videocam-outline" },
  in_person: { sw: "Ana kwa ana", en: "In person", icon: "location-outline" },
} as const;

export default function AppointmentDetailScreen() {
  useSensitiveScreenProtection("appointment-details");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const appointment = useQuery(api.caseManagement.getAppointment, isSignedIn && id ? { appointmentId: id as Id<"case_appointments"> } : "skip");
  const workRole = appointment?.context === "work" && (access?.roles.some(role => ["paralegal", "provider_staff"].includes(role)) ?? false);

  return <Screen footer={workRole ? <ParalegalNavigation current="cases" /> : undefined}>
    <AppHeader back title={sw ? "Maelezo ya miadi" : "Appointment details"} compact />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Ingia kuona miadi yako" : "Sign in to view your appointment"} body={sw ? "Ingia kwenye akaunti yako kuona muda na mahali pa miadi." : "Sign in to see the time and location of your appointment."} action={sw ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} />
    : appointment === undefined ? <State icon="hourglass-outline" title={sw ? "Inafungua miadi…" : "Loading appointment"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
    : !appointment ? <State icon="calendar-outline" title={sw ? "Miadi haipatikani" : "Appointment not found"} body={sw ? "Huenda imebadilika au huna ruhusa ya kuiona." : "It may have changed, or you may not have access to it."} action={sw ? "Angalia miadi yote" : "View all appointments"} onPress={() => router.replace(workRole ? "/work-appointments" : "/appointments")} />
    : <>
      {workRole ? <ParalegalIntro pose="contact" title={new Date(appointment.startsAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam", day: "numeric", month: "long", year: "numeric" })} body={`${new Date(appointment.startsAt).toLocaleTimeString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam", hour: "numeric", minute: "2-digit" })} · ${displayLabel(appointment.status, locale)}`} /> : <View style={styles.hero}>
        <View style={styles.heroTop}><View style={styles.heroIcon}><Ionicons name="calendar-outline" size={29} color={colors.surface} /></View><Text style={styles.status}>{appointment.status === "scheduled" ? (sw ? "Imepangwa" : "Scheduled") : appointment.status === "completed" ? (sw ? "Imekamilika" : "Completed") : appointment.status === "cancelled" ? (sw ? "Imefutwa" : "Cancelled") : (sw ? "Haikufanyika" : "Missed")}</Text></View>
        <Text style={styles.heroTitle}>{new Date(appointment.startsAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam", weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text>
        <Text style={styles.heroTime}>{new Date(appointment.startsAt).toLocaleTimeString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam", hour: "numeric", minute: "2-digit" })}</Text>
      </View>}

      <View style={styles.detailCard}>
        <Detail icon={modeLabels[appointment.mode].icon} label={sw ? "Namna ya kukutana" : "Meeting method"} value={modeLabels[appointment.mode][locale]} />
        {appointment.location ? <Detail icon="location-outline" label={sw ? "Mahali" : "Location"} value={appointment.location} /> : null}
        <Detail icon="folder-outline" label={sw ? "Kesi" : "Case"} value={appointment.casePublicId} />
      </View>

      {appointment.statusNote ? <View style={styles.note}><Ionicons name="information-circle-outline" size={20} color={colors.burgundy} /><Text style={styles.noteText}>{appointment.statusNote}</Text></View> : null}

      {appointment.status === "scheduled" ? <View style={styles.prepare}>
        <Text style={styles.sectionTitle}>{sw ? "Kabla ya miadi" : "Before your appointment"}</Text>
        <Text style={styles.prepareText}>{workRole ? (sw ? "Kagua kesi na maelezo ya miadi. Kubalianeni hatua inayofuata na anayeomba msaada." : "Review the case and meeting details. Agree on the next step with the person seeking help.") : sw ? "Andaa maswali yako. Leta nyaraka ikiwa ni salama. Uliza timu yako ukihitaji maelekezo." : "Prepare your questions. Bring documents if safe. Ask your team if you need directions."}</Text>
        <Pressable accessibilityRole="button" style={styles.toolLink} onPress={() => router.push(workRole ? { pathname: "/case/[id]", params: { id: appointment.caseId, section: "documents" } } : "/documents")}><Ionicons name="document-text-outline" size={20} color={colors.burgundy} /><Text style={styles.toolText}>{sw ? "Angalia nyaraka zangu" : "View my documents"}</Text><Ionicons name="chevron-forward" size={18} color={colors.burgundy} /></Pressable>
      </View> : null}

      <Button label={sw ? "Fungua kesi" : "Open case"} onPress={() => router.push({ pathname: "/case/[id]", params: { id: appointment.caseId } })} />
      <Text style={styles.footer}>{sw ? "Ikiwa muda au mahali si sahihi, wasiliana na timu yako kupitia kesi." : "If the time or location is wrong, contact your team through the case."}</Text>
    </>}
  </Screen>;
}

function Detail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.detailRow}><View style={styles.detailIcon}><Ionicons name={icon} size={20} color={colors.burgundy} /></View><View style={styles.detailCopy}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View></View>;
}

function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) {
  return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateBody}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.sm },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroIcon: { width: 50, height: 50, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  status: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: "#FBE6EB", color: colors.burgundy, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: type.bold, fontSize: 12 },
  heroTitle: { marginTop: spacing.md, fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 },
  heroTime: { fontFamily: type.medium, color: "#FBE6EB", fontSize: 17 },
  detailCard: { marginTop: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.lg },
  detailRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  detailIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  detailCopy: { flex: 1 }, detailLabel: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 }, detailValue: { marginTop: 3, fontFamily: type.bold, color: colors.ink, fontSize: 15 },
  note: { marginTop: spacing.lg, flexDirection: "row", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.md },
  noteText: { flex: 1, fontFamily: type.regular, color: colors.ink, fontSize: 13, lineHeight: 19 },
  prepare: { marginVertical: spacing.xl, gap: spacing.sm }, sectionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 19 }, prepareText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  toolLink: { marginTop: spacing.sm, minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }, toolText: { flex: 1, fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  footer: { marginTop: spacing.md, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  state: { marginTop: spacing.xxl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl, alignItems: "center", gap: spacing.md }, stateTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 20, textAlign: "center" }, stateBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
});
