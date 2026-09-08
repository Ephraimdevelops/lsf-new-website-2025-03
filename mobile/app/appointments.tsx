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
      ) : appointments?.length ? (
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
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={38} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna miadi bado" : "No appointments yet"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Omba msaada au fungua kesi kisha LSF itapanga miadi inayofaa."
              : "Start a request or open a case, then LSF can schedule the right appointment."}
          </Text>
          <Button label={locale === "sw" ? "Anza ombi" : "Start request"} onPress={() => router.push("/intake")} />
        </View>
      )}
    </Screen>
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
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 80, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
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
