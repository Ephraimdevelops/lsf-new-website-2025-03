import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function SignInScreen() {
  const { locale } = useLanguage();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.charcoal} />
        </Pressable>
        <BrandMark />
      </View>
      <View style={styles.panel}>
        <View style={styles.icon}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.burgundy} />
        </View>
        <Text style={styles.title}>{locale === "sw" ? "Akaunti salama" : "Secure account"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Kwa uwasilishaji wa leo, unaweza kuangalia skrini zote bila kuingia. Kuingia kutaunganishwa tena baada ya kuwezesha Clerk Native Applications."
            : "For today, you can review all presentation screens without signing in. Live sign-in will be re-enabled after Clerk Native Applications is enabled."}
        </Text>
        <View style={styles.note}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={styles.noteText}>{locale === "sw" ? "Kesi binafsi, ujumbe, nyaraka na arifa zitabaki nyuma ya akaunti." : "Private cases, messages, documents and notifications remain protected behind an account."}</Text>
        </View>
        <Button label={locale === "sw" ? "Endelea kwenye demo" : "Continue demo"} onPress={() => router.replace("/(tabs)")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  panel: { marginTop: 84, borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, gap: spacing.lg, alignItems: "center" },
  icon: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 28, textAlign: "center" },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22, textAlign: "center" },
  note: { flexDirection: "row", gap: spacing.sm, borderRadius: radius.md, backgroundColor: "#E7F4ED", padding: spacing.md, alignItems: "flex-start" },
  noteText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
});
