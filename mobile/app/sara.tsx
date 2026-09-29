import Ionicons from "@expo/vector-icons/Ionicons";
import { useAction, useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";

const quickPrompts = {
  sw: [
    "Nifanye nini kama sijalipwa mshahara?",
    "Nawezaje kupata msaada wa kisheria karibu nami?",
    "Mkataba wa upangaji unapaswa kuwa na nini?",
  ],
  en: [
    "What should I do if I have not been paid?",
    "How can I find legal help near me?",
    "What should a tenancy agreement include?",
  ],
};

const saadaAvatar = require("../assets/saada-paralegal.png");

type ParalegalCard = {
  name?: string;
  region?: string;
  district?: string;
  phone?: string;
  verified?: boolean;
};

type MessagePart =
  | { type: "text"; text: string }
  | { type: "paralegal"; card: ParalegalCard };

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const activityCopy = {
  sw: {
    intent_detected: "Swali limepokelewa",
    risk_check_started: "Tunakagua usalama na sera",
    risk_check_completed: "Ukaguzi wa usalama umekamilika",
    knowledge_search_started: "Tunapitia mwongozo ulioidhinishwa",
    knowledge_search_completed: "Mwongozo ulioidhinishwa umepitiwa",
    service_search_started: "Tunatafuta huduma zilizothibitishwa",
    service_search_completed: "Huduma zilizothibitishwa zimekaguliwa",
    tool_execution_started: "Tunatumia zana iliyoidhinishwa",
    tool_execution_completed: "Zana imekamilika",
    human_review_requested: "Mapitio ya binadamu yanapendekezwa",
    completed: "Jibu limekamilika",
    failed: "Saada haikuweza kukamilisha ombi",
  },
  en: {
    intent_detected: "Question received",
    risk_check_started: "Checking safety and policy",
    risk_check_completed: "Safety check completed",
    knowledge_search_started: "Reviewing approved legal guidance",
    knowledge_search_completed: "Approved guidance reviewed",
    service_search_started: "Looking for verified services",
    service_search_completed: "Verified services checked",
    tool_execution_started: "Running an approved tool",
    tool_execution_completed: "Approved tool completed",
    human_review_requested: "Human review recommended",
    completed: "Response completed",
    failed: "Saada could not complete this request",
  },
} as const;

const paralegalCardPattern = /::PARALEGAL_CARD:(\{.*?\})::/g;

function parseAssistantContent(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let cursor = 0;
  for (const match of content.matchAll(paralegalCardPattern)) {
    const [token, json] = match;
    const index = match.index ?? 0;
    const before = content.slice(cursor, index).trim();
    if (before) parts.push({ type: "text", text: before });
    try {
      parts.push({ type: "paralegal", card: JSON.parse(json) as ParalegalCard });
    } catch {
      parts.push({ type: "text", text: token });
    }
    cursor = index + token.length;
  }
  const after = content.slice(cursor).trim();
  if (after) parts.push({ type: "text", text: after });
  return parts.length ? parts : [{ type: "text", text: content }];
}

function SaraMessageContent({ content, isUser, locale }: { content: string; isUser: boolean; locale: "en" | "sw" }) {
  if (isUser) {
    return <Text style={[styles.messageText, styles.userText]}>{content}</Text>;
  }

  return (
    <View style={styles.messageStack}>
      {parseAssistantContent(content).map((part, index) => {
        if (part.type === "text") {
          return <Text key={`text-${index}`} style={styles.messageText}>{part.text}</Text>;
        }
        return <ParalegalRecommendation key={`paralegal-${index}`} card={part.card} locale={locale} />;
      })}
    </View>
  );
}

function ParalegalRecommendation({ card, locale }: { card: ParalegalCard; locale: "en" | "sw" }) {
  const location = [card.district, card.region].filter(Boolean).join(", ");
  return (
    <View style={styles.paralegalCard}>
      <View style={styles.paralegalHeader}>
        <View style={styles.paralegalAvatar}>
          <Ionicons name="person-outline" size={18} color={colors.burgundy} />
        </View>
        <View style={styles.paralegalTitleBlock}>
          <Text style={styles.paralegalName}>{card.name || (locale === "sw" ? "Mtoa msaada" : "Legal helper")}</Text>
          <Text style={styles.paralegalMeta}>{location || (locale === "sw" ? "Angalia mahali kwenye orodha" : "Check location in directory")}</Text>
        </View>
      </View>

      <View style={styles.paralegalActions}>
        <Pressable style={styles.secondaryAction} onPress={() => router.push("/find-services")}>
          <Ionicons name="search-outline" size={15} color={colors.burgundy} />
          <Text style={styles.secondaryActionText}>{locale === "sw" ? "Hakiki taarifa" : "Verify details"}</Text>
        </Pressable>
        <Pressable style={styles.primaryAction} onPress={() => router.push("/intake")}>
          <Text style={styles.primaryActionText}>{locale === "sw" ? "Omba msaada" : "Request help"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SaraScreen() {
  useSensitiveScreenProtection("sara");
  const { locale } = useLanguage();
  const { updateDraft } = useIntakeDraft();
  const { isSignedIn } = useAuth();
  const askSaada = useAction(api.sara_actions.ask);
  const saveUserMessage = useMutation(api.sara_chat.sendMessage);
  const clearRemoteHistory = useMutation(api.sara_chat.clearHistory);
  const submitFeedback = useMutation(api.sara_chat.submitFeedback);
  const remoteHistory = useQuery(api.sara_chat.getMessages, isSignedIn ? {} : "skip");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | undefined>();
  const activityEvents = useQuery(api.sara_chat.getActivityEvents, activeRequestId ? { requestId: activeRequestId, limit: 20 } : "skip");
  const [error, setError] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [historyHydrated, setHistoryHydrated] = useState(false);
  const [ratedMessages, setRatedMessages] = useState<Record<string, "positive" | "negative">>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant" as const,
      content:
        locale === "sw"
          ? "Karibu. Mimi ni Saada kutoka LSF. Naweza kukusaidia kuelewa haki zako kwa lugha rahisi, lakini si mbadala wa wakili au huduma ya dharura."
          : "Welcome. I am Saada from LSF. I can help you understand your rights in plain language, but I am not a lawyer or an emergency service.",
    },
  ]);
  const chatScrollRef = useRef<ScrollView>(null);
  const latestUserQuestion = [...messages].reverse().find((message) => message.role === "user")?.content;
  const hasStartedChat = Boolean(latestUserQuestion);

  useEffect(() => {
    if (!isSignedIn || remoteHistory === undefined || historyHydrated) return;
    if (remoteHistory.length) {
      setMessages((current) => [current[0], ...remoteHistory.slice(-20).map((message) => ({ id: String(message._id), role: message.role, content: message.content }))]);
    }
    setHistoryHydrated(true);
  }, [historyHydrated, isSignedIn, remoteHistory]);

  useEffect(() => {
    if (!isSignedIn || !historyHydrated || pending || !remoteHistory?.length) return;
    setMessages((current) => [current[0], ...remoteHistory.slice(-20).map((message) => ({ id: String(message._id), role: message.role, content: message.content }))]);
  }, [historyHydrated, isSignedIn, pending, remoteHistory]);

  async function rateMessage(messageId: string, rating: "positive" | "negative") {
    if (messageId.startsWith("intro") || messageId.startsWith("assistant-")) return;
    try {
      await submitFeedback({ messageId: messageId as any, rating });
      setRatedMessages((current) => ({ ...current, [messageId]: rating }));
    } catch {
      setError(locale === "sw" ? "Maoni hayakuhifadhiwa. Jaribu tena." : "Feedback was not saved. Please try again.");
    }
  }

  function clearHistory() {
    Alert.alert(locale === "sw" ? "Futa mazungumzo?" : "Clear conversation?", locale === "sw" ? "Ujumbe wa mazungumzo haya hautaonekana tena kwenye Saada." : "These chat messages will no longer appear in Saada.", [
      { text: locale === "sw" ? "Ghairi" : "Cancel", style: "cancel" },
      { text: locale === "sw" ? "Futa" : "Clear", style: "destructive", onPress: () => void performClearHistory() },
    ]);
  }

  async function performClearHistory() {
    setError("");
    try {
      if (isSignedIn) await clearRemoteHistory();
      setMessages([
      {
        id: "intro-reset",
        role: "assistant",
        content:
          locale === "sw"
            ? "Historia imefutwa. Uliza swali fupi kuhusu ajira, ardhi, familia, usalama, au haki za walaji."
            : "History is cleared. Ask a short question about employment, land, family, safety, or consumer rights.",
      },
    ]);
      setHistoryHydrated(true);
    } catch {
      setError(locale === "sw" ? "Historia haikufutwa. Jaribu tena." : "Conversation was not cleared. Please try again.");
    }
  }

  function safeFailureReply(message: unknown) {
    const detail = message instanceof Error ? message.message : String(message ?? "");
    if (/unauth|logged in|jwt|clerk|forbidden/i.test(detail)) {
      return locale === "sw"
        ? "Ili Saada itumie mfumo salama wa LSF, tafadhali ingia kwanza. Unaweza bado kutumia sehemu za kujifunza na kutuma ombi la msaada."
        : "To use Saada through the secure LSF system, please sign in first. You can still use learning resources and start a help request.";
    }
    if (/maintenance|monthly usage|OPENAI_API_KEY|limit/i.test(detail)) {
      return locale === "sw"
        ? "Saada haipatikani kikamilifu sasa. Kwa usalama, tumia kitufe cha kuomba msaada au tafuta paralegal aliyethibitishwa."
        : "Saada is not fully available right now. For safety, use request help or find a verified paralegal.";
    }
    return locale === "sw"
      ? "Saada haikuweza kujibu sasa. Usitumie jibu la AI kwa dharura; tafuta msaada rasmi au anza ombi kwa LSF."
      : "Saada could not answer right now. Do not rely on AI in an emergency; contact official help or start an LSF request.";
  }

  async function send(text = input) {
    const body = text.trim();
    if (!body || pending) return;
    if (!isSignedIn) {
      setInput(body);
      setError(locale === "sw" ? "Ingia kwanza ili kutuma swali hili kwa Saada. Swali halijatumwa." : "Sign in to send this question to Saada. It has not been sent.");
      return;
    }
    if (!consentAccepted) {
      setError(locale === "sw" ? "Kubali masharti mafupi ya Saada kwanza." : "Accept the brief Saada guidance terms first.");
      return;
    }
    setPending(true);
    const requestId = `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActiveRequestId(requestId);
    setError("");
    setInput("");
    const history = messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    }));
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", content: body }]);
    try {
      await saveUserMessage({ content: body });
      const response = await askSaada({
        message: body,
        history,
        source: "mobile",
        clientRequestId: requestId,
      });
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", content: response || safeFailureReply("") }]);
    } catch (caught) {
      const reply = safeFailureReply(caught);
      setMessages((current) => [...current, { id: `assistant-safe-${Date.now()}`, role: "assistant", content: reply }]);
      setError(locale === "sw" ? "Saada haikujibu kikamilifu. Tumia njia salama hapo juu." : "Saada could not complete the response. Use the safe next step above.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Uliza Saada" : "Ask Saada"}</Text>
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Futa historia" : "Clear history"} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={22} color={colors.burgundy} />
          </Pressable>
          <QuickExit locale={locale} />
        </View>
      </View>

      <ScrollView ref={chatScrollRef} style={styles.chatScroll} contentContainerStyle={styles.chatContent} keyboardShouldPersistTaps="handled" onContentSizeChange={() => { if (messages.length > 1) chatScrollRef.current?.scrollToEnd({ animated: true }); }}>

      {!hasStartedChat ? <View style={styles.hero}>
        <Image source={saadaAvatar} style={styles.avatar} />
        <View style={styles.heroCopy}>
        <Text style={styles.heroLabel}>{locale === "sw" ? "MSAIDIZI WA HAKI YANGU" : "HAKI YANGU ASSISTANT"}</Text>
        <Text style={styles.title}>Saada</Text>
        <Text style={styles.heroBody}>
          {locale === "sw"
            ? "Pata maelezo rahisi ya haki zako, hatua zinazofuata, na njia salama ya kuunganishwa na msaada."
            : "Get simple rights guidance, next steps, and a safe path to verified support."}
        </Text>
        <View style={styles.online}><Ionicons name="information-circle-outline" size={13} color={colors.surface} /><Text style={styles.onlineText}>{locale === "sw" ? "Mwongozo wa jumla" : "General guidance"}</Text></View>
        </View>
      </View> : null}

      {!hasStartedChat ? <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consentAccepted }}
        style={[styles.consentCard, consentAccepted && styles.consentCardAccepted]}
        onPress={() => setConsentAccepted((current) => !current)}
      >
        <Ionicons
          name={consentAccepted ? "checkmark-circle" : "ellipse-outline"}
          size={22}
          color={consentAccepted ? colors.teal : colors.burgundy}
        />
        <Text style={styles.consentText}>
          {locale === "sw"
            ? "Ninaelewa Saada hutoa taarifa za jumla tu. Kwa hatari ya haraka au ushauri rasmi, niwasiliane na paralegal, wakili, au huduma ya dharura."
            : "I understand Saada gives general information only. For immediate danger or formal advice, I should contact a paralegal, lawyer, or emergency service."}
        </Text>
      </Pressable> : null}

      {!isSignedIn ? (
        <View style={styles.guestCard}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.burgundy} />
          <Text style={styles.guestTitle}>{locale === "sw" ? "Ingia kuuliza Saada" : "Sign in to ask Saada"}</Text>
          <Text style={styles.guestBody}>{locale === "sw" ? "Mazungumzo yako yanahitaji akaunti salama. Bado unaweza kutafuta huduma au kuanza ombi la msaada." : "Your conversation needs a secure account. You can still find services or start a help request."}</Text>
          <Pressable style={styles.guestPrimary} onPress={() => router.push({ pathname: "/sign-in", params: { returnTo: "sara" } })}><Text style={styles.guestPrimaryText}>{locale === "sw" ? "Ingia salama" : "Sign in securely"}</Text></Pressable>
          <View style={styles.guestActions}><Pressable onPress={() => router.push("/find-services")}><Text style={styles.guestLink}>{locale === "sw" ? "Tafuta msaada" : "Find Help"}</Text></Pressable><Pressable onPress={() => router.push("/intake")}><Text style={styles.guestLink}>{locale === "sw" ? "Omba msaada" : "Request Help"}</Text></Pressable></View>
        </View>
      ) : null}

      {!hasStartedChat ? <View style={styles.promptRow}>
        {quickPrompts[locale].map((prompt) => (
          <Pressable key={prompt} style={styles.prompt} onPress={() => isSignedIn ? void send(prompt) : setInput(prompt)}>
            <Text style={styles.promptText}>{prompt}</Text>
          </Pressable>
        ))}
      </View> : null}

      <View style={styles.messages}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageRow, message.role === "user" && styles.userRow]}>
            {message.role === "assistant" ? <Image source={saadaAvatar} style={styles.messageAvatar} /> : null}
            <View style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.assistantBubble]}>
              <SaraMessageContent content={message.content} isUser={message.role === "user"} locale={locale} />
              {message.role === "assistant" && !message.id.startsWith("intro") && !message.id.startsWith("assistant-") ? <View style={styles.feedbackRow}><Text style={styles.feedbackLabel}>{ratedMessages[message.id] ? (locale === "sw" ? "Asante kwa maoni" : "Feedback saved") : (locale === "sw" ? "Jibu hili limesaidia?" : "Was this helpful?")}</Text><Pressable accessibilityLabel="Helpful" onPress={() => void rateMessage(message.id, "positive")}><Ionicons name={ratedMessages[message.id] === "positive" ? "thumbs-up" : "thumbs-up-outline"} size={18} color={colors.teal} /></Pressable><Pressable accessibilityLabel="Not helpful" onPress={() => void rateMessage(message.id, "negative")}><Ionicons name={ratedMessages[message.id] === "negative" ? "thumbs-down" : "thumbs-down-outline"} size={18} color={colors.danger} /></Pressable></View> : null}
            </View>
          </View>
        ))}
        {pending ? (
          <View style={styles.activityPanel}>
            <Text style={styles.activityTitle}>{locale === "sw" ? "Saada inafanya kazi" : "Saada activity"}</Text>
            {(activityEvents?.length ? activityEvents : [{ _id: "local-start", type: "intent_detected", status: "started", summary: locale === "sw" ? "Tunaanza ombi" : "Starting request" } as any]).map((event: any) => {
              const icon = event.status === "completed" ? "checkmark-circle" : event.status === "failed" ? "alert-circle" : "ellipse";
              const color = event.status === "completed" ? colors.success : event.status === "failed" ? colors.danger : colors.burgundy;
              return (
                <View key={event._id} style={styles.activityRow}>
                  <Ionicons name={icon} size={16} color={color} />
                  <Text style={styles.activityText}>
                    {event.summary || activityCopy[locale][event.type as keyof typeof activityCopy.en] || (locale === "sw" ? "Inaendelea..." : "Working...")}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {latestUserQuestion ? <Pressable style={styles.signInNotice} onPress={() => { updateDraft({ description: latestUserQuestion.slice(0, 5000) }); router.push("/intake"); }}><Ionicons name="document-text-outline" size={18} color={colors.burgundy} /><Text style={styles.signInNoticeText}>{locale === "sw" ? "Tumia swali lako kuanza ombi. Utalikagua kabla ya kutuma." : "Use your own question to start a request. Review it before sending."}</Text><Ionicons name="chevron-forward" size={18} color={colors.burgundy} /></Pressable> : null}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          multiline
          blurOnSubmit={false}
          autoCorrect
          textAlignVertical="top"
          maxLength={1200}
          placeholder={locale === "sw" ? "Andika swali lako kwa Saada..." : "Ask Saada your question..."}
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
        />
        <Pressable disabled={pending || !input.trim()} onPress={() => void send()} style={[styles.send, (pending || !input.trim()) && styles.disabled]}>
          <Ionicons name="arrow-up" size={22} color={colors.surface} />
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.md },
  keyboard: { flex: 1 },
  chatScroll: { flex: 1 },
  chatContent: { paddingBottom: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerActions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.burgundy, borderRadius: 8, padding: spacing.lg, gap: spacing.md, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  avatar: { width: 82, height: 82, borderRadius: 25, backgroundColor: colors.softPink },
  heroCopy: { flex: 1 },
  heroLabel: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 13, letterSpacing: 0.8 },
  title: { marginTop: 3, fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 27 },
  heroBody: { marginTop: 4, fontFamily: type.regular, color: "#FAEAF0", fontSize: 13, lineHeight: 19 },
  online: { alignSelf: "flex-start", marginTop: spacing.sm, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: radius.sm, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 8, paddingVertical: 5 },
  onlineText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 13 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  locked: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.xl },
  consentCard: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginTop: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.md },
  consentCardAccepted: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  consentText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  signInNotice: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md },
  signInNoticeText: { flex: 1, fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13, lineHeight: 19 },
  guestCard: { marginTop: spacing.lg, borderRadius: 8, backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: "#B8DFDA", padding: spacing.lg, gap: spacing.sm },
  guestTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 18 },
  guestBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  guestPrimary: { minHeight: 48, marginTop: spacing.sm, borderRadius: radius.md, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  guestPrimaryText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 14 },
  guestActions: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, marginTop: spacing.sm },
  guestLink: { fontFamily: type.bold, fontWeight: "700", color: colors.teal, fontSize: 13 },
  promptRow: { marginTop: spacing.xl, gap: spacing.sm },
  prompt: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  promptText: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  messages: { marginTop: spacing.xl, gap: spacing.md },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  userRow: { justifyContent: "flex-end" },
  messageAvatar: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.softPink },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", lineHeight: 21, paddingVertical: spacing.xl },
  bubble: { maxWidth: "92%", borderRadius: radius.md, padding: spacing.md },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.burgundy },
  assistantBubble: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  messageStack: { gap: spacing.sm },
  messageText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 21 },
  feedbackRow: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", alignItems: "center", gap: spacing.md },
  feedbackLabel: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 12 },
  userText: { color: colors.surface },
  paralegalCard: { marginTop: spacing.xs, borderRadius: radius.md, borderWidth: 1, borderColor: "#F3D8E4", backgroundColor: "#FFF7FA", padding: spacing.md, gap: spacing.md },
  paralegalHeader: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  paralegalAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F6E7EE", alignItems: "center", justifyContent: "center" },
  paralegalTitleBlock: { flex: 1 },
  paralegalName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  paralegalMeta: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  paralegalActions: { flexDirection: "row", gap: spacing.sm },
  secondaryAction: { flex: 1, minHeight: 38, borderRadius: radius.sm, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  secondaryActionText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  primaryAction: { flex: 1, minHeight: 38, borderRadius: radius.sm, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  primaryActionText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 13 },
  thinking: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  activityPanel: { alignSelf: "flex-start", maxWidth: "92%", borderRadius: radius.md, borderWidth: 1, borderColor: "#F3D8E4", backgroundColor: "#FFF7FA", padding: spacing.md, gap: spacing.sm },
  activityTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 12, textTransform: "uppercase" },
  activityRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  activityText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  error: { marginTop: spacing.md, backgroundColor: "#FDEDEC", color: colors.danger, borderRadius: radius.sm, padding: spacing.md, fontFamily: type.medium },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, marginTop: spacing.xl },
  input: { flex: 1, minHeight: 54, maxHeight: 130, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 15 },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.5 },
});
