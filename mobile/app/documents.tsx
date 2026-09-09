import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const categoryLabels: Record<string, { sw: string; en: string }> = {
  evidence: { sw: "Ushahidi", en: "Evidence" },
  identity: { sw: "Kitambulisho", en: "Identity" },
  contract: { sw: "Mkataba", en: "Contract" },
  letter: { sw: "Barua", en: "Letter" },
  receipt: { sw: "Risiti", en: "Receipt" },
  other: { sw: "Nyingine", en: "Other" },
};

const statusLabels: Record<string, { sw: string; en: string }> = {
  pending_review: { sw: "Inasubiri mapitio", en: "Pending review" },
  accepted: { sw: "Imekubaliwa", en: "Accepted" },
  rejected: { sw: "Imekataliwa", en: "Rejected" },
};

export default function DocumentsScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const documents = useQuery(api.caseManagement.myDocuments, isSignedIn ? {} : "skip");

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Nyaraka zangu" : "My documents"}</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push("/document-checker")}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.burgundy} />
        </Pressable>
      </View>

      {!isSignedIn ? (
        <View style={styles.empty}>
          <Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona nyaraka zako" : "Sign in to view your documents"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Nyaraka na ushahidi huhifadhiwa kwenye akaunti yako salama, si kama data ya mfano."
              : "Documents and evidence are stored in your secure account, not shown as demo records."}
          </Text>
          <Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
        </View>
      ) : documents === undefined ? (
        <View style={styles.empty}>
          <Ionicons name="hourglass-outline" size={32} color={colors.burgundy} />
          <Text style={styles.emptyText}>{locale === "sw" ? "Tunapakua nyaraka zako..." : "Loading your documents..."}</Text>
        </View>
      ) : documents.length ? (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{documents.length}</Text>
            <Text style={styles.summaryText}>{locale === "sw" ? "nyaraka kwenye kesi zako" : "documents across your cases"}</Text>
          </View>
          {documents.map((document) => (
            <Pressable
              key={document._id}
              style={styles.card}
              onPress={() => document.url ? void Linking.openURL(document.url) : undefined}
            >
              <View style={styles.icon}><Ionicons name="document-text-outline" size={22} color={colors.burgundy} /></View>
              <View style={styles.copy}>
                <View style={styles.row}>
                  <Text style={styles.name} numberOfLines={2}>{document.name}</Text>
                  <Text style={[
                    styles.status,
                    document.status === "rejected" ? styles.rejected : null,
                    document.status === "accepted" ? styles.accepted : null,
                  ]}>
                    {statusLabels[document.status]?.[locale] ?? document.status.replaceAll("_", " ")}
                  </Text>
                </View>
                <Text style={styles.meta}>
                  {categoryLabels[document.category]?.[locale] ?? document.category} · {document.textContent ? (locale === "sw" ? "Rasimu ya maandishi" : "Text draft") : `${(document.size / 1024 / 1024).toFixed(2)} MB`}
                </Text>
                <Text style={styles.caseRef}>{document.casePublicId}</Text>
                {document.textContent ? <Text style={styles.reviewNote} numberOfLines={5}>{document.textContent}</Text> : null}
                {document.reviewNotes ? <Text style={styles.reviewNote}>{document.reviewNotes}</Text> : null}
              </View>
            </Pressable>
          ))}
        </>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna nyaraka bado" : "No documents yet"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Nyaraka utakazohifadhi au kushirikisha kwenye kesi zitaonekana hapa."
              : "Documents you save or share with a case will appear here."}
          </Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>0</Text>
            <Text style={styles.summaryText}>{locale === "sw" ? "nyaraka kwenye kesi zako" : "documents across your cases"}</Text>
          </View>
          <Button label={locale === "sw" ? "Kagua hati kabla ya kusaini" : "Check a document before signing"} onPress={() => router.push("/document-checker")} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.xl },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 100 },
  emptyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  summaryCard: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, marginBottom: spacing.lg },
  summaryTitle: { fontFamily: type.bold, color: colors.burgundy, fontSize: 30 },
  summaryText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 13 },
  card: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: spacing.xs },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  name: { flex: 1, fontFamily: type.bold, color: colors.charcoal, fontSize: 14, lineHeight: 20 },
  status: { fontFamily: type.medium, color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4, fontSize: 10, overflow: "hidden" },
  accepted: { color: colors.success, backgroundColor: "#E7F4ED" },
  rejected: { color: colors.danger, backgroundColor: "#FDECEC" },
  meta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, textTransform: "capitalize" },
  caseRef: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  reviewNote: { marginTop: spacing.xs, borderRadius: radius.sm, backgroundColor: "#FBF7F8", padding: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
});
