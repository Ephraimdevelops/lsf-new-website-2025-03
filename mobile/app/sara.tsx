import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

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
          <Text style={styles.paralegalMeta}>
            {card.verified ? (locale === "sw" ? "Amethibitishwa" : "Verified") : locale === "sw" ? "Angalia uthibitisho" : "Check verification"}
            {location ? ` · ${location}` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.paralegalActions}>
        {card.phone ? (
          <Pressable style={styles.secondaryAction} onPress={() => void Linking.openURL(`tel:${card.phone}`)}>
            <Ionicons name="call-outline" size={15} color={colors.burgundy} />
            <Text style={styles.secondaryActionText}>{locale === "sw" ? "Piga simu" : "Call"}</Text>
          </Pressable>
        ) : null}
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
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant" as const,
      content:
        locale === "sw"
          ? "Karibu. Naweza kukusaidia kuelewa haki zako, kuchagua hatua zinazofuata, au kukuunganisha na paralegal aliyethibitishwa."
          : "Welcome. I can help you understand your rights, choose next steps, or connect you with a verified paralegal.",
    },
  ]);

  function clearHistory() {
    setMessages([
      {
        id: "intro-reset",
        role: "assistant",
        content:
          locale === "sw"
            ? "Historia imefutwa kwa simu hii. Uliza swali fupi kuhusu ajira, ardhi, familia, usalama, au haki za walaji."
            : "History is cleared on this device. Ask a short question about employment, land, family, safety, or consumer rights.",
      },
    ]);
  }

  function buildDemoReply(body: string) {
    const lower = body.toLowerCase();
    if (lower.includes("paralegal") || lower.includes("msaada") || lower.includes("help")) {
      return locale === "sw"
        ? "Hatua salama ni kuchagua paralegal aliye karibu nawe au kutuma ombi kwa LSF ili wakupangie mtu sahihi. ::PARALEGAL_CARD:{\"name\":\"Rehema Mwanga\",\"region\":\"Dar es Salaam\",\"district\":\"Kinondoni\",\"phone\":\"+255712345678\",\"verified\":true}::"
        : "The safest next step is to choose a nearby paralegal or submit a request so LSF can match you properly. ::PARALEGAL_CARD:{\"name\":\"Rehema Mwanga\",\"region\":\"Dar es Salaam\",\"district\":\"Kinondoni\",\"phone\":\"+255712345678\",\"verified\":true}::";
    }
    if (lower.includes("salary") || lower.includes("mshahara") || lower.includes("paid")) {
      return locale === "sw"
        ? "Kama hujalipwa mshahara, hifadhi ushahidi: mkataba, ujumbe, mahudhurio, na kiasi unachodai. Kisha andika ombi rasmi au anza ombi ili LSF ikupangie msaada."
        : "If you have not been paid, keep evidence: contract, messages, attendance records, and the amount owed. Then write a formal request or start a help request so LSF can match support.";
    }
    if (lower.includes("land") || lower.includes("ardhi")) {
      return locale === "sw"
        ? "Kwa suala la ardhi, hifadhi hati, risiti, picha, majina ya mashahidi, na eneo kamili. Usisaini nyaraka mpya kabla ya kushauriana na paralegal."
        : "For a land issue, keep documents, receipts, photos, witness names, and exact location. Do not sign new papers before speaking with a paralegal.";
    }
    return locale === "sw"
      ? "Naweza kukupa maelezo ya jumla na hatua salama. Kwa uamuzi wa mwisho au hatari ya haraka, zungumza na paralegal au huduma rasmi ya dharura."
      : "I can give general information and safe next steps. For final decisions or immediate danger, speak with a paralegal or official emergency service.";
  }

  async function send(text = input) {
    const body = text.trim();
    if (!body || pending) return;
    setPending(true);
    setError("");
    setInput("");
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", content: body }]);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", content: buildDemoReply(body) }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : locale === "sw" ? "Haki haikujibu." : "Haki did not respond.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Uliza Haki" : "Ask Haki"}</Text>
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Futa historia" : "Clear history"} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={22} color={colors.burgundy} />
          </Pressable>
          <QuickExit locale={locale} />
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}><Ionicons name="sparkles-outline" size={28} color={colors.surface} /></View>
        <Text style={styles.title}>{locale === "sw" ? "Uliza Haki" : "Ask Haki"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Pata maelezo rahisi ya haki zako, hatua zinazofuata, na njia salama ya kuunganishwa na msaada."
            : "Get simple rights guidance, next steps, and a safe path to verified support."}
        </Text>
      </View>

      <View style={styles.promptRow}>
        {quickPrompts[locale].map((prompt) => (
          <Pressable key={prompt} style={styles.prompt} onPress={() => void send(prompt)}>
            <Text style={styles.promptText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.messages}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.assistantBubble]}>
            <SaraMessageContent content={message.content} isUser={message.role === "user"} locale={locale} />
          </View>
        ))}
        {pending ? <Text style={styles.thinking}>{locale === "sw" ? "Haki inatafuta jibu..." : "Haki is checking..."}</Text> : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1200}
          placeholder={locale === "sw" ? "Andika swali lako..." : "Write your question..."}
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
        />
        <Pressable disabled={pending || !input.trim()} onPress={() => void send()} style={[styles.send, (pending || !input.trim()) && styles.disabled]}>
          <Ionicons name="arrow-up" size={22} color={colors.surface} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerActions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.burgundy, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, color: colors.surface, fontSize: 28 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  locked: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.xl },
  promptRow: { marginTop: spacing.xl, gap: spacing.sm },
  prompt: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  promptText: { fontFamily: type.medium, color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  messages: { marginTop: spacing.xl, gap: spacing.md },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", lineHeight: 21, paddingVertical: spacing.xl },
  bubble: { maxWidth: "92%", borderRadius: radius.md, padding: spacing.md },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.burgundy },
  assistantBubble: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  messageStack: { gap: spacing.sm },
  messageText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 21 },
  userText: { color: colors.surface },
  paralegalCard: { marginTop: spacing.xs, borderRadius: radius.md, borderWidth: 1, borderColor: "#F3D8E4", backgroundColor: "#FFF7FA", padding: spacing.md, gap: spacing.md },
  paralegalHeader: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  paralegalAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F6E7EE", alignItems: "center", justifyContent: "center" },
  paralegalTitleBlock: { flex: 1 },
  paralegalName: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  paralegalMeta: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  paralegalActions: { flexDirection: "row", gap: spacing.sm },
  secondaryAction: { flex: 1, minHeight: 38, borderRadius: radius.sm, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  secondaryActionText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  primaryAction: { flex: 1, minHeight: 38, borderRadius: radius.sm, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  primaryActionText: { fontFamily: type.bold, color: colors.surface, fontSize: 12 },
  thinking: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  error: { marginTop: spacing.md, backgroundColor: "#FDEDEC", color: colors.danger, borderRadius: radius.sm, padding: spacing.md, fontFamily: type.medium },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, marginTop: spacing.xl },
  input: { flex: 1, minHeight: 50, maxHeight: 130, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.5 },
});
