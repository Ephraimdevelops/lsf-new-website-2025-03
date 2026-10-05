import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AuthVisual } from "../src/components/AuthVisual";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useUser } from "../src/auth";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useAccountSync } from "../src/useStoreUserEffect";

export default function AuthCompleteScreen() {
  const { locale } = useLanguage();
  const { user, isLoaded } = useUser();
  const { ready, status, retry } = useAccountSync();
  const sw = locale === "sw";
  if (!isLoaded) return <Screen><Text style={styles.body}>{sw ? "Akaunti inaandaliwa…" : "Preparing your account…"}</Text></Screen>;
  if (!user) return <Redirect href="/sign-in" />;
  if (!ready) return <Screen><Text style={styles.body}>{status === "error" ? (sw ? "Akaunti haijaunganishwa. Jaribu tena." : "Your account could not connect. Please retry.") : (sw ? "Tunaunganisha akaunti yako…" : "Connecting your account…")}</Text>{status === "error" ? <Button label={sw ? "Jaribu tena" : "Retry"} onPress={retry} /> : null}</Screen>;
  return <Screen style={styles.screen}>
    <View style={styles.header}><View /><BrandMark size="large" /></View>
    <AuthVisual variant="success" />
    <Text style={styles.title}>{sw ? "Umefanikiwa!" : "You're all set!"}</Text>
    <Text style={styles.lead}>{sw ? "Akaunti yako iko tayari kutumika." : "Your account is ready to use."}</Text>
    <Text style={styles.body}>{sw ? "Sasa unaweza kutafuta msaada, kuuliza Saada na kufuatilia maombi yako." : "Find help, ask Saada, and follow your requests in one place."}</Text>
    <View style={styles.actions}>
      <Action icon="search-outline" tone="burgundy" title={sw ? "Anza kutafuta msaada" : "Find help"} body={sw ? "Tafuta huduma zilizothibitishwa karibu nawe." : "Explore verified services near you."} onPress={() => router.replace("/find-services")} />
      <Action icon="chatbubble-ellipses-outline" tone="teal" title={sw ? "Uliza Saada" : "Ask Saada"} body={sw ? "Pata mwongozo wa hatua inayofuata." : "Get guidance for your next step."} onPress={() => router.replace("/sara")} />
      <Action icon="person-outline" tone="gold" title={sw ? "Angalia wasifu wako" : "View your profile"} body={sw ? "Taarifa za akaunti yako ziko hapa." : "Your account details are here."} onPress={() => router.replace("/(tabs)/profile")} />
    </View>
    <Button label={sw ? "Ingia kwenye app" : "Continue to the app"} onPress={() => router.replace("/(tabs)")} style={styles.primary} />
  </Screen>;
}

function Action({ icon, tone, title, body, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; tone: "burgundy" | "teal" | "gold"; title: string; body: string; onPress: () => void }) {
  const tint = tone === "teal" ? colors.tealSoft : tone === "gold" ? colors.goldSoft : colors.burgundySoft;
  const foreground = tone === "teal" ? colors.teal : tone === "gold" ? colors.warning : colors.burgundy;
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
    <View style={[styles.actionIcon, { backgroundColor: tint }]}><Ionicons name={icon} size={26} color={foreground} /></View>
    <View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionBody}>{body}</Text></View>
    <Ionicons name="chevron-forward" size={23} color={foreground} />
  </Pressable>;
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.xxl },
  header: { flexDirection: "row", justifyContent: "space-between", paddingTop: spacing.sm, marginBottom: spacing.xl },
  title: { color: colors.burgundy, fontFamily: type.bold, fontSize: 38, lineHeight: 44, textAlign: "center", marginTop: spacing.xl },
  lead: { color: colors.ink, fontFamily: type.bold, fontSize: 20, lineHeight: 28, textAlign: "center", marginTop: spacing.sm },
  body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: spacing.md },
  actions: { gap: spacing.md, marginTop: spacing.xxl, marginBottom: spacing.xl },
  action: { minHeight: 92, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radius.lg },
  actionIcon: { width: 60, height: 60, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  actionCopy: { flex: 1, gap: 4 },
  actionTitle: { color: colors.ink, fontFamily: type.bold, fontSize: 17 },
  actionBody: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20 },
  primary: { minHeight: 58, borderRadius: radius.pill },
  pressed: { opacity: 0.78 },
});
