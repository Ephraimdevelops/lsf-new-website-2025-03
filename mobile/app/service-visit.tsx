import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { colors, radius, spacing, type } from "../src/theme";

type Channel = "in_person" | "phone" | "remote";
type Outcome = "helpful" | "partly_helpful" | "not_helpful";
const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] as const;

function dayFromToday(offset: number) {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + offset);
  return day;
}

function timeOnDay(day: Date, time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).getTime();
}

export default function ServiceVisitScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const { locale } = useLanguage();
  const { isSignedIn } = useAuth();
  const { updateDraft } = useIntakeDraft();
  const sw = locale === "sw";
  const service = useQuery(api.justiceServices.getPublicService, serviceId ? { id: serviceId as Id<"justice_services"> } : "skip");
  const visits = useQuery(api.justiceServices.myServiceVisits, isSignedIn ? {} : "skip");
  const planVisit = useMutation(api.justiceServices.planServiceVisit);
  const checkIn = useMutation(api.justiceServices.checkInServiceVisit);
  const cancelVisit = useMutation(api.justiceServices.cancelServiceVisit);
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState(() => dayFromToday(1));
  const [time, setTime] = useState<(typeof times)[number]>("10:00");
  const [channel, setChannel] = useState<Channel>("in_person");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const days = Array.from({ length: 7 }, (_, index) => dayFromToday(week * 7 + index));
  const channels: Channel[] = service && service.currentIntakeState !== "closed" ? [
    ...((service.walkIn || !service.appointmentRequired) ? ["in_person" as const] : []),
    ...(service.phoneSupport ? ["phone" as const] : []),
    ...(service.remoteSupport ? ["remote" as const] : []),
  ] : [];
  const chosenChannel = channels.includes(channel) ? channel : channels[0];
  const plannedFor = timeOnDay(day, time);
  const future = plannedFor > Date.now();

  async function savePlan() {
    if (!serviceId || !chosenChannel || !future || busy) return;
    setBusy(true);
    try {
      await planVisit({ serviceId: serviceId as Id<"justice_services">, plannedFor, channel: chosenChannel });
      Alert.alert(sw ? "Mpango umehifadhiwa" : "Plan saved", sw ? "Huu ni mpango wako binafsi. Thibitisha upatikanaji moja kwa moja na huduma." : "This is your personal plan. Confirm availability directly with the service.");
    } catch (caught) {
      Alert.alert(sw ? "Haikuhifadhiwa" : "Not saved", plainError(caught, locale));
    } finally {
      setBusy(false);
    }
  }

  async function recordOutcome(visitId: Id<"justice_service_visits">, outcome: Outcome) {
    if (busy) return;
    setBusy(true);
    try {
      await checkIn({ visitId, outcome, note: notes[visitId] });
    } catch (caught) {
      Alert.alert(sw ? "Haikutumwa" : "Not submitted", plainError(caught, locale));
    } finally {
      setBusy(false);
    }
  }

  async function cancel(visitId: Id<"justice_service_visits">) {
    if (busy) return;
    setBusy(true);
    try {
      await cancelVisit({ visitId });
    } catch (caught) {
      Alert.alert(sw ? "Haijaghairiwa" : "Could not cancel", plainError(caught, locale));
    } finally {
      setBusy(false);
    }
  }

  return <Screen>
    <AppHeader back title={sw ? "Ziara na ufuatiliaji" : "Visits & follow-up"} eyebrow={locale === "sw" ? "Haki Yangu · Tafuta msaada" : "Haki Yangu · Find help"} />
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="calendar-outline" size={26} color={colors.surface} /></View>
      <Text style={styles.kicker}>{sw ? "PANGA · TEMBELEA · FUATILIA" : "PLAN · VISIT · FOLLOW UP"}</Text>
      <Text style={styles.heroTitle}>{sw ? "Panga hatua yako inayofuata." : "Plan your next step."}</Text>
      <Text style={styles.heroBody}>{sw ? "Chagua muda unaokufaa. Mpango huu si miadi iliyothibitishwa na mtoa huduma." : "Choose a convenient time. This plan is not a confirmed appointment with the provider."}</Text>
    </View>
    {!isSignedIn ? <Surface tone="pink" style={styles.section}>
      <Text style={styles.title}>{sw ? "Ingia ili kuhifadhi mpango" : "Sign in to save a plan"}</Text>
      <Text style={styles.muted}>{sw ? "Mipango yako ni ya faragha na inahifadhiwa kwenye akaunti yako." : "Your plans are private and saved to your account."}</Text>
      <Button label={sw ? "Ingia" : "Sign in"} onPress={() => router.push({ pathname: "/sign-in", params: { returnTo: "service-visit", serviceId: serviceId ?? "" } })} />
    </Surface> : serviceId && service === null ? <Surface tone="pink" style={styles.section}>
      <Text style={styles.title}>{sw ? "Huduma haipatikani tena" : "Service no longer available"}</Text>
      <Text style={styles.muted}>{sw ? "Tafuta huduma nyingine iliyothibitishwa." : "Find another verified service."}</Text>
      <Button label={sw ? "Tafuta huduma" : "Find services"} onPress={() => router.replace("/nearby-help")} />
    </Surface> : serviceId ? <Surface style={styles.section}>
      <View style={styles.serviceRow}><View style={styles.serviceIcon}><Ionicons name="business-outline" size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{service?.name ?? (sw ? "Inapakia huduma..." : "Loading service...")}</Text><Text style={styles.muted}>{service ? `${service.district}, ${service.region}` : ""}</Text></View></View>
      <Text style={styles.label}>{sw ? "Chagua siku" : "Choose a day"}</Text>
      <View style={styles.weekRow}>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Wiki iliyotangulia" : "Previous week"} disabled={week === 0} onPress={() => { setWeek(week - 1); setDay(dayFromToday((week - 1) * 7)); }} style={[styles.weekArrow, week === 0 && styles.disabled]}><Ionicons name="chevron-back" size={20} color={colors.burgundy} /></Pressable>
        <Text style={styles.weekLabel}>{days[0].toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short" })} – {days[6].toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short" })}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Wiki inayofuata" : "Next week"} disabled={week === 11} onPress={() => { setWeek(week + 1); setDay(dayFromToday((week + 1) * 7)); }} style={[styles.weekArrow, week === 11 && styles.disabled]}><Ionicons name="chevron-forward" size={20} color={colors.burgundy} /></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>{days.map((choice) => {
        const selected = choice.toDateString() === day.toDateString();
        return <Pressable key={choice.toDateString()} accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} accessibilityLabel={choice.toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { weekday: "long", day: "numeric", month: "long" })} onPress={() => setDay(choice)} style={[styles.day, selected && styles.dayActive]}><Text style={[styles.dayWeek, selected && styles.selectedText]}>{choice.toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { weekday: "short" })}</Text><Text style={[styles.dayNumber, selected && styles.selectedText]}>{choice.getDate()}</Text></Pressable>;
      })}</ScrollView>
      <Text style={styles.label}>{sw ? "Chagua muda" : "Choose a time"}</Text>
      <View style={styles.timeGrid}>{times.map((choice) => {
        const selected = choice === time;
        const available = timeOnDay(day, choice) > Date.now();
        return <Pressable key={choice} accessibilityRole="radio" accessibilityState={{ checked: selected, disabled: !available }} aria-checked={selected} disabled={!available} onPress={() => setTime(choice)} style={[styles.time, selected && styles.timeActive, !available && styles.disabled]}><Text style={[styles.timeText, selected && styles.selectedText]}>{choice}</Text></Pressable>;
      })}</View>
      <Text style={styles.label}>{sw ? "Namna ya kuwasiliana" : "How you plan to connect"}</Text>
      <View style={styles.channelGrid}>{channels.map((choice) => {
        const selected = choice === chosenChannel;
        const label = choice === "in_person" ? (sw ? "Tembelea" : "Visit") : choice === "phone" ? (sw ? "Simu" : "Phone") : (sw ? "Kwa mbali" : "Remote");
        return <Pressable key={choice} accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} onPress={() => setChannel(choice)} style={[styles.channel, selected && styles.channelActive]}><Ionicons name={choice === "in_person" ? "location-outline" : choice === "phone" ? "call-outline" : "videocam-outline"} size={19} color={selected ? colors.surface : colors.burgundy} /><Text style={[styles.channelText, selected && styles.selectedText]}>{label}</Text></Pressable>;
      })}</View>
      {service && !channels.length ? <Text style={styles.warning}>{service.currentIntakeState === "closed" ? (sw ? "Huduma hii haipokei watu kwa sasa. Tafuta huduma nyingine au omba msaada kutoka LSF." : "This service is closed to new contacts. Find another service or ask LSF for help.") : (sw ? "Hakuna njia ya huduma iliyoorodheshwa. Angalia maelezo ya huduma." : "No access method is listed. Check the service details.")}</Text> : null}
      <View style={styles.reminder}><Ionicons name="information-circle-outline" size={20} color={colors.teal} /><Text style={styles.reminderText}>{sw ? "Thibitisha saa na upatikanaji moja kwa moja kabla ya kwenda." : "Confirm hours and availability directly before visiting."}</Text></View>
      <Button label={sw ? "Hifadhi mpango wangu" : "Save my plan"} loading={busy} disabled={busy || !service || !chosenChannel || !future} onPress={() => void savePlan()} />
    </Surface> : null}
    {isSignedIn ? <>
      <Text style={styles.sectionTitle}>{sw ? "Mipango yako" : "Your plans"}</Text>
      {visits === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia mipango..." : "Loading plans..."}/></Surface> : visits.length ? visits.map(({ visit, service: linkedService }) => {
        const canCheckIn = Date.now() >= visit.plannedFor - 30 * 60 * 1000;
        return <Surface key={visit._id} tone={visit.outcome === "not_helpful" ? "orange" : undefined} style={styles.visitCard}>
          <View style={styles.serviceRow}><View style={styles.serviceIcon}><Ionicons name={visit.status === "completed" ? "checkmark-circle-outline" : "calendar-outline"} size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{linkedService?.name ?? (sw ? "Huduma" : "Service")}</Text><Text style={styles.muted}>{new Date(visit.plannedFor).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text></View></View>
          <Text style={styles.visitMeta}>{visit.channel === "in_person" ? (sw ? "Kutembelea" : "Visit") : visit.channel === "phone" ? (sw ? "Simu" : "Phone") : (sw ? "Kwa mbali" : "Remote")}</Text>
          {visit.status === "planned" ? <>
            <Text style={styles.question}>{canCheckIn ? (sw ? "Je, ulipata msaada uliohitaji?" : "Did you get the help you needed?") : (sw ? "Unaweza kutoa maoni baada ya muda uliopanga." : "You can record the result after your planned time.")}</Text>
            {canCheckIn ? <><TextInput accessibilityLabel={sw ? "Maelezo ya ziara" : "Visit notes"} value={notes[visit._id] ?? ""} onChangeText={(value) => setNotes((current) => ({ ...current, [visit._id]: value }))} multiline maxLength={1000} style={styles.note} placeholder={sw ? "Maelezo ya hiari" : "Optional details"} placeholderTextColor={colors.inkMuted} /><View style={styles.stack}><Button label={sw ? "Ndiyo, nilisaidika" : "Yes, it helped"} disabled={busy} onPress={() => void recordOutcome(visit._id, "helpful")} /><Button label={sw ? "Kwa kiasi" : "Partly helped"} variant="secondary" disabled={busy} onPress={() => void recordOutcome(visit._id, "partly_helpful")} /><Button label={sw ? "Sikupata msaada" : "I did not get help"} variant="quiet" disabled={busy} onPress={() => void recordOutcome(visit._id, "not_helpful")} /></View></> : null}
            <Button label={sw ? "Ghairi mpango" : "Cancel plan"} variant="quiet" disabled={busy} onPress={() => void cancel(visit._id)} />
          </> : <Text style={styles.outcome}>{visit.status === "cancelled" ? (sw ? "Mpango ulighairiwa" : "Plan cancelled") : `${sw ? "Matokeo" : "Outcome"}: ${visit.outcome?.replaceAll("_", " ")}`}</Text>}
          {visit.outcome && visit.outcome !== "helpful" ? <Button label={sw ? "Omba msaada zaidi kutoka LSF" : "Request more help from LSF"} onPress={() => {
            updateDraft({ sourceServiceId: linkedService ? String(linkedService._id) : undefined, region: linkedService?.region ?? "", district: linkedService?.district ?? "" });
            router.push("/intake");
          }} /> : null}
        </Surface>;
      }) : <Surface><Text style={styles.muted}>{sw ? "Bado hujapanga ziara au simu." : "You have no planned visits or calls."}</Text></Surface>}
    </> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm },
  heroIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#73425A", alignItems: "center", justifyContent: "center" },
  kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 },
  heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 33 },
  heroBody: { color: "#E8E1E4", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  section: { marginTop: spacing.lg },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 20 },
  serviceRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  serviceIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 },
  muted: { marginTop: 3, color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 },
  label: { marginTop: spacing.lg, marginBottom: spacing.sm, color: colors.ink, fontFamily: type.bold, fontSize: 14 },
  weekRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  weekArrow: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  weekLabel: { color: colors.ink, fontFamily: type.bold, fontSize: 14 },
  disabled: { opacity: 0.4 },
  dayList: { gap: spacing.sm, paddingVertical: spacing.sm },
  day: { width: 55, minHeight: 65, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  dayActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy },
  dayWeek: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11 },
  dayNumber: { marginTop: 4, color: colors.ink, fontFamily: type.bold, fontSize: 18 },
  selectedText: { color: colors.surface },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  time: { width: "30.8%", minHeight: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  timeActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy },
  timeText: { color: colors.ink, fontFamily: type.bold, fontSize: 14 },
  channelGrid: { flexDirection: "row", gap: spacing.sm },
  channel: { flex: 1, minHeight: 58, borderRadius: radius.md, borderWidth: 1, borderColor: colors.burgundy, alignItems: "center", justifyContent: "center", gap: 3 },
  channelActive: { backgroundColor: colors.burgundy },
  channelText: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, textAlign: "center" },
  warning: { color: colors.warning, fontFamily: type.medium, fontSize: 13, lineHeight: 19 },
  reminder: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.tealSoft },
  reminderText: { flex: 1, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
  visitCard: { marginBottom: spacing.md },
  visitMeta: { alignSelf: "flex-start", overflow: "hidden", marginTop: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.tealSoft, paddingHorizontal: spacing.sm, paddingVertical: 4, color: colors.teal, fontFamily: type.medium, fontSize: 12 },
  question: { color: colors.ink, fontFamily: type.bold, fontSize: 13, marginTop: spacing.md },
  note: { minHeight: 76, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, textAlignVertical: "top", color: colors.ink, fontFamily: type.regular },
  stack: { gap: spacing.sm },
  outcome: { color: colors.success, fontFamily: type.bold, fontSize: 13 },
});
