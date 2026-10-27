import { BrandLoading } from "../src/components/BrandLoading";
import { displayLabel } from "../../shared/plainLanguage";
import { plainError } from "../../shared/plainLanguage";
import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
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
  missed: { sw: "Haikufanyika", en: "Did not take place" },
};

function formatDate(timestamp: number, locale: "sw" | "en") {
  return new Date(timestamp).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AppointmentsScreen() {
  const { userId } = useAuth();
  return <AccountAppointmentsScreen key={userId ?? "signed-out"} />;
}

function AccountAppointmentsScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const active = useRef(true);
  useLayoutEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const submissionLock = useRef(false);
  const attempts = useRef(new Map<string, string>());
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ providerName?: string; providerDistrict?: string; providerPhone?: string }>();
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | "">("");
  const [preferredMode, setPreferredMode] = useState<"phone" | "remote" | "in_person">("phone");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allCases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const myCases = allCases?.filter(item => item.beneficiaryId === access?.user._id);
  const appointments = useQuery(api.caseManagement.myAppointments, isSignedIn ? { context: "personal" } : "skip");
  const requestAppointment = useMutation(api.caseManagement.requestAppointment);
  const upcomingCount = appointments?.filter((appointment) => appointment.status === "scheduled").length ?? 0;
  const openCases = myCases?.filter((record) => !["resolved", "closed_unresolved", "closed"].includes(record.status)) ?? [];

  const casesLoading = access === undefined || allCases === undefined;

  async function submitAppointmentRequest() {
    if (!active.current || submissionLock.current || !isSignedIn || casesLoading) return;
    if (!selectedCaseId || !openCases.some(record => record._id === selectedCaseId)) {
      setNotice({
        type: "error",
        text: locale === "sw" ? "Chagua kesi iliyo wazi kwanza." : "Choose an open case first.",
      });
      return;
    }
    const payload = {
      caseId: selectedCaseId,
      preferredMode,
      preferredTime: preferredTime.trim() || undefined,
      note: [
        params.providerName ? `Preferred provider: ${params.providerName}` : "",
        params.providerDistrict ? `Provider district: ${params.providerDistrict}` : "",
        params.providerPhone ? `Provider phone: ${params.providerPhone}` : "",
        note.trim(),
      ].filter(Boolean).join("\n") || undefined,
    };
    const payloadKey = JSON.stringify(payload);
    // Keep uncertain attempts, including when someone edits and returns to a draft.
    let clientActionId = attempts.current.get(payloadKey);
    if (!clientActionId) {
      clientActionId = `appointment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      attempts.current.set(payloadKey, clientActionId);
    }
    submissionLock.current = true;
    setSubmitting(true);
    setNotice(null);
    try {
      await requestAppointment({ ...payload, clientActionId });
      if (!active.current) return;
      attempts.current.delete(payloadKey);
      // Do not erase edits made while the request was in flight.
      setPreferredTime(current => current.trim() === preferredTime.trim() ? "" : current);
      setNote(current => current.trim() === note.trim() ? "" : current);
      setNotice({
        type: "success",
        text: locale === "sw" ? "Ombi la miadi limetumwa kwa timu ya kesi." : "Appointment request sent to the case team.",
      });
    } catch (error) {
      if (!active.current) return;
      setNotice({
        type: "error",
        text: plainError(error, locale, locale === "sw" ? "Hatukuweza kuthibitisha ombi. Angalia taarifa kwenye kesi kabla ya kujaribu tena." : "We could not confirm the request. Check your case updates before retrying."),
      });
    } finally {
      submissionLock.current = false;
      if (active.current) setSubmitting(false);
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
        <Text style={styles.heroKicker}>{locale === "sw" ? "OMBA MIADI" : "REQUEST AN APPOINTMENT"}</Text>
        <Text style={styles.bookingTitle}>{locale === "sw" ? "Ungependa kuzungumza vipi?" : "How would you like to meet?"}</Text>
        <Text style={styles.heroBody}>{locale === "sw" ? "Chagua njia na muda unaopendelea. Timu ya kesi itakujibu; miadi bado haijathibitishwa." : "Choose your preferred method and time. Your case team will reply; the appointment is not yet confirmed."}</Text>
      </View>
      <View style={styles.options}>
        <BookingOption icon="call-outline" title={locale === "sw" ? "Ushauri kwa simu" : "Phone consultation"} meta={locale === "sw" ? "Zungumza na msaidizi wa kisheria" : "Talk to a paralegal"} active={preferredMode === "phone"} onPress={() => setPreferredMode("phone")} />
        <BookingOption icon="videocam-outline" title={locale === "sw" ? "Msaada mtandaoni" : "Virtual support"} meta={locale === "sw" ? "Omba kuzungumza mtandaoni" : "Request an online meeting"} active={preferredMode === "remote"} onPress={() => setPreferredMode("remote")} />
        <BookingOption icon="people-outline" title={locale === "sw" ? "Kukutana ana kwa ana" : "In-person meeting"} meta={locale === "sw" ? "Mahali patakubaliwa na timu yako" : "Location to be agreed with your team"} active={preferredMode === "in_person"} onPress={() => setPreferredMode("in_person")} />
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

      {!isLoaded ? <BrandLoading compact task="account" /> : !isSignedIn ? (
        <View style={styles.empty}>
          <Ionicons name="lock-closed-outline" size={38} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona miadi yako" : "Sign in to view appointments"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Ingia kwenye akaunti yako kuona au kuomba miadi ya kesi."
              : "Sign in to view or request a case appointment."}
          </Text>
          <Button label={locale === "sw" ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} />
        </View>
      ) : (
        <>
          <View style={styles.requestPanel}>
            <Text style={styles.panelTitle}>{locale === "sw" ? "Omba miadi" : "Request an appointment"}</Text>
            <Text style={styles.panelText}>
              {locale === "sw"
                ? "Chagua kesi unayoomba miadi."
                : "Choose the case for this appointment request."}
            </Text>
            {casesLoading ? <BrandLoading compact task="cases" /> : openCases.length === 0 ? (
              <View style={styles.inlineEmpty}>
                <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna kesi iliyo wazi" : "No open case yet"}</Text>
                <Text style={styles.emptyText}>
                  {locale === "sw" ? "Anza ombi la msaada. Kesi ikifunguliwa, unaweza kuomba miadi." : "Start a help request. Once a case is opened, you can request an appointment."}
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
                <Text style={styles.inputLabel}>{locale === "sw" ? "Muda unaopendelea (hiari)" : "Preferred time (optional)"}</Text>
                <TextInput
                  value={preferredTime}
                  onChangeText={setPreferredTime}
                  placeholder={locale === "sw" ? "Mfano: Jumatatu asubuhi" : "Example: Monday morning"}
                  placeholderTextColor={colors.inkMuted}
                  style={styles.input}
                />
                <Text style={styles.inputLabel}>{locale === "sw" ? "Ujumbe kwa timu (hiari)" : "Note for the team (optional)"}</Text>
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

          {appointments === undefined ? <BrandLoading compact text={locale === "sw" ? "Inafungua miadi yako…" : "Loading your appointments…"} /> : appointments.length ? (
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
              onPress={() => router.push({ pathname: "/appointment/[id]", params: { id: appointment._id } })}
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
                <Text style={styles.meta}>{displayLabel(appointment.mode, locale)}{appointment.location ? ` · ${appointment.location}` : ""}</Text>
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
                {locale === "sw" ? "Timu ikipanga miadi, itaonekana hapa." : "Appointments appear here when your case team schedules them."}
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
  heroKicker: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 13, letterSpacing: 0.9 },
  bookingTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 27, lineHeight: 31, letterSpacing: -0.7 },
  heroBody: { maxWidth: 286, fontFamily: type.regular, color: colors.surface, fontSize: 13, lineHeight: 20, opacity: 0.9 },
  options: { gap: spacing.sm, marginBottom: spacing.lg },
  bookingOption: { minHeight: 76, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  bookingOptionActive: { borderColor: colors.burgundy, backgroundColor: "#FFF8FB" },
  bookingIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  bookingCopy: { flex: 1 },
  bookingOptionTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  providerContext: { borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.lg, marginBottom: spacing.lg },
  contextKicker: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13, letterSpacing: 0.6, textTransform: "uppercase" },
  contextTitle: { marginTop: 4, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  contextText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
  requestPanel: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.xl, gap: spacing.md },
  panelTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 20 },
  panelText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  inputLabel: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13, marginTop: spacing.xs },
  casePicker: { gap: spacing.sm },
  caseChoice: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", padding: spacing.md },
  caseChoiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  caseChoiceTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  caseChoiceTitleActive: { color: colors.surface },
  caseChoiceText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  caseChoiceTextActive: { color: "rgba(255,255,255,0.82)" },
  input: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 13 },
  noteInput: { minHeight: 92, textAlignVertical: "top" },
  notice: { borderRadius: radius.sm, backgroundColor: colors.tealSoft, padding: spacing.sm, fontFamily: type.bold, fontWeight: "700", color: colors.teal, fontSize: 13, lineHeight: 18 },
  noticeError: { backgroundColor: "#FDECEC", color: colors.danger },
  inlineEmpty: { alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.lg },
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 80, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
  emptyCompact: { alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.xl },
  emptyTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 20, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, marginBottom: spacing.lg },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  summaryCopy: { flex: 1, gap: 2 },
  summaryTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 16 },
  summaryText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  date: { flex: 1, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15, lineHeight: 21 },
  status: { fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 13, overflow: "hidden" },
  completed: { color: colors.success, backgroundColor: "#E7F4ED" },
  warning: { color: colors.danger, backgroundColor: "#FDECEC" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  meta: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, textTransform: "capitalize" },
  caseRef: { fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, fontSize: 13 },
  note: { borderRadius: radius.sm, backgroundColor: "#FBF7F8", padding: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
});
