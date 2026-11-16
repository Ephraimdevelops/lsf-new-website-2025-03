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
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type, typography } from "../src/theme";

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
  const [requestOpen, setRequestOpen] = useState(Boolean(params.providerName));
  const [appointmentView, setAppointmentView] = useState<"upcoming" | "history">("upcoming");
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
  const visibleAppointments = appointments?.filter(appointment => appointmentView === "upcoming" ? appointment.status === "scheduled" : appointment.status !== "scheduled").sort((a, b) => appointmentView === "upcoming" ? a.startsAt - b.startsAt : b.startsAt - a.startsAt);
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
      <CivicPageHeader back compact title={locale === "sw" ? "Miadi yangu" : "My appointments"} onBack={() => router.back()} />
      {isSignedIn && !requestOpen ? <>
        <View style={styles.bookingHero}><View style={styles.bookingCopy}><Text style={styles.heroBody}>{locale === "sw" ? "Miadi yako na timu ya msaada." : "Your appointments with the support team."}</Text></View><CivicIllustration pose="contact" size={72} /></View>
        <Button label={locale === "sw" ? "Omba miadi" : "Request an appointment"} onPress={() => setRequestOpen(true)} />
        <View accessibilityRole="tablist" style={styles.listTabs}>{(["upcoming", "history"] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: appointmentView === value }} onPress={() => setAppointmentView(value)} style={[styles.listTab, appointmentView === value && styles.listTabActive]}><Ionicons name={value === "upcoming" ? "calendar-outline" : "time-outline"} size={20} color={appointmentView === value ? colors.teal : colors.inkMuted} /><Text style={styles.listTabText}>{value === "upcoming" ? (locale === "sw" ? "Ijayo" : "Upcoming") : (locale === "sw" ? "Historia" : "History")}{appointments ? ` · ${value === "upcoming" ? upcomingCount : appointments.length - upcomingCount}` : ""}</Text></Pressable>)}</View>
        {appointments === undefined ? <BrandLoading compact text={locale === "sw" ? "Inapakia miadi..." : "Loading appointments..."} /> : visibleAppointments?.length ? visibleAppointments.map(appointment => <Pressable accessibilityRole="button" key={appointment._id} style={styles.card} onPress={() => router.push({ pathname: "/appointment/[id]", params: { id: appointment._id } })}>
          <View style={styles.cardTop}><Ionicons name="calendar-outline" size={24} color={colors.teal} /><Text style={styles.date}>{formatDate(appointment.startsAt, locale)}</Text><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></View>
          <View style={styles.appointmentState}><Text style={styles.stateLabel}>{locale === "sw" ? "Hali ya miadi" : "Appointment status"}</Text><Text style={[styles.status, appointment.status === "completed" && styles.completed, (appointment.status === "cancelled" || appointment.status === "missed") && styles.warning]}>{statusLabels[appointment.status]?.[locale] ?? appointment.status}</Text></View>
          <View style={styles.metaRow}><Ionicons name={appointment.mode === "phone" ? "call-outline" : appointment.mode === "remote" ? "videocam-outline" : "location-outline"} size={22} color={colors.inkMuted} /><Text style={styles.meta}>{displayLabel(appointment.mode, locale)}{appointment.location ? ` · ${appointment.location}` : ""}</Text></View>
          <Text style={styles.caseRef}>{appointment.casePublicId}</Text>{appointment.statusNote ? <Text style={styles.note}>{appointment.statusNote}</Text> : null}
        </Pressable>) : <View style={styles.emptyCompact}><Ionicons name={appointmentView === "upcoming" ? "calendar-outline" : "time-outline"} size={30} color={colors.teal} /><Text style={styles.emptyTitle}>{appointmentView === "upcoming" ? (locale === "sw" ? "Hakuna miadi ijayo" : "No upcoming appointments") : (locale === "sw" ? "Hakuna historia ya miadi" : "No appointment history")}</Text><Text style={styles.emptyText}>{appointmentView === "upcoming" ? (locale === "sw" ? "Timu ikithibitisha miadi, itaonekana hapa." : "Appointments appear here once your team confirms them.") : (locale === "sw" ? "Miadi iliyokamilika, iliyofutwa au ambayo haikufanyika itaonekana hapa." : "Completed, cancelled and missed appointments appear here.")}</Text></View>}
      </> : null}
      {isSignedIn && requestOpen ? <Pressable accessibilityRole="button" disabled={submitting} onPress={() => setRequestOpen(false)} style={styles.backToList}><Ionicons name="arrow-back" size={20} color={colors.teal} /><Text style={styles.listTabText}>{locale === "sw" ? "Rudi kwenye miadi yangu" : "Back to my appointments"}</Text></Pressable> : null}
      {isSignedIn && requestOpen ? <>
      <View style={styles.bookingHero}>
        <View style={styles.bookingCopy}>
        <Text style={styles.bookingTitle}>{locale === "sw" ? "Ungependa kuzungumza vipi?" : "How would you like to meet?"}</Text>
        <Text style={styles.heroBody}>{locale === "sw" ? "Chagua njia na muda unaopendelea. Timu ya kesi itakujibu; miadi bado haijathibitishwa." : "Choose your preferred method and time. Your case team will reply; the appointment is not yet confirmed."}</Text>
        </View><CivicIllustration pose="contact" size={72} />
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
      </> : null}

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
          {requestOpen ? <View style={styles.requestPanel}>
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
                <IntakeSelect label={locale === "sw" ? "Miadi inahusu kesi ipi?" : "Which case is this appointment for?"} value={selectedCaseId} options={openCases.map(record => ({ value: record._id, label: `${record.publicId} · ${record.summary}` }))} onChange={value => { const record = openCases.find(item => item._id === value); if (record) setSelectedCaseId(record._id); }} sw={locale === "sw"} />
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
          </View> : null}

        </>
      )}
    </Screen>
  );
}

function BookingOption({ icon, title, meta, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; meta: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: Boolean(active) }} style={[styles.bookingOption, active && styles.bookingOptionActive]} onPress={onPress}>
      <View style={styles.bookingIcon}><Ionicons name={icon} size={26} color={active ? colors.teal : colors.inkMuted} /></View>
      <View style={styles.bookingCopy}>
        <Text style={styles.bookingOptionTitle}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={22} color={active ? colors.teal : colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listTabs: { flexDirection: "row", gap: 6, marginTop: 20, marginBottom: 16, backgroundColor: "#F5F6F6", borderRadius: 8, padding: 4 },
  listTab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, padding: 8, borderRadius: 6 },
  listTabActive: { backgroundColor: colors.surface },
  listTabText: { ...typography.supporting, fontFamily: type.semibold },
  backToList: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 48, marginBottom: 12 },
  bookingHero: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  bookingTitle: { ...typography.itemTitle },
  heroBody: { ...typography.supporting, marginTop: 6 },
  options: { gap: spacing.sm, marginBottom: spacing.lg },
  bookingOption: { minHeight: 72, borderRadius: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingHorizontal: 10, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  bookingOptionActive: { backgroundColor: "#F1F7F5" },
  bookingIcon: { width: 36, height: 44, alignItems: "center", justifyContent: "center" },
  bookingCopy: { flex: 1 },
  bookingOptionTitle: { ...typography.itemTitle },
  providerContext: { borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.lg, marginBottom: spacing.lg },
  contextKicker: { ...typography.metadata },
  contextTitle: { marginTop: 4, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  contextText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
  requestPanel: { marginBottom: 24, gap: 12 },
  panelTitle: { ...typography.sectionTitle },
  panelText: { ...typography.supporting },
  inputLabel: { ...typography.supporting, fontFamily: type.semibold, color: colors.ink, marginTop: 4 },
  casePicker: { gap: spacing.sm },
  caseChoice: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", padding: spacing.md },
  caseChoiceActive: { borderColor: colors.teal, backgroundColor: "#F1F7F5" },
  caseChoiceTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  caseChoiceTitleActive: { color: colors.teal },
  caseChoiceText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  caseChoiceTextActive: { color: colors.ink },
  input: { ...typography.body, minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 10 },
  noteInput: { minHeight: 92, textAlignVertical: "top" },
  notice: { borderRadius: radius.sm, backgroundColor: colors.tealSoft, padding: spacing.sm, fontFamily: type.bold, fontWeight: "700", color: colors.teal, fontSize: 13, lineHeight: 18 },
  noticeError: { backgroundColor: "#FDECEC", color: colors.danger },
  inlineEmpty: { alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.lg },
  empty: { alignItems: "center", gap: 12, paddingVertical: 24 },
  emptyCompact: { alignItems: "center", gap: 10, paddingVertical: 20, marginBottom: 16 },
  emptyTitle: { ...typography.itemTitle, textAlign: "center" },
  emptyText: { ...typography.supporting, textAlign: "center" },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, marginBottom: spacing.lg },
  summaryIcon: { width: 30, height: 40, alignItems: "center", justifyContent: "center" },
  summaryCopy: { flex: 1, gap: 2 },
  summaryTitle: { ...typography.itemTitle },
  summaryText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: "#F5F8F7", borderRadius: 8, padding: 14, marginBottom: 12, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  date: { ...typography.itemTitle, flex: 1 },
  appointmentState: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  stateLabel: { ...typography.metadata },
  status: { fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 13, overflow: "hidden" },
  completed: { color: colors.success, backgroundColor: "#E7F4ED" },
  warning: { color: colors.danger, backgroundColor: "#FDECEC" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  meta: { ...typography.supporting, flex: 1 },
  caseRef: { ...typography.metadata },
  note: { borderRadius: radius.sm, backgroundColor: "#FBF7F8", padding: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
});
