import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const statusLabels: Record<string, { sw: string; en: string }> = {
  scheduled: { sw: "Imepangwa", en: "Scheduled" },
  completed: { sw: "Imekamilika", en: "Completed" },
  cancelled: { sw: "Imefutwa", en: "Cancelled" },
  missed: { sw: "Haikufanyika", en: "No-show" },
};

function formatDate(timestamp: number, locale: "sw" | "en") {
  return new Date(timestamp).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AppointmentsScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ providerName?: string; providerDistrict?: string; providerPhone?: string }>();
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | "">("");
  const [preferredMode, setPreferredMode] = useState<"phone" | "remote" | "in_person">("phone");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const myCases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const appointments = useQuery(api.caseManagement.myAppointments, isSignedIn ? {} : "skip");
  const requestAppointment = useMutation(api.caseManagement.requestAppointment);
  const upcomingCount = appointments?.filter((appointment) => appointment.status === "scheduled").length ?? 0;
  const openCases = myCases?.filter((record) => !["resolved", "closed_unresolved", "closed"].includes(record.status)) ?? [];

  async function submitAppointmentRequest() {
    if (!selectedCaseId) {
      setNotice({
        type: "error",
        text: locale === "sw" ? "Chagua kesi au ombi lililofunguliwa kwanza." : "Choose an open case first.",
      });
      return;
    }
    setSubmitting(true);
    setNotice(null);
    try {
      await requestAppointment({
        caseId: selectedCaseId,
        preferredMode,
        preferredTime: preferredTime.trim() || undefined,
        note: [
          params.providerName ? `Preferred provider: ${params.providerName}` : "",
          params.providerDistrict ? `Provider district: ${params.providerDistrict}` : "",
          params.providerPhone ? `Provider phone: ${params.providerPhone}` : "",
          note.trim(),
        ].filter(Boolean).join("\n") || undefined,
      });
      setPreferredTime("");
      setNote("");
      setNotice({
        type: "success",
        text: locale === "sw" ? "Ombi la miadi limetumwa kwa timu ya kesi." : "Appointment request sent to the case team.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : locale === "sw" ? "Ombi halijatumwa." : "Request was not sent.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <BrandMark markOnly size="small" />
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.bookingHero}>
        <Text style={styles.heroKicker}>{locale === "sw" ? "WEKA MIADI KWA UHAKIKA" : "BOOK WITH CONFIDENCE"}</Text>
        <Text style={styles.bookingTitle}>{locale === "sw" ? "Chagua aina ya msaada unaohitaji." : "Choose the kind of help you need."}</Text>
        <Text style={styles.heroBody}>{locale === "sw" ? "Kutana na paralegal, jiunge na kliniki ya kisheria, au panga ushauri kwa simu." : "Meet a verified paralegal, join a legal clinic, or get a phone consultation."}</Text>
      </View>
      <View style={styles.options}>
        <BookingOption icon="call-outline" title={locale === "sw" ? "Ushauri kwa simu" : "Phone consultation"} meta={locale === "sw" ? "Zungumza na paralegal" : "Talk to a paralegal"} active={preferredMode === "phone"} onPress={() => setPreferredMode("phone")} />
        <BookingOption icon="videocam-outline" title={locale === "sw" ? "Msaada mtandaoni" : "Virtual support"} meta={locale === "sw" ? "Mazungumzo salama ya video" : "Secure remote session"} active={preferredMode === "remote"} onPress={() => setPreferredMode("remote")} />
        <BookingOption icon="people-outline" title={locale === "sw" ? "Kukutana ana kwa ana" : "In-person meeting"} meta={locale === "sw" ? "Kliniki au ofisi ya LSF" : "Clinic or LSF office"} active={preferredMode === "in_person"} onPress={() => setPreferredMode("in_person")} />
      </View>

      {params.providerName ? (
        <View style={styles.providerContext}>
          <Text style={styles.contextKicker}>{locale === "sw" ? "Mtoa msaada uliemchagua" : "Preferred support provider"}</Text>
          <Text style={styles.contextTitle}>{params.providerName}</Text>
          <Text style={styles.contextText}>
            {[params.providerDistrict, params.providerPhone].filter(Boolean).join(" · ")}
          </Text>
        </View>
      ) : null}

      {!isSignedIn ? (
        <View style={styles.empty}>
          <Ionicons name="lock-closed-outline" size={38} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona miadi yako" : "Sign in to view appointments"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Miadi inahusishwa na ombi, kesi, au mtoa huduma. Akaunti inalinda taarifa hizo."
              : "Appointments are linked to a request, case, or service provider. Your account protects those details."}
          </Text>
          <Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
        </View>
      ) : (
        <>
          <View style={styles.requestPanel}>
            <Text style={styles.panelTitle}>{locale === "sw" ? "Omba miadi" : "Request an appointment"}</Text>
            <Text style={styles.panelText}>
              {locale === "sw"
                ? "Miadi inaunganishwa na kesi ili timu ya LSF iweze kufuatilia kwa usalama."
                : "Appointments are tied to a case so the LSF team can follow up safely."}
            </Text>
            {openCases.length === 0 ? (
              <View style={styles.inlineEmpty}>
                <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna kesi iliyo wazi" : "No open case yet"}</Text>
                <Text style={styles.emptyText}>
                  {locale === "sw" ? "Anza ombi la msaada kwanza, kisha unaweza kuomba miadi." : "Start a help request first, then you can request an appointment."}
                </Text>
                <Button label={locale === "sw" ? "Anza ombi" : "Start request"} onPress={() => router.push("/intake")} />
              </View>
            ) : (
              <>
                <Text style={styles.inputLabel}>{locale === "sw" ? "Chagua kesi" : "Choose case"}</Text>
                <View style={styles.casePicker}>
                  {openCases.slice(0, 4).map((record) => (
                    <Pressable
                      key={record._id}
                      style={[styles.caseChoice, selectedCaseId === record._id && styles.caseChoiceActive]}
                      onPress={() => setSelectedCaseId(record._id)}
                    >
                      <Text style={[styles.caseChoiceTitle, selectedCaseId === record._id && styles.caseChoiceTitleActive]}>{record.publicId}</Text>
                      <Text style={[styles.caseChoiceText, selectedCaseId === record._id && styles.caseChoiceTextActive]} numberOfLines={2}>{record.summary}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.inputLabel}>{locale === "sw" ? "Muda unaopendelea" : "Preferred time"}</Text>
                <TextInput
                  value={preferredTime}
                  onChangeText={setPreferredTime}
                  placeholder={locale === "sw" ? "Mfano: Jumatatu asubuhi au 20 Mei saa 10:00" : "Example: Monday morning or 20 May at 10:00"}
                  placeholderTextColor={colors.inkMuted}
                  style={styles.input}
                />
                <Text style={styles.inputLabel}>{locale === "sw" ? "Ujumbe kwa timu" : "Note for the team"}</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  multiline
                  maxLength={600}
                  placeholder={locale === "sw" ? "Eleza unachohitaji kujadili..." : "Explain what you need to discuss..."}
                  placeholderTextColor={colors.inkMuted}
                  style={[styles.input, styles.noteInput]}
                />
                {notice ? <Text style={[styles.notice, notice.type === "error" && styles.noticeError]}>{notice.text}</Text> : null}
                <Button label={submitting ? (locale === "sw" ? "Inatuma..." : "Sending...") : (locale === "sw" ? "Tuma ombi la miadi" : "Send appointment request")} loading={submitting} disabled={submitting} onPress={() => void submitAppointmentRequest()} />
              </>
            )}
          </View>

          {appointments?.length ? (
            <>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}><Ionicons name="calendar-outline" size={22} color={colors.burgundy} /></View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>{locale === "sw" ? `${upcomingCount} ijayo` : `${upcomingCount} upcoming`}</Text>
              <Text style={styles.summaryText}>{locale === "sw" ? "Miadi iliyopangwa inaonekana kwanza." : "Scheduled appointments appear first."}</Text>
            </View>
          </View>
          {appointments.map((appointment) => (
            <Pressable
              key={appointment._id}
              style={styles.card}
              onPress={() => router.push({ pathname: "/case/[id]", params: { id: appointment.caseId } })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.date}>{formatDate(appointment.startsAt, locale)}</Text>
                <Text style={[
                  styles.status,
                  appointment.status === "completed" ? styles.completed : null,
                  appointment.status === "cancelled" || appointment.status === "missed" ? styles.warning : null,
                ]}>
                  {statusLabels[appointment.status]?.[locale] ?? appointment.status}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name={appointment.mode === "phone" ? "call-outline" : appointment.mode === "remote" ? "videocam-outline" : "location-outline"} size={18} color={colors.burgundy} />
                <Text style={styles.meta}>{appointment.mode.replaceAll("_", " ")}{appointment.location ? ` · ${appointment.location}` : ""}</Text>
              </View>
              <Text style={styles.caseRef}>{appointment.casePublicId}</Text>
              {appointment.statusNote ? <Text style={styles.note}>{appointment.statusNote}</Text> : null}
            </Pressable>
          ))}
            </>
          ) : (
            <View style={styles.emptyCompact}>
              <Ionicons name="calendar-outline" size={30} color={colors.burgundy} />
              <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna miadi iliyopangwa bado" : "No scheduled appointments yet"}</Text>
              <Text style={styles.emptyText}>
                {locale === "sw" ? "Ukiomba miadi, timu ya kesi itaithibitisha hapa." : "After you request one, your case team can confirm it here."}
              </Text>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

function BookingOption({ icon, title, meta, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; meta: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.bookingOption, active && styles.bookingOptionActive]} onPress={onPress}>
      <View style={styles.bookingIcon}><Ionicons name={icon} size={21} color={colors.burgundy} /></View>
      <View style={styles.bookingCopy}>
        <Text style={styles.bookingOptionTitle}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Ionicons name={active ? "checkmark-circle" : "chevron-forward"} size={20} color={active ? colors.teal : colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.xl },
  headerSpacer: { width: 26 },
  bookingHero: { borderRadius: 30, backgroundColor: colors.charcoal, padding: spacing.xl, gap: spacing.md, marginBottom: spacing.md },
  heroKicker: { fontFamily: type.bold, color: colors.peach, fontSize: 12, letterSpacing: 0.9 },
  bookingTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 27, lineHeight: 31, letterSpacing: -0.7 },
  heroBody: { maxWidth: 286, fontFamily: type.regular, color: colors.surface, fontSize: 13, lineHeight: 20, opacity: 0.9 },
  options: { gap: spacing.sm, marginBottom: spacing.lg },
  bookingOption: { minHeight: 76, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  bookingOptionActive: { borderColor: colors.burgundy, backgroundColor: "#FFF8FB" },
  bookingIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  bookingCopy: { flex: 1 },
  bookingOptionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  providerContext: { borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.lg, marginBottom: spacing.lg },
  contextKicker: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase" },
  contextTitle: { marginTop: 4, fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  contextText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  requestPanel: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.xl, gap: spacing.md },
  panelTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 20 },
  panelText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  inputLabel: { fontFamily: type.bold, color: colors.charcoal, fontSize: 12, marginTop: spacing.xs },
  casePicker: { gap: spacing.sm },
  caseChoice: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", padding: spacing.md },
  caseChoiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  caseChoiceTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  caseChoiceTitleActive: { color: colors.surface },
  caseChoiceText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  caseChoiceTextActive: { color: "rgba(255,255,255,0.82)" },
  input: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 13 },
  noteInput: { minHeight: 92, textAlignVertical: "top" },
  notice: { borderRadius: radius.sm, backgroundColor: colors.tealSoft, padding: spacing.sm, fontFamily: type.bold, color: colors.teal, fontSize: 12, lineHeight: 18 },
  noticeError: { backgroundColor: "#FDECEC", color: colors.danger },
  inlineEmpty: { alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.lg },
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 80, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
  emptyCompact: { alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.xl },
  emptyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 20, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, marginBottom: spacing.lg },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  summaryCopy: { flex: 1, gap: 2 },
  summaryTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 16 },
  summaryText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  date: { flex: 1, fontFamily: type.bold, color: colors.charcoal, fontSize: 15, lineHeight: 21 },
  status: { fontFamily: type.medium, color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 11, overflow: "hidden" },
  completed: { color: colors.success, backgroundColor: "#E7F4ED" },
  warning: { color: colors.danger, backgroundColor: "#FDECEC" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  meta: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, textTransform: "capitalize" },
  caseRef: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  note: { borderRadius: radius.sm, backgroundColor: "#FBF7F8", padding: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
});
