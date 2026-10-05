import Ionicons from "@expo/vector-icons/Ionicons";
import { usePaginatedQuery, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { CivicPageIntro } from "../src/components/CivicPageIntro";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Status = "open" | "escalated" | "case_follow_up" | "reviewed" | "false_positive";
const statuses: Status[] = ["open", "escalated", "case_follow_up", "reviewed", "false_positive"];
const labels: Record<Status, { sw: string; en: string }> = {
  open: { sw: "Wazi", en: "Open" },
  escalated: { sw: "Zilizopandishwa", en: "Escalated" },
  case_follow_up: { sw: "Ufuatiliaji", en: "Follow-up" },
  reviewed: { sw: "Zilizopitiwa", en: "Reviewed" },
  false_positive: { sw: "Si alama sahihi", en: "False positive" },
};

export default function SaadaRiskQueueScreen() {
  useSensitiveScreenProtection("saada-risk-queue");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role) => role === "admin" || role === "staff") ?? false;
  const [status, setStatus] = useState<Status>("open");
  const page = usePaginatedQuery(api.sara_chat.getRiskEventsPage, allowed ? { dispositionStatus: status } : "skip", { initialNumItems: 20 });
  const events = page.status === "LoadingFirstPage" ? undefined : page.results;
  return <Screen key={`saada-risk-${status}`}>
    <AppHeader back title={sw ? "Ukaguzi wa Saada" : "Saada review queue"} eyebrow="LSF · HUMAN REVIEW" />
    {access === undefined ? <Surface><Text style={styles.body}>{sw ? "Inapakia ruhusa..." : "Loading access..."}</Text></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."}</Text></Surface> : <>
      <CivicPageIntro icon="shield-half-outline" eyebrow="SAADA · SAFETY" title={sw ? "Pitia alama kwa utaratibu." : "Review every flag carefully."} description={sw ? "Fungua tukio moja ili kuona taarifa nyeti na kurekodi hatua. Orodha hii haionyeshi mazungumzo binafsi." : "Open one event to see sensitive details and record an action. This list does not expose private conversations."} tone="orange" />
      <View style={styles.filters}>{statuses.map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: status === item }} onPress={() => setStatus(item)} style={[styles.filter, status === item && styles.filterActive]}><Text style={[styles.filterText, status === item && styles.filterTextActive]}>{sw ? labels[item].sw : labels[item].en}</Text></Pressable>)}</View>
      <Text style={styles.count}>{sw ? "Tukio lililoonyeshwa" : "Events shown"}: {events === undefined ? "…" : `${events.length}${page.status === "CanLoadMore" ? "+" : ""}`}</Text>
      {events === undefined ? <Surface><Text style={styles.body}>{sw ? "Inapakia matukio..." : "Loading events..."}</Text></Surface> : events.length === 0 ? <Surface><Text style={styles.body}>{sw ? "Hakuna tukio kwenye hali hii." : "No events in this state."}</Text></Surface> : events.map((event) => <Surface key={event._id} tone={event.eventType === "emergency_keyword" ? "orange" : "white"}>
        <View style={styles.row}><View style={styles.icon}><Ionicons name={event.eventType === "emergency_keyword" ? "alert-circle-outline" : "chatbubble-ellipses-outline"} size={24} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{event.eventType.replaceAll("_", " ")}</Text><Text style={styles.body}>{new Date(event.createdAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")} · {event.source}</Text>{event.followUpStatus ? <Text style={styles.body}>{sw ? "Ufuatiliaji" : "Follow-up"}: {event.followUpStatus === "pending" ? (sw ? "unasubiri" : "pending") : event.followUpStatus === "in_progress" ? (sw ? "unaendelea" : "in progress") : (sw ? "umekamilika" : "completed")}</Text> : null}</View></View>
        <Button label={sw ? "Fungua ukaguzi salama" : "Open protected review"} variant="secondary" onPress={() => router.push({ pathname: "/saada-risk/[id]", params: { id: event._id } })} />
      </Surface>)}
      {page.status === "CanLoadMore" ? <Button label={sw ? "Pakia matukio zaidi" : "Load more events"} variant="secondary" onPress={() => page.loadMore(20)} /> : page.status === "LoadingMore" ? <Surface><Text style={styles.body}>{sw ? "Inapakia zaidi..." : "Loading more..."}</Text></Surface> : null}
    </>}
  </Screen>;
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginVertical: spacing.lg },
  filter: { minHeight: 48, justifyContent: "center", paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, backgroundColor: colors.surface },
  filterActive: { backgroundColor: colors.burgundySoft, borderColor: colors.burgundy },
  filterText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 14 },
  filterTextActive: { color: colors.burgundy, fontFamily: type.bold },
  count: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 14, marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  icon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  title: { color: colors.ink, fontFamily: type.bold, fontSize: 17, lineHeight: 23 },
  body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 22 },
});
