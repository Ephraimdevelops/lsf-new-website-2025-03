import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function OnboardingScreen() {
  const { locale, setLocale } = useLanguage();

  async function continueToApp() {
    await AsyncStorage.setItem("haki-yangu:onboarded", "yes");
    router.replace("/(tabs)");
  }

  return (
    <Screen style={styles.screen}>
      <BrandMark />
      <View style={styles.hero}>
        <View style={styles.illustration}>
          <Ionicons name="people-outline" size={90} color={colors.burgundy} />
        </View>
        <Text style={styles.title}>{locale === "sw" ? "Haki ni ya kila mtu." : "Justice is for everyone."}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Haki Yangu hukusaidia kuelewa haki zako, kupata msaada unaofaa na kufuatilia hatua zinazofuata."
            : "Haki Yangu helps you understand your rights, reach the right support and follow what happens next."}
        </Text>
      </View>
      <View style={styles.languageRow}>
        <Button label="Kiswahili" variant={locale === "sw" ? "primary" : "secondary"} onPress={() => void setLocale("sw")} style={styles.languageButton} />
        <Button label="English" variant={locale === "en" ? "primary" : "secondary"} onPress={() => void setLocale("en")} style={styles.languageButton} />
      </View>
      <Button label={locale === "sw" ? "Anza" : "Get started"} onPress={() => void continueToApp()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.lg, justifyContent: "space-between" },
  hero: { gap: spacing.lg },
  illustration: { height: 210, borderRadius: radius.lg, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 34, lineHeight: 38, letterSpacing: -0.8 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 24 },
  languageRow: { flexDirection: "row", gap: spacing.md, marginVertical: spacing.xl },
  languageButton: { flex: 1 },
});
