import { BrandLoading } from '../../src/components/BrandLoading';
import { useWorkMode } from "../../src/work/WorkMode";
import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { SearchFilters } from "../../src/components/SearchFilters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { Button } from "../../src/components/Button";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { colors, type } from "../../src/theme";

export default function MessagesScreen() {
  const { mode } = useWorkMode();
  const { isSignedIn } = useAuth();
  const { ready: accountReady } = useAccountSync();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [search, setSearch] = useState("");
  const access = useQuery(api.users.currentAccess, isSignedIn && accountReady ? {} : "skip");
  const workRole = mode === "work" && (access?.roles.some(role => ["paralegal", "provider_staff"].includes(role)) ?? false);
  const allConversations = useQuery(api.caseManagement.myConversations, isSignedIn && accountReady ? {} : "skip");
  const conversations = allConversations?.filter(item => item.context === (workRole ? "work" : "personal"));
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn && accountReady && !workRole ? {} : "skip");
  const requestThreads = requests?.filter(item => ["submitted", "under_review", "waiting_for_information"].includes(item.status));
  const filtered = conversations?.filter((item) => [item.summary, item.publicId, item.lastMessage?.senderName, item.lastMessage?.body].some((value) => value?.toLowerCase().includes(search.trim().toLowerCase())));

  return <Screen>
    <CivicPageHeader title={sw ? "Ujumbe" : "Messages"} subtitle={workRole ? (sw ? "Ujumbe wa kesi unazosaidia." : "Messages for the cases you support.") : (sw ? "Mazungumzo yako na mtoa msaada." : "Conversations with your support provider.")} actionIcon="notifications-outline" actionLabel={sw ? "Arifa" : "Notifications"} onAction={() => router.push("/notifications")} />

    {workRole && <ParalegalIntro pose="contact" title={sw ? "Wasiliana. Fuatilia msaada." : "Keep the conversation going."} body={sw ? "Ujumbe hukaa na kesi ili kila hatua iwe wazi." : "Messages stay with each case so the next step is clear."} />}
    {isSignedIn && conversations?.length ? <SearchFilters value={search} onChange={setSearch} placeholder={sw ? "Tafuta mazungumzo" : "Find a conversation"} sw={sw} /> : null}

    {!workRole && !!requestThreads?.length && <View style={{ gap: 12, marginBottom: 24 }}><Text style={styles.sectionLabel}>{sw ? "UJUMBE WA MAOMBI" : "REQUEST MESSAGES"}</Text>{requestThreads.filter(item => !search.trim() || [item.publicId, item.issueCategory, item.district].join(' ').toLowerCase().includes(search.trim().toLowerCase())).map(item => <Pressable accessibilityRole="button" key={item._id} style={[styles.conversation, { backgroundColor: "#EEF5F3", padding: 16, borderRadius: 10 }]} onPress={() => router.push({ pathname: "/request/[id]", params: { id: item._id } })}><Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.teal} /><View style={styles.copy}><Text style={styles.caseTitle}>{item.publicId}</Text><Text style={styles.muted}>{item.status === "waiting_for_information" ? (sw ? "LSF inahitaji jibu lako. Fungua ombi." : "LSF needs your reply. Open the request.") : (sw ? "Ujumbe wako na timu ya LSF" : "Your messages with the LSF review team")}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.teal} /></Pressable>)}</View>}
    {!isSignedIn ? <View style={styles.empty}>
      <View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={29} color={colors.teal} /></View>
      <Text style={styles.emptyTitle}>{sw ? "Ujumbe wako utaonekana hapa." : "Your messages will appear here."}</Text>
      <Text style={styles.emptyBody}>{sw ? "Ingia kusoma majibu, kuuliza maswali na kutuma nyaraka kuhusu kesi yako." : "Sign in to read replies, ask questions and share documents about your case."}</Text>
      <View style={styles.context}><Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.inkMuted} /><Text style={styles.contextText}>{sw ? "Mazungumzo haya yanahusu kesi yako." : "These conversations relate to your case."}</Text></View>
      <Button label={sw ? "Ingia kwenye akaunti" : "Sign in to your account"} style={styles.button} onPress={() => router.push("/sign-in")} />
    </View> : conversations === undefined ? <View style={styles.loading}><BrandLoading compact text={sw ? "Tunapakua mazungumzo..." : "Loading conversations..."}/></View> : conversations.length ? <>
      <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>{sw ? "MAZUNGUMZO" : "CONVERSATIONS"}</Text><Text style={styles.count}>{filtered?.length}</Text></View>
      {filtered?.length ? filtered.map((conversation) => <Pressable key={String(conversation.caseId)} accessibilityRole="button" style={({ pressed }) => [styles.conversation, pressed && styles.pressed]} onPress={() => router.push({ pathname: "/case/[id]", params: { id: conversation.caseId, section: "messages" } })}>
        <View style={styles.avatar}><Ionicons name={conversation.lastMessage?.type === "voice" ? "mic-outline" : "chatbubble-outline"} size={22} color={colors.teal} /></View>
        <View style={styles.copy}>
          <View style={styles.row}><Text style={styles.caseTitle} numberOfLines={1}>{conversation.summary}</Text><Text style={styles.time}>{formatRelative(conversation.updatedAt, locale)}</Text></View>
          <Text style={styles.preview} numberOfLines={2}>{conversation.lastMessage ? `${conversation.lastMessage.sentByCurrentUser ? (sw ? "Wewe: " : "You: ") : `${conversation.lastMessage.senderName}: `}${conversation.lastMessage.type === "voice" ? (sw ? "Ujumbe wa sauti" : "Voice note") : conversation.lastMessage.body}` : (sw ? "Fungua kuanza mazungumzo." : "Open to start a conversation.")}</Text>
          <Text style={styles.caseRef}>{conversation.publicId}</Text>
        </View>
      </Pressable>) : <View style={styles.searchEmpty}><Text style={styles.emptyBody}>{sw ? "Hakuna mazungumzo yanayolingana." : "No matching conversations."}</Text><Pressable accessibilityRole="button" onPress={() => setSearch("")} style={styles.textButton}><Text style={styles.linkText}>{sw ? "Onyesha yote" : "Show all"}</Text></Pressable></View>}
    </> : requestThreads?.length ? <Text style={styles.muted}>{sw ? "Mazungumzo ya kesi yataonekana hapa kesi itakapofunguliwa." : "Case conversations will appear here when a case is opened."}</Text> : <View style={styles.empty}>
      <View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={29} color={colors.teal} /></View>
      <Text style={styles.emptyTitle}>{sw ? "Mazungumzo yanaanza hapa." : "Your conversations start here."}</Text>
      <Text style={styles.emptyBody}>{workRole ? (sw ? "Ukikubali kesi, mazungumzo na mnufaika na timu yataonekana hapa." : "After you accept a case, conversations with the beneficiary and team appear here.") : (sw ? "Mtoa msaada akipangiwa kesi yako, mtawasiliana hapa." : "Message your helper here once they are assigned to your case.")}</Text>
      <Button label={sw ? "Angalia kesi zangu" : "View my cases"} style={styles.button} onPress={() => router.push(workRole ? "/paralegal-assignments?view=active" : "/(tabs)/cases")} />
      {!workRole && <Pressable accessibilityRole="button" onPress={() => router.push("/intake")} style={styles.textButton}><Text style={styles.linkText}>{sw ? "Omba msaada mpya" : "Request new help"}</Text><Ionicons name="arrow-forward" size={17} color={colors.burgundy} /></Pressable>}
    </View>}

    {(!isSignedIn || conversations?.length === 0) ? <Pressable accessibilityRole="button" style={styles.aiLink} onPress={() => router.push("/sara")}><Ionicons name="sparkles-outline" size={22} color={colors.burgundy} /><View style={styles.aiCopy}><Text style={styles.aiTitle}>{sw ? "Una swali la haraka?" : "Have a quick question?"}</Text><Text style={styles.muted}>{sw ? "Uliza Haki Yangu AI" : "Ask Haki Yangu AI"}</Text></View><Ionicons name="arrow-forward" size={18} color={colors.burgundy} /></Pressable> : null}
    <View style={styles.privacy}><Ionicons name="lock-closed-outline" size={13} color={colors.inkMuted} /><Text style={styles.privacyText}>{sw ? "Mazungumzo yako ya kesi ni ya faragha." : "Your case conversations are private."}</Text></View>
  </Screen>;
}

function formatRelative(timestamp: number, locale: "sw" | "en") {
  const elapsed = Math.max(0, Date.now() - timestamp);
  if (elapsed < 60_000) return locale === "sw" ? "sasa" : "now";
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h`;
  return new Date(timestamp).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  search: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F5F4F4", paddingHorizontal: 14, minHeight: 50, borderRadius: 10, marginBottom: 22 },
  searchInput: { flex: 1, minWidth: 0, minHeight: 50, fontFamily: type.regular, fontSize: 14, color: colors.ink },
  clear: { width: 32, minHeight: 44, alignItems: "center", justifyContent: "center" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionLabel: { fontFamily: type.medium, fontSize: 11, color: colors.inkMuted },
  count: { fontFamily: type.medium, fontSize: 12, color: colors.inkMuted },
  conversation: { minHeight: 112, paddingVertical: 18, flexDirection: "row", alignItems: "flex-start", gap: 13 },
  avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#EEF5F3", alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, minWidth: 0 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  caseTitle: { flex: 1, fontFamily: type.semibold, fontSize: 15, color: colors.ink, lineHeight: 21 },
  time: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 },
  preview: { marginTop: 5, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  caseRef: { marginTop: 7, fontFamily: type.medium, color: colors.teal, fontSize: 11 },
  empty: { paddingTop: 22, paddingBottom: 24 },
  emptyIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#EEF5F3", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontFamily: type.editorial, fontSize: 25, lineHeight: 32, color: colors.ink },
  emptyBody: { marginTop: 9, fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted },
  context: { marginTop: 24, flexDirection: "row", gap: 12, alignItems: "center" },
  contextText: { flex: 1, fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.inkMuted },
  button: { marginTop: 26, borderRadius: 10 },
  textButton: { minHeight: 48, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7, marginTop: 8 },
  linkText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
  aiLink: { flexDirection: "row", alignItems: "center", minHeight: 80, gap: 12, marginTop: 12 },
  aiCopy: { flex: 1, gap: 3 },
  aiTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 14 },
  muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  privacy: { marginTop: 22, flexDirection: "row", alignItems: "center", gap: 6 },
  privacyText: { flex: 1, fontFamily: type.regular, fontSize: 11, lineHeight: 17, color: colors.inkMuted },
  loading: { minHeight: 160, justifyContent: "center", alignItems: "center", gap: 14 },
  searchEmpty: { paddingVertical: 24 },
  pressed: { opacity: 0.65 },
});
