import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function SafeguardingScreen() {
  useSensitiveScreenProtection("safeguarding");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role));
  const submitted = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "submitted" } : "skip");
  const inReview = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "under_review" } : "skip");
  const rows = [...(submitted ?? []), ...(inReview ?? [])].sort((a, b) => b.review.updatedAt - a.review.updatedAt);
  return <Screen>
    <AppHeader back title={sw ? "Foleni ya ulinzi" : "Safeguarding queue"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <Text style={styles.muted}>{sw ? "Inapakia ruhusa..." : "Loading access..."}</Text> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface> : <>
      <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="shield-checkmark" size={29} color={colors.burgundy} /></View><Text style={styles.heroKicker}>{sw ? "MAPITIO YALIYOLINDWA" : "PROTECTED REVIEWS"}</Text><Text style={styles.heroTitle}>{sw ? "Linda watu na taarifa nyeti." : "Protect people and sensitive matters."}</Text><Text style={styles.heroBody}>{sw ? "Fuatilia maombi ya mapitio hadi uamuzi umeandikwa." : "Keep each review visible until a decision is recorded."}</Text></View>
      <View style={styles.metrics}><View style={styles.metric}><Text style={styles.count}>{submitted?.length ?? "—"}</Text><Text style={styles.muted}>{sw ? "Mapya" : "New"}</Text></View><View style={styles.metric}><Text style={styles.count}>{inReview?.length ?? "—"}</Text><Text style={styles.muted}>{sw ? "Yanapitiwa" : "In review"}</Text></View></View>
      {submitted === undefined || inReview === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inapakia mapitio..." : "Loading reviews..."}</Text></Surface> : rows.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna mapitio yanayosubiri." : "No open reviews need attention."}</Text><Text style={styles.muted}>{sw ? "Maombi mapya yataonekana hapa." : "New review requests will appear here."}</Text></Surface> : rows.map((row) => <Pressable key={row.review._id} accessibilityRole="button" onPress={() => router.push({ pathname: "/safeguarding-review/[id]", params: { id: row.review._id } })} style={styles.card}><View style={styles.icon}><Ionicons name={row.review.status === "submitted" ? "alert-circle-outline" : "time-outline"} size={23} color={colors.orange} /></View><View style={styles.cardBody}><Text style={styles.title}>{row.case?.publicId ?? (sw ? "Kesi iliyolindwa" : "Protected case")}</Text><Text style={styles.badge}>{row.review.status.replaceAll("_", " ")} · {row.review.reason.replaceAll("_", " ")}</Text><Text style={styles.muted} numberOfLines={2}>{row.review.note || (sw ? "Maelezo ya ziada hayapo." : "No additional note.")}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.burgundy} /></Pressable>)}
    </>}
  </Screen>;
}

const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, padding: spacing.xl, backgroundColor: colors.burgundy, borderRadius: radius.xl, gap: spacing.sm }, heroIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface }, heroKicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.md, marginVertical: spacing.lg }, metric: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.lg }, count: { color: colors.burgundy, fontFamily: type.bold, fontSize: 28 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, icon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.orangeSoft, alignItems: "center", justifyContent: "center" }, cardBody: { flex: 1, gap: 3 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, badge: { color: colors.orange, fontFamily: type.bold, fontSize: 11, textTransform: "uppercase" } });
