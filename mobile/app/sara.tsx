import Ionicons from "@expo/vector-icons/Ionicons";
import { useAction, useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { ChatActivity, useReducedMotion } from "../src/chat/ChatActivity";
import { ChatResponse, type ChatSource } from "../src/chat/ChatResponse";
import { chatPreview } from "../src/chat/preview";
import { useLanguage } from "../src/i18n";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { colors, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type ConversationId = Id<"sara_conversations"> | "legacy" | null;
type Message = { id: string; role: "user" | "assistant"; content: string; sources?: ChatSource[]; failed?: boolean };
const prompts = {
  sw: ["Sijalipwa mshahara. Nianzie wapi?", "Nipate msaada wa kisheria karibu nami", "Nielewe haki zangu kama mpangaji"],
  en: ["I haven't been paid. Where do I start?", "Find legal support near me", "Help me understand my rights as a tenant"],
};
const activities: Record<string, [string, string]> = {
  intent_detected: ["Ninaangalia swali lako", "Looking at your question"],
  risk_check_started: ["Ninaangalia hali yako", "Understanding your situation"],
  risk_check_completed: ["Ninaandaa hatua inayofuata", "Working out the next step"],
  knowledge_search_started: ["Ninapitia vyanzo vya kisheria", "Reviewing legal sources"],
  knowledge_search_completed: ["Ninaandaa mwongozo wako", "Preparing your guidance"],
  service_search_started: ["Ninatafuta huduma karibu nawe", "Finding services near you"],
  service_search_completed: ["Ninakagua huduma zilizopatikana", "Checking the matching services"],
  tool_execution_started: ["Ninaangalia chaguo za msaada", "Looking into support options"],
  tool_execution_completed: ["Ninaunganisha taarifa", "Bringing the details together"],
  human_review_requested: ["Msaada wa mtu unapendekezwa", "Human support is recommended"],
  completed: ["Ninakamilisha jibu", "Finishing your answer"],
  failed: ["Jibu halijakamilika", "The response did not complete"],
};

export default function SaraScreen() {
  useSensitiveScreenProtection("sara");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const { isSignedIn, userId } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { evaluationQuestion } = useLocalSearchParams<{ evaluationQuestion?: string }>();
  const { draft, hasSavedDraft, updateDraft, resetDraft } = useIntakeDraft();
  const ask = useAction(api.sara_actions.ask);
  const createConversation = useMutation(api.sara_chat.createConversation);
  const saveMessage = useMutation(api.sara_chat.sendMessage);
  const deleteConversation = useMutation(api.sara_chat.deleteConversation);
  const clearLegacy = useMutation(api.sara_chat.clearHistory);
  const [deleting, setDeleting] = useState<ConversationId>(null);
  const submitFeedback = useMutation(api.sara_chat.submitFeedback);
  const [conversationId, setConversationId] = useState<ConversationId>(null);
  const [optimistic, setOptimistic] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [requestId, setRequestId] = useState<string>();
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [handoffStory, setHandoffStory] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [rated, setRated] = useState<Record<string, "positive" | "negative">>({});
  const [previewMode, setPreviewMode] = useState<"reply" | "working" | null>(null);
  const preview = __DEV__ && previewMode !== null;
  const scroll = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const followBottom = useRef(true);
  const sending = useRef(false);
  const session = useRef(0);
  const consentBody = useRef("");
  const entrance = useRef(new Animated.Value(1)).current;

  const threads = usePaginatedQuery(api.sara_chat.listConversations, isSignedIn ? {} : "skip", { initialNumItems: 20 });
  const legacy = useQuery(api.sara_chat.getLegacyConversation, isSignedIn ? {} : "skip");
  const history = usePaginatedQuery(api.sara_chat.getConversationMessages,
    isSignedIn && conversationId && !preview ? { conversationId: conversationId === "legacy" ? undefined : conversationId } : "skip",
    { initialNumItems: 30 });
  const events = useQuery(api.sara_chat.getActivityEvents, isSignedIn && pending && requestId ? { requestId, limit: 1 } : "skip");
  const serverMessages: Message[] = conversationId ? [...history.results].reverse().map(message => ({
    id: String(message._id), role: message.role, content: message.content,
    sources: Array.isArray(message.metadata?.retrievedSources) ? message.metadata.retrievedSources : undefined,
    failed: Boolean(message.metadata?.failureCode),
  })) : [];
  const messages: Message[] = preview ? chatPreview(sw).slice(0, previewMode === "working" ? 1 : 2) : [...serverMessages, ...optimistic.filter(message => !serverMessages.some(saved => saved.id === message.id))].filter(message => message.content);
  const latestQuestion = [...messages].reverse().find(message => message.role === "user")?.content;
  const started = messages.length > 0;
  const loadingMessages = !preview && Boolean(conversationId) && history.status === "LoadingFirstPage" && !optimistic.length;
  const event = events?.[events.length - 1];
  const activityLabel = activities[preview ? "service_search_started" : event?.type || "intent_detected"]?.[sw ? 0 : 1] || (sw ? "Ninaandaa jibu" : "Preparing an answer");
  const currentTitle = conversationId === "legacy" ? (sw ? "Mazungumzo ya awali" : "Earlier conversation") : threads.results.find(thread => thread._id === conversationId)?.title;
  const filteredThreads = threads.results.filter(thread => thread.title.toLocaleLowerCase().includes(historySearch.toLocaleLowerCase()));

  useEffect(() => {
    session.current += 1;
    setConversationId(null); setOptimistic([]); setInput(""); setError(""); setPending(false);
    setConsentAccepted(false); setHistoryOpen(false); setConsentOpen(false); setHandoffStory(null); setRated({});
    sending.current = false;
  }, [userId]);
  useEffect(() => {
    if (evaluationQuestion?.trim()) setInput(evaluationQuestion);
  }, [evaluationQuestion]);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  useEffect(() => {
    entrance.setValue(reducedMotion ? 1 : 0);
    const animation = Animated.timing(entrance, { toValue: 1, duration: 300, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [conversationId, entrance, reducedMotion]);

  function selectConversation(id: ConversationId) {
    if (sending.current) return;
    setPreviewMode(null);
    setConversationId(id); setOptimistic([]); setInput(""); setError(""); setHistoryOpen(false);
    followBottom.current = true; setAtBottom(true);
  }

  function confirmDelete(id: Exclude<ConversationId, null>, title: string) {
    if (deleting || pending) return;
    Alert.alert(sw ? "Futa mazungumzo?" : "Delete conversation?", title, [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" },
      { text: sw ? "Futa" : "Delete", style: "destructive", onPress: async () => {
        setDeleting(id);
        try {
          if (id === "legacy") await clearLegacy();
          else await deleteConversation({ conversationId: id });
          if (conversationId === id) selectConversation(null);
        } catch { Alert.alert(sw ? "Haikufutwa" : "Could not delete", sw ? "Jaribu tena." : "Please try again."); }
        finally { setDeleting(null); }
      } },
    ]);
  }

  function toBottom(animated = true) {
    followBottom.current = true; setAtBottom(true);
    scroll.current?.scrollToEnd({ animated: animated && !reducedMotion });
  }

  async function send(text = input, accepted = consentAccepted) {
    const body = text.trim();
    if (!body || sending.current || preview) return;
    if (!isSignedIn) {
      router.push({ pathname: "/sign-in", params: { returnTo: "sara" } });
      return;
    }
    if (!accepted) {
      consentBody.current = body;
      Keyboard.dismiss(); setConsentOpen(true);
      return;
    }
    sending.current = true; setPending(true); setError(""); setInput("");
    const request = "mobile-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const sessionAtStart = session.current;
    setRequestId(request);
    const temporaryId = "local-" + request;
    setOptimistic(current => [...current, { id: temporaryId, role: "user", content: body }]);
    followBottom.current = true;
    try {
      let target = conversationId;
      if (!target) {
        target = await createConversation({ title: body });
        if (session.current !== sessionAtStart) return;
        setConversationId(target);
      }
      const savedId = await saveMessage({ content: body, conversationId: target === "legacy" ? undefined : target });
      if (session.current !== sessionAtStart) return;
      setOptimistic(current => current.map(message => message.id === temporaryId ? { ...message, id: String(savedId) } : message));
      await ask({
        message: body,
        source: "mobile", clientRequestId: request, locale,
        conversationId: target === "legacy" ? undefined : target,
      });
    } catch {
      if (session.current !== sessionAtStart) return;
      setError(sw ? "Jibu halikukamilika. Unaweza kujaribu tena au kutafuta msaada." : "The reply did not finish. You can try again or find support.");
      setInput(body);
      setOptimistic(current => current.filter(message => message.id !== temporaryId));
    } finally {
      if (session.current === sessionAtStart) { setPending(false); sending.current = false; }
    }
  }

  async function rate(id: string, rating: "positive" | "negative") {
    if (id.startsWith("local-")) return;
    try {
      await submitFeedback({ messageId: id as Id<"sara_chats">, rating });
      setRated(current => ({ ...current, [id]: rating }));
    } catch { setError(sw ? "Maoni hayakuhifadhiwa. Jaribu tena." : "Feedback could not be saved. Try again."); }
  }

  const iconButton = (icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void, disabled = false) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.headerButton, pressed && styles.pressed, disabled && styles.disabled]}>
      <Ionicons name={icon} size={21} color="#FFF9F5" />
    </Pressable>
  );

  return <SafeAreaView edges={["top"]} style={styles.screen}>
    <StatusBar style="light" />
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        {iconButton("chevron-back", sw ? "Rudi" : "Back", () => router.back())}
        <View style={styles.identity}><Text style={styles.title}>Haki Yangu <Text style={styles.aiLabel}>AI</Text></Text><Text numberOfLines={1} style={styles.subtitle}>{currentTitle || (sw ? "Tuko pamoja, hatua kwa hatua" : "Together, one step at a time")}</Text></View>
        {iconButton("time-outline", sw ? "Mazungumzo ya awali" : "Past conversations", () => { Keyboard.dismiss(); setHistorySearch(""); setHistoryOpen(true); }, pending)}
        {iconButton("create-outline", sw ? "Mazungumzo mapya" : "New conversation", () => selectConversation(null), pending)}
      </View>

      <View style={styles.canvas}>
        <View style={styles.contextBar}><View style={styles.lsfMark}><Text style={styles.lsfText}>LSF</Text></View><Text style={styles.contextText}>{sw ? "Msaidizi wako wa haki" : "Your rights companion"}</Text><Pressable accessibilityRole="button" accessibilityLabel={sw ? "Ondoka haraka" : "Quick exit"} onPress={() => router.replace("/(tabs)")} style={styles.exit}><Ionicons name="exit-outline" size={15} color={colors.inkMuted} /><Text style={styles.exitText}>{sw ? "Toka" : "Exit"}</Text></Pressable></View>
        {preview ? <View style={styles.previewBar}><Text style={styles.previewLabel}>Design preview</Text>{(["reply", "working"] as const).map(mode => <Pressable key={mode} onPress={() => { setPreviewMode(mode); followBottom.current = false; scroll.current?.scrollTo({ y: 0, animated: false }); }} style={[styles.previewOption, previewMode === mode && styles.previewSelected]}><Text style={styles.previewLabel}>{mode === "reply" ? "Reply" : "Working"}</Text></Pressable>)}<Pressable accessibilityLabel="Close preview" style={styles.toolButton} onPress={() => selectConversation(null)}><Ionicons name="close" size={17} color={colors.inkMuted} /></Pressable></View> : null}
        <ScrollView ref={scroll} style={styles.flex} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
          contentContainerStyle={[styles.chatContent, !started && styles.emptyContent]}
          onScroll={event => {
            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
            const bottom = contentSize.height - contentOffset.y - layoutMeasurement.height < 100;
            followBottom.current = bottom; setAtBottom(bottom);
          }} scrollEventThrottle={80}
          onContentSizeChange={() => { if (started && followBottom.current) scroll.current?.scrollToEnd({ animated: false }); }}>
          {loadingMessages ? <View style={styles.loading}><ActivityIndicator color={colors.burgundy} /><Text style={styles.smallText}>{sw ? "Inafungua mazungumzo" : "Opening conversation"}</Text></View> : null}

          {!started && !loadingMessages ? <Animated.View style={[styles.welcome, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
            <View style={styles.welcomeMark}><Ionicons name="chatbubble-ellipses-outline" size={27} color={colors.burgundy} /></View>
            <Text style={styles.greeting}>{sw ? "Karibu. Tuanzie hapa." : "Hello. Let's start here."}</Text>
            <Text style={styles.welcomeBody}>{sw ? "Niambie kinachoendelea. Tutafute hatua inayokufaa." : "Tell me what's happening. Let's find your next step."}</Text>
            <View style={styles.topicRow}>
              {[{ icon: "book-outline" as const, sw: "Haki zangu", en: "My rights", color: "#A67927", prompt: prompts[locale][2] }, { icon: "location-outline" as const, sw: "Msaada karibu", en: "Nearby help", color: colors.teal, prompt: prompts[locale][1] }, { icon: "compass-outline" as const, sw: "Hatua inayofuata", en: "Next steps", color: colors.burgundy, prompt: prompts[locale][0] }].map(topic => <Pressable key={topic.en} style={styles.topic} onPress={() => { setInput(topic.prompt); inputRef.current?.focus(); }}><Ionicons name={topic.icon} size={20} color={topic.color} /><Text style={styles.topicText}>{sw ? topic.sw : topic.en}</Text></Pressable>)}
            </View>
            <View style={styles.suggestions}>{prompts[locale].slice(0, 2).map(prompt => <Pressable key={prompt} onPress={() => { setInput(prompt); inputRef.current?.focus(); }} style={styles.suggestion}><Text style={styles.suggestionText}>{prompt}</Text><Ionicons name="arrow-forward" size={16} color="#8C898B" /></Pressable>)}</View>
            {isSignedIn && threads.results[0] ? <Pressable style={styles.resume} onPress={() => selectConversation(threads.results[0]._id)}><Ionicons name="time-outline" size={17} color={colors.inkMuted} /><View style={styles.flex}><Text style={styles.resumeLabel}>{sw ? "Endelea ulipoishia" : "Pick up where you left off"}</Text><Text numberOfLines={1} style={styles.resumeTitle}>{threads.results[0].title}</Text></View><Ionicons name="chevron-forward" size={15} color={colors.inkMuted} /></Pressable> : null}
          </Animated.View> : null}

          {conversationId && history.status === "CanLoadMore" ? <Pressable style={styles.loadMore} onPress={() => { followBottom.current = false; history.loadMore(30); }}><Text style={styles.smallText}>{sw ? "Ujumbe wa awali" : "Earlier messages"}</Text></Pressable> : null}
          {history.status === "LoadingMore" ? <ActivityIndicator color={colors.teal} /> : null}
          <View style={styles.messageList}>{messages.map(message => <View key={message.id} style={message.role === "user" ? styles.userRow : styles.assistantRow}>
            {message.role === "user" ? <View style={styles.userBubble}><Text selectable style={styles.userText}>{message.content}</Text></View> : <>
              <View style={styles.answerIdentity}><Ionicons name={message.failed ? "information-circle-outline" : "sparkles-outline"} size={14} color={colors.burgundy} /><Text style={styles.answerIdentityText}>{message.failed ? (sw ? "Haipatikani kwa sasa" : "Temporarily unavailable") : "Haki Yangu AI"}</Text></View>
              <ChatResponse content={message.content} sources={message.sources} sw={sw} preview={preview} />
              {!pending && !preview && !message.failed ? <View style={styles.answerTools}><Pressable style={styles.toolButton} accessibilityLabel={sw ? "Jibu limesaidia" : "Helpful response"} onPress={() => void rate(message.id, "positive")}><Ionicons name={rated[message.id] === "positive" ? "thumbs-up" : "thumbs-up-outline"} size={16} color={rated[message.id] === "positive" ? colors.teal : "#939094"} /></Pressable><Pressable style={styles.toolButton} accessibilityLabel={sw ? "Jibu halijasaidia" : "Unhelpful response"} onPress={() => void rate(message.id, "negative")}><Ionicons name={rated[message.id] === "negative" ? "thumbs-down" : "thumbs-down-outline"} size={16} color={rated[message.id] === "negative" ? colors.burgundy : "#939094"} /></Pressable>{rated[message.id] ? <Text style={styles.smallText}>{sw ? "Asante" : "Thank you"}</Text> : null}</View> : null}
            </>}
          </View>)}</View>
          {pending || (preview && previewMode === "working") ? <ChatActivity label={activityLabel} reducedMotion={reducedMotion} /> : null}
          {error ? <View style={styles.errorRow}><Ionicons name="alert-circle-outline" size={17} color={colors.burgundy} /><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => void send()} accessibilityLabel={sw ? "Jaribu tena" : "Retry"} style={styles.toolButton}><Ionicons name="refresh-outline" size={20} color={colors.burgundy} /></Pressable></View> : null}
          {latestQuestion && !pending && !preview ? <View style={styles.nextSteps}>
            <Pressable style={styles.nextStep} onPress={() => router.push("/find-services")}><Ionicons name="location-outline" size={16} color={colors.teal} /><Text style={styles.nextStepText}>{sw ? "Tafuta msaada" : "Find support"}</Text><Ionicons name="arrow-forward" size={14} color={colors.inkMuted} /></Pressable>
            <Pressable accessibilityRole="button" style={styles.nextStep} onPress={() => { Keyboard.dismiss(); setHandoffStory(latestQuestion.slice(0, 5000)); }}><Ionicons name="document-text-outline" size={16} color={colors.burgundy} /><Text style={styles.nextStepText}>{sw ? "Andaa ombi" : "Draft a request"}</Text><Ionicons name="arrow-forward" size={14} color={colors.inkMuted} /></Pressable>
          </View> : null}
        </ScrollView>

        {!atBottom && started ? <Pressable accessibilityLabel={sw ? "Ujumbe mpya zaidi" : "Latest message"} style={styles.jumpButton} onPress={() => toBottom()}><Ionicons name="arrow-down" size={19} color={colors.charcoal} /></Pressable> : null}
        <View style={[styles.composerArea, { paddingBottom: keyboardVisible ? 8 : Math.max(insets.bottom, 12) }]}>
          {!isSignedIn ? <Pressable style={styles.signIn} onPress={() => router.push({ pathname: "/sign-in", params: { returnTo: "sara" } })}><Ionicons name="lock-closed-outline" size={12} color={colors.inkMuted} /><Text style={styles.signInText}>{sw ? "Ingia ili kuhifadhi na kuendelea na mazungumzo" : "Sign in to save and continue your conversations"}</Text><Ionicons name="arrow-forward" size={13} color={colors.burgundy} /></Pressable> : null}
          <View style={styles.composer}>
            <TextInput ref={inputRef} accessibilityLabel={sw ? "Ujumbe kwa Haki Yangu AI" : "Message Haki Yangu AI"} value={input} editable={!preview} autoCorrect={!sw} spellCheck={!sw} onChangeText={setInput} multiline maxLength={1200} style={styles.input} placeholder={sw ? "Uliza chochote kuhusu haki zako..." : "Ask about your rights..."} placeholderTextColor="#989397" textAlignVertical="top" onFocus={() => { if (followBottom.current) toBottom(false); }} />
            <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Tuma ujumbe" : "Send message"} accessibilityState={{ disabled: pending || preview || !input.trim() }} disabled={pending || preview || !input.trim()} onPress={() => void send()} style={({ pressed }) => [styles.send, !input.trim() && styles.sendIdle, pressed && styles.pressed]}>{pending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="arrow-up" size={21} color={input.trim() ? "#FFFFFF" : "#827A7E"} />}</Pressable>
          </View>
          <Text style={styles.disclaimer}>{sw ? "Mwongozo wa jumla. Hakiki taarifa muhimu." : "General guidance. Check important information."}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>

    <Modal visible={historyOpen} animationType={reducedMotion ? "none" : "slide"} onRequestClose={() => setHistoryOpen(false)}>
      <View style={[styles.historyScreen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}><StatusBar style="dark" />
        <View style={styles.historyHeader}><Pressable style={styles.lightIcon} accessibilityLabel={sw ? "Funga historia" : "Close history"} onPress={() => setHistoryOpen(false)}><Ionicons name="chevron-back" size={23} color={colors.charcoal} /></Pressable><Text style={styles.historyTitle}>{sw ? "Mazungumzo yako" : "Your conversations"}</Text><Pressable style={styles.lightIcon} accessibilityLabel={sw ? "Mazungumzo mapya" : "New conversation"} onPress={() => selectConversation(null)}><Ionicons name="create-outline" size={22} color={colors.burgundy} /></Pressable></View>
        <View style={styles.search}><Ionicons name="search-outline" size={18} color={colors.inkMuted} /><TextInput value={historySearch} onChangeText={setHistorySearch} style={styles.searchInput} placeholder={sw ? "Tafuta mazungumzo" : "Search conversations"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Tafuta mazungumzo" : "Search conversations"} /></View>
        {!isSignedIn ? <View style={styles.historyEmpty}><Ionicons name="chatbubbles-outline" size={34} color={colors.teal} /><Text style={styles.emptyTitle}>{sw ? "Mazungumzo yako, pamoja." : "Your conversations, together."}</Text><Text style={styles.emptyBody}>{sw ? "Ingia ili kuhifadhi mazungumzo na kuyarudia baadaye." : "Sign in to keep your conversations and return to them later."}</Text><Pressable style={styles.modalPrimary} onPress={() => { setHistoryOpen(false); router.push({ pathname: "/sign-in", params: { returnTo: "sara" } }); }}><Text style={styles.modalPrimaryText}>{sw ? "Ingia" : "Sign in"}</Text></Pressable></View> : <ScrollView contentContainerStyle={styles.historyList} keyboardShouldPersistTaps="handled">
          {threads.status === "LoadingFirstPage" ? <ActivityIndicator color={colors.burgundy} /> : null}
          {filteredThreads.map(thread => <View key={thread._id} style={[styles.historyItem, conversationId === thread._id && styles.historyItemActive]}><Pressable onPress={() => selectConversation(thread._id)} style={styles.historyOpenRow}><Ionicons name="chatbubble-outline" size={19} color={colors.inkMuted} /><View style={styles.flex}><Text numberOfLines={2} style={styles.historyItemTitle}>{thread.title}</Text><Text style={styles.historyDate}>{new Date(thread.updatedAt).toLocaleDateString(sw ? "sw-TZ" : "en-GB", { day: "numeric", month: "short" })}</Text></View></Pressable><Pressable disabled={Boolean(deleting)} style={styles.lightIcon} accessibilityLabel={(sw ? "Futa mazungumzo: " : "Delete conversation: ") + thread.title} onPress={() => confirmDelete(thread._id, thread.title)}>{deleting === thread._id ? <ActivityIndicator size="small" color={colors.burgundy} /> : <Ionicons name="trash-outline" size={17} color="#A1949B" />}</Pressable></View>)}
          {legacy && !historySearch ? <View style={styles.historyItem}><Pressable style={styles.historyOpenRow} onPress={() => selectConversation("legacy")}><Ionicons name="archive-outline" size={19} color={colors.inkMuted} /><View style={styles.flex}><Text style={styles.historyItemTitle}>{sw ? "Mazungumzo ya awali" : "Earlier conversation"}</Text><Text style={styles.historyDate}>{sw ? "Historia yako iliyohifadhiwa" : "Your existing saved history"}</Text></View></Pressable><Pressable disabled={Boolean(deleting)} style={styles.lightIcon} accessibilityLabel={sw ? "Futa mazungumzo ya awali" : "Delete earlier conversation"} onPress={() => confirmDelete("legacy", sw ? "Mazungumzo ya awali" : "Earlier conversation")}><Ionicons name="trash-outline" size={17} color="#A1949B" /></Pressable></View> : null}
          {!filteredThreads.length && (historySearch || !legacy) && threads.status !== "LoadingFirstPage" ? <View style={styles.historyEmpty}><Ionicons name="chatbubbles-outline" size={30} color={colors.teal} /><Text style={styles.emptyTitle}>{historySearch ? (sw ? "Hakuna matokeo" : "No matches") : (sw ? "Mwanzo mpya" : "A fresh start")}</Text><Text style={styles.emptyBody}>{historySearch ? (sw ? "Jaribu maneno mengine." : "Try another search.") : (sw ? "Mazungumzo utakayoanza yataonekana hapa." : "Conversations you start will appear here.")}</Text></View> : null}
          {threads.status === "CanLoadMore" ? <Pressable style={styles.loadMore} onPress={() => threads.loadMore(20)}><Text style={styles.smallText}>{sw ? "Mazungumzo zaidi" : "More conversations"}</Text></Pressable> : null}
          {threads.status === "LoadingMore" ? <ActivityIndicator color={colors.teal} /> : null}
        </ScrollView>}
        {__DEV__ ? <Pressable style={styles.previewEntry} onPress={() => { setHistoryOpen(false); setPreviewMode("reply"); setConversationId(null); setOptimistic([]); setError(""); setInput(""); followBottom.current = false; }}><Ionicons name="color-palette-outline" size={18} color={colors.teal} /><Text style={styles.smallText}>Design preview</Text><Ionicons name="arrow-forward" size={16} color={colors.inkMuted} /></Pressable> : null}
      </View>
    </Modal>

    <Modal visible={handoffStory !== null} transparent animationType={reducedMotion ? "none" : "fade"} onRequestClose={() => setHandoffStory(null)}>
      <View style={styles.modalBackdrop}><View style={[styles.consentSheet, { maxHeight: Math.max(160, windowHeight - insets.top - insets.bottom - 48) }]}><ScrollView contentContainerStyle={{ gap: 16 }} keyboardShouldPersistTaps="handled">
        <View style={styles.consentHeader}><Ionicons name="document-text-outline" size={25} color={colors.burgundy} /><Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} onPress={() => setHandoffStory(null)} style={styles.lightIcon}><Ionicons name="close" size={22} color={colors.inkMuted} /></Pressable></View>
        <Text style={styles.emptyTitle}>{sw ? "Kagua maelezo ya ombi" : "Review your request story"}</Text>
        <Text selectable style={styles.consentBody}>{handoffStory}</Text>
        <Text style={styles.consentBody}>{sw ? "Tutatumia maneno yako pekee kuanza rasimu mpya. Jibu la AI halitaongezwa. Hakuna ombi litakalotumwa mpaka ukague taarifa zote na ukubali kutuma." : "Only your words will start a new draft. The AI answer will not be included. Nothing is submitted until you review all details and consent to send."}</Text>
        {(draft.description || draft.issueCategory || draft.region || draft.district || draft.desiredHelp || draft.sourceServiceId || hasSavedDraft) ? <>
          <Text style={styles.errorText}>{sw ? "Tayari una rasimu. Kuanzisha mpya kutabadilisha rasimu iliyo wazi; rasimu iliyohifadhiwa itabaki mpaka uhifadhi tena au utume." : "You already have a draft. Starting a new one replaces the open draft; a saved draft stays until you save again or submit."}</Text>
          <Pressable accessibilityRole="button" style={styles.loadMore} onPress={() => { setHandoffStory(null); router.push("/intake"); }}><Text style={styles.nextStepText}>{sw ? "Endelea na rasimu iliyopo" : "Continue the existing draft"}</Text></Pressable>
        </> : null}
        <Pressable accessibilityRole="button" style={styles.modalPrimary} onPress={() => { if (!handoffStory) return; resetDraft(locale); updateDraft({ description: handoffStory, locale }); setHandoffStory(null); router.push("/intake"); }}><Text style={styles.modalPrimaryText}>{sw ? "Anza rasimu mpya kwa maneno haya" : "Start a new draft with these words"}</Text></Pressable>
      </ScrollView></View></View>
    </Modal>

    <Modal visible={consentOpen} transparent animationType={reducedMotion ? "none" : "fade"} onRequestClose={() => setConsentOpen(false)}>
      <View style={styles.modalBackdrop}><View style={styles.consentSheet}>
        <View style={styles.consentHeader}><Ionicons name="information-circle-outline" size={25} color={colors.burgundy} /><Pressable accessibilityLabel={sw ? "Funga" : "Close"} onPress={() => setConsentOpen(false)} style={styles.lightIcon}><Ionicons name="close" size={22} color={colors.inkMuted} /></Pressable></View>
        <Text style={styles.emptyTitle}>{sw ? "Kabla hatujaanza" : "Before we start"}</Text>
        <Text style={styles.consentBody}>{sw ? "Haki Yangu AI hutoa mwongozo wa jumla. Inaweza kukosea na si mbadala wa wakili au huduma ya dharura." : "Haki Yangu AI provides general guidance. It can make mistakes and does not replace a lawyer or emergency services."}</Text>
        <Pressable style={styles.modalPrimary} onPress={() => { setConsentAccepted(true); setConsentOpen(false); void send(consentBody.current, true); }}><Text style={styles.modalPrimaryText}>{sw ? "Nimeelewa, endelea" : "I understand, continue"}</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF" /></Pressable>
      </View></View>
    </Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  previewBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, backgroundColor: "#F5F7F5" },
  previewLabel: { fontFamily: type.regular, fontSize: 11, color: colors.teal },
  previewOption: { paddingHorizontal: 10, paddingVertical: 9, borderRadius: 6 },
  previewSelected: { backgroundColor: "#E1ECE7" },
  previewEntry: { flexDirection: "row", alignItems: "center", gap: 12, padding: 24, borderTopWidth: 1, borderTopColor: "#EEE9EC" },
  screen: { flex: 1, backgroundColor: "#321D27" },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 22 },
  headerButton: { width: 42, height: 44, alignItems: "center", justifyContent: "center" },
  identity: { flex: 1, paddingLeft: 5 },
  title: { fontFamily: type.medium, fontSize: 18, color: "#FFF9F5", lineHeight: 24 },
  aiLabel: { fontFamily: type.regular, color: "#DAC0CB" },
  subtitle: { fontFamily: type.regular, fontSize: 11, color: "#C5AEB9", marginTop: 3 },
  canvas: { flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" },
  contextBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingTop: 13, paddingBottom: 8 },
  lsfMark: { width: 27, height: 23, borderRadius: 5, backgroundColor: "#F6F0DF", alignItems: "center", justifyContent: "center" },
  lsfText: { fontFamily: type.medium, fontSize: 9, color: "#806321" },
  contextText: { flex: 1, fontFamily: type.regular, fontSize: 11, color: "#969094" },
  exit: { minHeight: 36, flexDirection: "row", alignItems: "center", gap: 5 },
  exitText: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted },
  chatContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 24 },
  emptyContent: { flexGrow: 1 },
  welcome: { paddingTop: 28 },
  welcomeMark: { width: 54, height: 54, borderRadius: 18, backgroundColor: "#F6EFF2", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  greeting: { fontFamily: type.medium, fontSize: 29, lineHeight: 37, color: "#34272E", maxWidth: 290 },
  welcomeBody: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: "#8A8287", marginTop: 12, maxWidth: 300 },
  topicRow: { flexDirection: "row", gap: 10, marginTop: 30 },
  topic: { flex: 1, minHeight: 76, paddingVertical: 12, paddingHorizontal: 7, alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 8, backgroundColor: "#F8F8F6" },
  topicText: { fontFamily: type.regular, fontSize: 11, textAlign: "center", color: "#655E62", lineHeight: 16 },
  suggestions: { marginTop: 23 },
  suggestion: { flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 17, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#EAE7E8" },
  suggestionText: { flex: 1, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: "#756D72" },
  resume: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 27, paddingVertical: 12 },
  resumeLabel: { fontFamily: type.regular, fontSize: 11, color: "#989095", marginBottom: 4 },
  resumeTitle: { fontFamily: type.regular, fontSize: 13, color: "#655B62" },
  messageList: { gap: 28 },
  userRow: { alignItems: "flex-end" },
  userBubble: { maxWidth: "87%", backgroundColor: "#F2EDF0", borderRadius: 20, borderTopRightRadius: 5, paddingHorizontal: 17, paddingVertical: 13 },
  userText: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: "#4F3946" },
  assistantRow: { gap: 12 },
  answerIdentity: { flexDirection: "row", alignItems: "center", gap: 7 },
  answerIdentityText: { fontFamily: type.regular, fontSize: 11, color: "#9C7C8A" },
  answerTools: { flexDirection: "row", alignItems: "center", gap: 3 },
  toolButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  nextSteps: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  nextStep: { flexDirection: "row", alignItems: "center", gap: 7, minHeight: 42, borderRadius: 8, paddingHorizontal: 11, backgroundColor: "#F5F7F5" },
  nextStepText: { fontFamily: type.regular, fontSize: 12, color: "#696568" },
  composerArea: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: "#FFFFFF" },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 8, padding: 7, backgroundColor: "#F8F6F7", borderRadius: 27, borderWidth: 1, borderColor: "#EEE9EC" },
  input: { flex: 1, minHeight: 42, maxHeight: 130, paddingVertical: 11, paddingLeft: 13, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: "#3F353B" },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  sendIdle: { backgroundColor: "#EAE2E6" },
  disclaimer: { textAlign: "center", fontFamily: type.regular, fontSize: 10, lineHeight: 16, color: "#A49CA1", marginTop: 9 },
  signIn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingBottom: 12 },
  signInText: { flexShrink: 1, fontFamily: type.regular, fontSize: 11, color: "#81757C" },
  jumpButton: { position: "absolute", bottom: 155, right: 23, width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E6E0E3", alignItems: "center", justifyContent: "center" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
  errorText: { flex: 1, fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.burgundy },
  loading: { paddingVertical: 60, alignItems: "center", gap: 14 },
  smallText: { fontFamily: type.regular, fontSize: 12, color: colors.inkMuted },
  loadMore: { alignItems: "center", padding: 18 },
  pressed: { opacity: 0.65 },
  disabled: { opacity: 0.35 },
  historyScreen: { flex: 1, backgroundColor: "#FFFFFF" },
  historyHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10 },
  historyTitle: { flex: 1, fontFamily: type.semibold, fontSize: 21, color: "#3F3039", paddingLeft: 6 },
  lightIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  search: { marginHorizontal: 24, marginTop: 12, marginBottom: 20, paddingHorizontal: 14, backgroundColor: "#F7F5F6", borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, minHeight: 48, fontFamily: type.regular, fontSize: 14, color: colors.charcoal },
  historyList: { paddingHorizontal: 16, paddingBottom: 30 },
  historyOpenRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 13, minHeight: 48 },
  historyItem: { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 12, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#EEE9EC" },
  historyItemActive: { backgroundColor: "#F8F2F5", borderRadius: 8 },
  historyItemTitle: { fontFamily: type.medium, fontSize: 15, lineHeight: 22, color: "#4D3C46" },
  historyDate: { fontFamily: type.regular, fontSize: 11, color: "#A0969C", marginTop: 5 },
  historyEmpty: { paddingHorizontal: 24, paddingTop: 60, gap: 18 },
  emptyTitle: { fontFamily: type.regular, fontSize: 25, lineHeight: 32, color: "#3F3039" },
  emptyBody: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.inkMuted },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(35,20,29,0.38)", justifyContent: "center", padding: 24 },
  consentSheet: { borderRadius: 24, backgroundColor: "#FFFFFF", padding: 24, gap: 16 },
  consentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  consentBody: { fontFamily: type.regular, fontSize: 15, lineHeight: 24, color: "#81717A" },
  modalPrimary: { minHeight: 50, borderRadius: 8, backgroundColor: colors.burgundy, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 },
  modalPrimaryText: { fontFamily: type.medium, fontSize: 14, color: "#FFFFFF" },
});
