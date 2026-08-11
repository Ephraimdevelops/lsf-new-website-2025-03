import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  const { locale, t } = useLanguage();
  const appointments = useQuery(api.caseManagement.myAppointments, isSignedIn ? {} : "skip");
  const upcomingCount = appointments?.filter((appointment) => appointment.status === "scheduled").length ?? 0;

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
        <BookingOption icon="people-outline" title={locale === "sw" ? "Kukutana na paralegal" : "Paralegal meeting"} meta={locale === "sw" ? "Ana kwa ana au mtandaoni" : "In-person or remote"} active />
        <BookingOption icon="business-outline" title={locale === "sw" ? "Kliniki ya kisheria" : "Legal clinic"} meta={locale === "sw" ? "Msaada wa jamii" : "Community legal aid clinic"} />
        <BookingOption icon="call-outline" title={locale === "sw" ? "Ushauri kwa simu" : "Phone consultation"} meta={locale === "sw" ? "Zungumza na paralegal" : "Talk to a paralegal"} />
      </View>

      {isSignedIn && appointments?.length ? (
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
          <Button label={locale === "sw" ? "Omba miadi mpya" : "Request new appointment"} onPress={() => router.push("/intake")} />
        </>
      ) : (
        <View style={styles.confirmationCard}>
          <View style={styles.confirmIcon}><Ionicons name="checkmark" size={30} color={colors.surface} /></View>
          <Text style={styles.confirmTitle}>{locale === "sw" ? "Miadi imepangwa" : "Appointment confirmed"}</Text>
          <Text style={styles.confirmBody}>{locale === "sw" ? "Ushauri na Rehema Mwanga umehifadhiwa kwa mawasilisho." : "Consultation with Rehema Mwanga is ready for the presentation flow."}</Text>
          <View style={styles.detailPanel}>
            <DetailRow icon="person-outline" label={locale === "sw" ? "Paralegal" : "Paralegal"} value="Rehema Mwanga" />
            <DetailRow icon="calendar-outline" label={locale === "sw" ? "Tarehe" : "Date"} value="Thu, 15 May 2025" />
            <DetailRow icon="time-outline" label={locale === "sw" ? "Muda" : "Time"} value="10:30 AM (30 min)" />
            <DetailRow icon="call-outline" label={locale === "sw" ? "Aina" : "Type"} value={locale === "sw" ? "Ushauri kwa simu" : "Phone consultation"} />
            <DetailRow icon="pricetag-outline" label="Reference" value="HY-20250524-1123" />
          </View>
          <Button label={locale === "sw" ? "Angalia maombi yangu" : "View My Cases"} onPress={() => router.push("/(tabs)/cases")} />
        </View>
      )}
    </Screen>
  );
}

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={17} color={colors.burgundy} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function BookingOption({ icon, title, meta, active }: { icon: keyof typeof Ionicons.glyphMap; title: string; meta: string; active?: boolean }) {
  return (
    <View style={[styles.bookingOption, active && styles.bookingOptionActive]}>
      <View style={styles.bookingIcon}><Ionicons name={icon} size={21} color={colors.burgundy} /></View>
      <View style={styles.bookingCopy}>
        <Text style={styles.bookingOptionTitle}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Ionicons name={active ? "checkmark-circle" : "chevron-forward"} size={20} color={active ? colors.teal : colors.inkMuted} />
    </View>
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
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 100 },
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
  confirmationCard: { marginTop: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.md, alignItems: "center" },
  confirmIcon: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy },
  confirmTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 21, letterSpacing: -0.4 },
  confirmBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
  detailPanel: { alignSelf: "stretch", borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.md, gap: spacing.sm },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  detailLabel: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  detailValue: { flex: 1.2, fontFamily: type.bold, color: colors.charcoal, fontSize: 12, textAlign: "right" },
});
