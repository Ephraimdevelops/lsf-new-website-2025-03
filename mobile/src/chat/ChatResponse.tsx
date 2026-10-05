import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Fragment, memo, useMemo, useState, type ReactNode } from "react";
import { Linking, Pressable, StyleSheet, Text, View, type TextStyle } from "react-native";
import { Renderer, useMarkdown } from "react-native-marked";
import { colors, type } from "../theme";
import { directoryLabel } from "../directoryLabels";

export type ChatSource = { title: string; publisher?: string; sourceUrl?: string };
type ResultCard = { id?: string; name: string; district?: string; region?: string; intake?: string; phone?: string; verified?: boolean };
type Part = { type: "text"; text: string } | { type: "service" | "paralegal"; card: ResultCard };

export function parseChatContent(content: string): Part[] {
  const parts: Part[] = [];
  let cursor = 0;
  for (const match of content.matchAll(/::(PARALEGAL_CARD|SERVICE_CARD):(\{.*?\})::/gs)) {
    const before = content.slice(cursor, match.index).trim();
    if (before) parts.push({ type: "text", text: before });
    try {
      const card = JSON.parse(match[2]);
      if (card && typeof card.name === "string" && (match[1] !== "SERVICE_CARD" || typeof card.id === "string")) {
        parts.push({ type: match[1] === "SERVICE_CARD" ? "service" : "paralegal", card });
      }
    } catch { /* Incomplete structured results are never shown as raw tokens. */ }
    cursor = (match.index ?? 0) + match[0].length;
  }
  // A streamed card can span several chunks; hide its unfinished payload.
  const tail = content.slice(cursor).replace(/::(?:PARALEGAL|SERVICE)(?:_CARD)?[\s\S]*$/, "").trim();
  if (tail) parts.push({ type: "text", text: tail });
  return parts;
}

export const ChatResponse = memo(function ChatResponse({ content, sources, sw, preview = false }: { content: string; sources?: ChatSource[]; sw: boolean; preview?: boolean }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [linkError, setLinkError] = useState(false);
  return <View style={styles.response}>
    {parseChatContent(content).map((part, index) => part.type === "text"
      ? <ChatMarkdown key={index} content={part.text} />
      : <Result key={index} card={part.card} service={part.type === "service"} sw={sw} preview={preview} />)}
    {sources?.length ? <View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: sourcesOpen }} onPress={() => setSourcesOpen(value => !value)} style={styles.sourcesToggle}>
        <Ionicons name="documents-outline" size={15} color={colors.teal} />
        <Text style={styles.sourceLabel}>{sources.length} {sw ? (sources.length === 1 ? "chanzo" : "vyanzo") : (sources.length === 1 ? "source" : "sources")}</Text>
        <Ionicons name={sourcesOpen ? "chevron-up" : "chevron-down"} size={13} color={colors.inkMuted} />
      </Pressable>
      {sourcesOpen ? sources.map((source, index) => <Pressable key={index} disabled={!/^https?:\/\//.test(source.sourceUrl || "")} style={styles.sourceRow} onPress={() => { setLinkError(false); void Linking.openURL(source.sourceUrl!).catch(() => setLinkError(true)); }}>
        <Text style={styles.sourceNumber}>{index + 1}</Text><View style={styles.flex}><Text style={styles.sourceTitle}>{source.title}</Text>{source.publisher ? <Text style={styles.meta}>{source.publisher}</Text> : null}</View>
        {/^https?:\/\//.test(source.sourceUrl || "") ? <Ionicons name="open-outline" size={15} color={colors.inkMuted} /> : null}
      </Pressable>) : null}
      {linkError ? <Text style={styles.meta}>{sw ? "Kiungo hakikufunguka. Jaribu tena." : "Could not open the source. Try again."}</Text> : null}
    </View> : null}
  </View>;
});

class ChatRenderer extends Renderer {
  image() { return null; }
  link(children: string | ReactNode[], href: string, style?: TextStyle) {
    return <Text key={this.getKey()} style={style} accessibilityRole="link" onPress={() => { if (/^https?:\/\//.test(href)) void Linking.openURL(href).catch(() => undefined); }}>{children}</Text>;
  }
}

function ChatMarkdown({ content }: { content: string }) {
  const renderer = useMemo(() => new ChatRenderer(), []);
  const elements = useMarkdown(content, { colorScheme: "light", renderer, styles: markdownStyles });
  return <View>{elements.map((element, index) => <Fragment key={index}>{element}</Fragment>)}</View>;
}

const markdownStyles = StyleSheet.create({
  text: { fontFamily: type.regular, fontSize: 16, lineHeight: 26, color: "#302F32" },
  strong: { fontFamily: type.medium, fontWeight: "500", color: "#302F32" },
  paragraph: { marginTop: 0, marginBottom: 12 },
  h1: { fontFamily: type.medium, fontWeight: "500", fontSize: 19, lineHeight: 27, marginTop: 12, marginBottom: 8 },
  h2: { fontFamily: type.medium, fontWeight: "500", fontSize: 18, lineHeight: 26, marginTop: 12, marginBottom: 8 },
  h3: { fontFamily: type.medium, fontWeight: "500", fontSize: 16, lineHeight: 25, marginTop: 10, marginBottom: 6 },
  li: { fontFamily: type.regular, fontSize: 16, lineHeight: 26, color: "#302F32" },
  list: { marginTop: 0, marginBottom: 12 },
  link: { fontFamily: type.regular, color: colors.teal },
});

function Result({ card, service, sw, preview }: { card: ResultCard; service: boolean; sw: boolean; preview: boolean }) {
  const location = [card.district, card.region].filter(Boolean).join(", ");
  return <Pressable disabled={preview} style={({ pressed }) => [styles.result, pressed && { opacity: 0.75 }]} accessibilityRole="button" onPress={() => service
    ? router.push({ pathname: "/service/[id]", params: { id: card.id! } })
    : router.push({ pathname: "/paralegal-profile", params: { name: card.name, district: card.district || "", region: card.region || "", phone: card.phone || "", verified: String(Boolean(card.verified)) } })}>
    <View style={styles.resultTop}><View style={[styles.resultIcon, !service && styles.personIcon]}><Ionicons name={service ? "business-outline" : "person-outline"} size={21} color={service ? colors.teal : colors.burgundy} /></View><View style={styles.flex}>
      <Text style={styles.kind}>{service ? (sw ? "Huduma ya kisheria" : "Legal service") : "Paralegal"}</Text>
      <Text style={styles.name}>{card.name}</Text>
    </View><Ionicons name="arrow-forward" size={18} color={colors.inkMuted} /></View>
    {location ? <View style={styles.detail}><Ionicons name="location-outline" size={14} color={colors.inkMuted} /><Text style={styles.meta}>{location}</Text></View> : null}
    {card.intake ? <Text style={styles.intake}>{directoryLabel(card.intake, sw)}</Text> : null}
    <View style={styles.resultFooter}><Text style={styles.resultLink}>{preview ? (sw ? "Mfano wa muonekano" : "Sample result") : (sw ? "Angalia taarifa" : "View details")}</Text>{!preview && (service || card.verified) ? <View style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.teal} /><Text style={styles.verifiedText}>{sw ? "Imethibitishwa" : "Verified"}</Text></View> : null}</View>
  </Pressable>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  response: { gap: 16 },
  answer: { fontFamily: type.regular, fontSize: 16, lineHeight: 26, color: "#302F32" },
  result: { borderWidth: 1, borderColor: "#E2E6E3", borderRadius: 8, padding: 16, backgroundColor: "#FFFFFF", gap: 10 },
  resultTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  resultIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#EAF3EF", alignItems: "center", justifyContent: "center" },
  personIcon: { backgroundColor: "#F6EDF0" },
  kind: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted, marginBottom: 3 },
  name: { fontFamily: type.medium, fontSize: 15, lineHeight: 21, color: colors.charcoal },
  detail: { flexDirection: "row", gap: 6, alignItems: "center" },
  meta: { flexShrink: 1, fontFamily: type.regular, fontSize: 12, lineHeight: 18, color: colors.inkMuted },
  intake: { fontFamily: type.regular, fontSize: 12, color: colors.teal },
  resultFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#EDF0ED", paddingTop: 10, gap: 10 },
  resultLink: { fontFamily: type.medium, fontSize: 12, color: colors.burgundy },
  verified: { flexDirection: "row", gap: 4, alignItems: "center" },
  verifiedText: { fontFamily: type.regular, fontSize: 10, color: colors.teal },
  sourcesToggle: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start" },
  sourceLabel: { fontFamily: type.regular, fontSize: 12, color: colors.teal },
  sourceRow: { flexDirection: "row", gap: 9, alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#ECEEEC" },
  sourceNumber: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted },
  sourceTitle: { fontFamily: type.regular, fontSize: 13, lineHeight: 19, color: colors.charcoal },
});
