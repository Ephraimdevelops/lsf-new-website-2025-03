import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

export default function MessagesScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const conversations = useQuery(api.caseManagement.myConversations, isSignedIn ? {} : "skip");

  return (
    <Screen>
      <AppHeader title={locale === "sw" ? "Ujumbe" : "Messages"} eyebrow={locale === "sw" ? "MAWASILIANO SALAMA" : "SECURE CONVERSATIONS"} initial="M" onBell={() => router.push("/notifications")} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="chatbubbles-outline" size={28} color={colors.surface} /></View>
        <View style={styles.heroCopy}><Text style={styles.heroTitle}>{locale === "sw" ? "Endelea kuwasiliana." : "Stay connected."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Ujumbe, nyaraka na sauti hubaki ndani ya kesi husika." : "Messages, documents, and voice notes stay inside the right case."}</Text></View>
      </View>

      {!isSignedIn ? <View style={styles.empty}><Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} /><Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona ujumbe wako" : "Sign in to view messages"}</Text><Text style={styles.emptyBody}>{locale === "sw" ? "Mazungumzo ya kesi yanalindwa na akaunti yako." : "Case conversations are protected by your account."}</Text><Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></View>
      : conversations === undefined ? <View style={styles.empty}><Ionicons name="hourglass-outline" size={30} color={colors.burgundy} /><Text style={styles.emptyBody}>{locale === "sw" ? "Tunapakua mazungumzo..." : "Loading conversations..."}</Text></View>
      : conversations.length ? <View style={styles.list}>{conversations.map((conversation) => <Pressable key={String(conversation.caseId)} style={({ pressed }) => [styles.conversation, pressed && styles.pressed]} onPress={() => router.push({ pathname: "/case/[id]", params: { id: conversation.caseId, section: "messages" } })}>
          <View style={styles.avatar}><Ionicons name={conversation.lastMessage?.type === "voice" ? "mic" : "person"} size={22} color={colors.burgundy} /></View>
          <View style={styles.copy}><View style={styles.row}><Text style={styles.caseRef}>{conversation.publicId}</Text><Text style={styles.time}>{formatRelative(conversation.updatedAt, locale)}</Text></View><Text style={styles.caseSummary} numberOfLines={1}>{conversation.summary}</Text><Text style={styles.preview} numberOfLines={2}>{conversation.lastMessage ? `${conversation.lastMessage.sentByCurrentUser ? (locale === "sw" ? "Wewe: " : "You: ") : `${conversation.lastMessage.senderName}: `}${conversation.lastMessage.type === "voice" ? (locale === "sw" ? "Ujumbe wa sauti" : "Voice note") : conversation.lastMessage.body}` : (locale === "sw" ? "Fungua kesi kuanza mazungumzo salama." : "Open the case to start a secure conversation.")}</Text></View>
          <Ionicons name="chevron-forward" size={19} color={colors.inkMuted} />
        </Pressable>)}</View>
      : <View style={styles.empty}><Ionicons name="chatbubble-ellipses-outline" size={36} color={colors.burgundy} /><Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna mazungumzo bado" : "No conversations yet"}</Text><Text style={styles.emptyBody}>{locale === "sw" ? "Ukishaunganishwa na mtoa msaada, mazungumzo yako yataonekana hapa." : "After you are matched with support, your conversation will appear here."}</Text><Button label={locale === "sw" ? "Omba msaada" : "Request help"} onPress={() => router.push("/intake")} /></View>}
    </Screen>
  );
}

function formatRelative(timestamp: number, locale: "sw" | "en") {
  const elapsed = Date.now() - timestamp;
  if (elapsed < 60_000) return locale === "sw" ? "sasa" : "now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h`;
  return new Date(timestamp).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  hero: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.lg, marginBottom: spacing.lg },
  heroIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  heroCopy: { flex: 1 }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 22 }, heroBody: { marginTop: 3, fontFamily: type.regular, color: "#F7DCE5", fontSize: 13, lineHeight: 19 },
  list: { gap: spacing.sm },
  conversation: { minHeight: 96, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  pressed: { opacity: 0.72 }, avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, copy: { flex: 1 }, row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm }, caseRef: { flex: 1, fontFamily: type.bold, color: colors.ink, fontSize: 14 }, time: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 }, caseSummary: { marginTop: 2, fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, preview: { marginTop: 5, fontFamily: type.regular, color: colors.ink, fontSize: 13, lineHeight: 18 },
  empty: { marginTop: spacing.xl, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl }, emptyTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 19, textAlign: "center" }, emptyBody: { maxWidth: 300, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
});
