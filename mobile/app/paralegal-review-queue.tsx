import Ionicons from "@expo/vector-icons/Ionicons";
import { usePaginatedQuery, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Filter = "all" | "pending" | "under_review";

export default function ParalegalReviewQueueScreen() {
  useSensitiveScreenProtection("paralegal-review-queue");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role) => ["admin", "staff"].includes(role)) ?? false;
  const pendingPage = usePaginatedQuery(api.formSubmissions.paralegalReviewQueuePage, allowed ? { status: "pending" } : "skip", { initialNumItems: 20 });
  const reviewPage = usePaginatedQuery(api.formSubmissions.paralegalReviewQueuePage, allowed ? { status: "under_review" } : "skip", { initialNumItems: 20 });
  const applications = pendingPage.status === "LoadingFirstPage" || reviewPage.status === "LoadingFirstPage" ? undefined : [...pendingPage.results, ...reviewPage.results].sort((a, b) => a.submittedAt - b.submittedAt);
  const [filter, setFilter] = useState<Filter>("all");
  const visible = applications?.filter((item) => filter === "all" || item.status === filter);

  return <Screen>
    <AppHeader back title={sw ? "Maombi ya paralegal" : "Paralegal applications"} eyebrow="LSF · APPROVALS" />
    {access === undefined ? <State text={sw ? "Tunapakia ruhusa..." : "Loading access..."} />
      : !allowed ? <State text={sw ? "Jukumu la LSF linahitajika kufungua foleni hii." : "An LSF review role is required to open this queue."} />
      : <>
        <View style={styles.intro}>
          <Text style={styles.title}>{sw ? "Kagua mtu mmoja kwa wakati." : "Review one person at a time."}</Text>
          <Text style={styles.body}>{sw ? "Fungua ombi kuona nyaraka na sababu kabla ya uamuzi. Idhini ya mwisho inahitaji msimamizi." : "Open an application to review documents and reasons before deciding. Final approval requires an administrator."}</Text>
        </View>
        <View style={styles.filters} accessibilityRole="tablist">
          {(["all", "pending", "under_review"] as const).map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.filter, filter === value && styles.filterActive]}><Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value === "all" ? (sw ? "Yote" : "All") : value === "pending" ? (sw ? "Yanasubiri" : "Pending") : (sw ? "Yanapitiwa" : "In review")}</Text></Pressable>)}
        </View>
        {applications === undefined ? <State text={sw ? "Tunapakia maombi..." : "Loading applications..."} />
          : visible?.length === 0 ? <State text={filter === "all" ? (sw ? "Hakuna ombi linalohitaji ukaguzi sasa." : "No application needs review now.") : (sw ? "Hakuna ombi katika kundi hili." : "No application in this group.")} />
          : visible?.map((item) => <Pressable key={item._id} accessibilityRole="button" accessibilityLabel={`${item.fullName}, ${item.district}, ${item.region}`} onPress={() => router.push({ pathname: "/paralegal-application/[id]", params: { id: item._id } })} style={styles.card}>
              <View style={styles.icon}><Ionicons name="person-outline" size={24} color={colors.burgundy} /></View>
              <View style={styles.copy}><Text style={styles.name}>{item.fullName}</Text><Text style={styles.body}>{item.district}, {item.region}</Text><Text style={styles.status}>{item.status === "pending" ? (sw ? "Inasubiri ukaguzi" : "Waiting for review") : (sw ? "Ukaguzi unaendelea" : "Review in progress")}</Text></View>
              <Ionicons name="chevron-forward" size={22} color={colors.burgundy} />
            </Pressable>)}
        {applications !== undefined && (filter === "all" || filter === "pending") && pendingPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia maombi mengine yanayosubiri" : "Load more pending applications"} variant="secondary" onPress={() => pendingPage.loadMore(20)} /> : null}
        {applications !== undefined && (filter === "all" || filter === "under_review") && reviewPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia maombi mengine yanayopitiwa" : "Load more applications in review"} variant="secondary" onPress={() => reviewPage.loadMore(20)} /> : null}
        {pendingPage.status === "LoadingMore" || reviewPage.status === "LoadingMore" ? <State text={sw ? "Tunapakia zaidi..." : "Loading more..."} /> : null}
      </>}
  </Screen>;
}

function State({ text }: { text: string }) { return <View style={styles.state}><Text style={styles.body}>{text}</Text></View>; }

const styles = StyleSheet.create({
  intro: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, gap: spacing.sm },
  title: { color: colors.burgundyDark, fontFamily: type.bold, fontSize: 25, lineHeight: 32 },
  body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 23 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginVertical: spacing.xl },
  filter: { minHeight: 48, paddingHorizontal: spacing.md, justifyContent: "center", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  filterActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  filterText: { color: colors.charcoal, fontFamily: type.medium, fontSize: 14 },
  filterTextActive: { color: colors.surface },
  card: { minHeight: 94, flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  copy: { flex: 1 },
  name: { color: colors.ink, fontFamily: type.bold, fontSize: 18 },
  status: { marginTop: spacing.xs, color: colors.burgundy, fontFamily: type.medium, fontSize: 14 },
  state: { padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
});
