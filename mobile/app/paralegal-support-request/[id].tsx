import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { CivicPageHeader as AppHeader } from "../../src/components/CivicPageHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

const kinds: Record<string, { sw: string; en: string }> = {
  supervisor: { sw: "Mwongozo wa msimamizi", en: "Supervisor guidance" },
  challenging_case: { sw: "Kesi yenye changamoto", en: "Challenging case" },
  peer_support: { sw: "Msaada wa wenzangu", en: "Peer support" },
  wellbeing: { sw: "Ustawi wangu", en: "Wellbeing support" },
  payment: { sw: "Malipo au madai", en: "Payment or claim" },
};

export default function ParalegalSupportRequestScreen() {
  useSensitiveScreenProtection("paralegal-support-request");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const requests = useQuery(api.paralegals.mySupportRequests, allowed ? {} : "skip");
  const request = requests?.find((item) => item._id === id);

  return <Screen footer={allowed ? <ParalegalNavigation current="profile" /> : undefined}>
    <AppHeader compact back title={sw ? "Ombi langu la msaada" : "My support request"} />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Ombi lako ni la siri" : "Your request is private"} body={sw ? "Ingia kuona maendeleo yake." : "Sign in to view its progress."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !allowed ? <State icon="shield-outline" title={sw ? "Idhini inahitajika" : "Approval required"} body={sw ? "Akaunti iliyoidhinishwa ya msaidizi wa kisheria inahitajika." : "An approved paralegal account is required."} />
      : requests === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ombi" : "Loading request"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !request ? <State icon="search-outline" title={sw ? "Ombi halipatikani" : "Request not found"} body={sw ? "Huenda limeondolewa au huna ruhusa ya kuliona." : "It may have been removed, or you may not have access to it."} action={sw ? "Rudi kwenye msaada" : "Back to support"} onPress={() => router.replace("/paralegal-support")} />
      : <>
        <ParalegalIntro pose="contact" title={kinds[request.type]?.[locale] ?? request.type.replaceAll("_", " ")} body={sw ? "Timu ya LSF inaona ombi lako na hali yake inaonekana hapa." : "The LSF team can see your request and its status appears here."} />
        <View style={styles.statusCard}><Ionicons name={request.status === "responded" || request.status === "closed" ? "checkmark-circle-outline" : "time-outline"} size={26} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.label}>{sw ? "Hali ya ombi" : "Request status"}</Text><Text style={styles.status}>{request.status === "submitted" ? (sw ? "Limepokelewa" : "Received") : request.status === "in_review" ? (sw ? "Linapitiwa" : "In review") : request.status === "responded" ? (sw ? "Limejibiwa" : "Responded") : (sw ? "Limefungwa" : "Closed")}</Text></View></View>
        <Text style={styles.sectionTitle}>{sw ? "Ulichotuma" : "What you sent"}</Text><View style={styles.card}><Text style={styles.body}>{request.note}</Text><Text style={styles.date}>{new Date(request.createdAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text></View>
        <Text style={styles.sectionTitle}>{sw ? "Jibu la LSF" : "LSF response"}</Text><View style={[styles.card, styles.response]}>{request.responseNote ? <><Text style={styles.body}>{request.responseNote}</Text>{request.respondedAt ? <Text style={styles.date}>{new Date(request.respondedAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text> : null}</> : <Text style={styles.body}>{request.status === "responded" || request.status === "closed" ? (sw ? "Hakuna maelezo ya jibu yaliyorekodiwa hapa. Wasiliana na LSF ikiwa unahitaji ufafanuzi." : "No response details are recorded here. Contact LSF if you need clarification.") : (sw ? "Bado hakuna jibu lililoandikwa. Angalia tena baada ya timu kupitia ombi." : "No written response yet. Check back after the team reviews your request.")}</Text>}</View>
        <View style={styles.actions}><Button label={sw ? "Rudi kwenye msaada wangu" : "Back to my support"} variant="secondary" onPress={() => router.push("/paralegal-support")} /><Button label={sw ? "Wasiliana na LSF" : "Contact LSF"} variant="quiet" onPress={() => router.push("/support")} /></View>
      </>}
  </Screen>;
}

function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.ink, gap: spacing.sm }, heroIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, fontSize: 12, color: colors.peach }, heroTitle: { fontFamily: type.bold, fontSize: 24, lineHeight: 31, color: colors.surface }, heroBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.surface },
  statusCard: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.burgundySoft }, flex: { flex: 1 }, label: { fontFamily: type.medium, fontSize: 12, color: colors.inkMuted }, status: { marginTop: spacing.xs, fontFamily: type.bold, fontSize: 17, color: colors.burgundy }, sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, fontFamily: type.bold, fontSize: 19, color: colors.ink }, card: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md }, response: { backgroundColor: colors.greenSoft }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.ink }, date: { fontFamily: type.medium, fontSize: 12, color: colors.inkMuted }, actions: { marginTop: spacing.xl, gap: spacing.md }, state: { marginTop: spacing.xl, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, alignItems: "center", gap: spacing.md },
});
