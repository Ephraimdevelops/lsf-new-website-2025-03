import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../src/components/Button";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

const planSteps = {
  sw: [
    "Nenda mahali salama kama unaweza kufanya hivyo bila kuongeza hatari.",
    "Mwambie mtu unayemwamini kinachoendelea na mahali ulipo.",
    "Weka kitambulisho, nyaraka muhimu, dawa, na simu karibu.",
    "Andika au hifadhi ushahidi kwa usalama kama kufanya hivyo hakukuweki hatarini.",
    "Tumia ombi la Haki Yangu tu ukiwa salama na unaweza kusubiri majibu.",
  ],
  en: [
    "Move to a safer place if you can do so without increasing danger.",
    "Tell a trusted person what is happening and where you are.",
    "Keep identification, key documents, medicine, and phone access nearby.",
    "Record or preserve evidence safely only if doing so does not put you at risk.",
    "Use a Haki Yangu request only when you are safe and can wait for a response.",
  ],
};

export default function SafetyScreen() {
  useSensitiveScreenProtection("safety");
  const { locale, t } = useLanguage();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Usalama" : "Safety"}</Text>
        <QuickExit locale={locale} />
      </View>

      <View style={styles.emergencyCard}>
        <Ionicons name="warning-outline" size={44} color={colors.surface} />
        <Text style={styles.emergencyTitle}>{locale === "sw" ? "Kama uko kwenye hatari sasa" : "If you are in danger now"}</Text>
        <Text style={styles.emergencyText}>
          {locale === "sw"
            ? "Haki Yangu si huduma ya dharura. Tafuta huduma rasmi ya dharura iliyo karibu, polisi, kituo cha afya, au mtu unayemwamini mara moja."
            : "Haki Yangu is not an emergency service. Contact nearby official emergency services, police, a health facility, or a trusted person immediately."}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>{locale === "sw" ? "Mpango mfupi wa usalama" : "Quick safety plan"}</Text>
      <View style={styles.stepsCard}>
        {planSteps[locale].map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.privateCard}>
        <Ionicons name="eye-off-outline" size={26} color={colors.burgundy} />
        <View style={styles.privateCopy}>
          <Text style={styles.privateTitle}>{locale === "sw" ? "Linda faragha yako" : "Protect your privacy"}</Text>
          <Text style={styles.privateText}>
            {locale === "sw"
              ? "Ikiwa mtu mwingine anaweza kuona simu yako, tumia kifaa salama, futa historia ya kivinjari kama ni lazima, na epuka kuandika taarifa zinazoweza kuongeza hatari."
              : "If someone else can see your phone, use a safer device, clear browser history if needed, and avoid writing details that could increase risk."}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label={t("startRequest")} onPress={() => router.push("/intake")} />
        <Button label={locale === "sw" ? "Soma haki zako" : "Read your rights"} variant="secondary" onPress={() => router.push("/(tabs)/learn")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  emergencyCard: { marginTop: spacing.xl, backgroundColor: colors.burgundy, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  emergencyTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 27, lineHeight: 33 },
  emergencyText: { fontFamily: type.regular, color: "#FBE7EF", fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, marginTop: spacing.xl, marginBottom: spacing.md },
  stepsCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  stepRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  stepNumberText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  stepText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  privateCard: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, backgroundColor: colors.peach, borderRadius: radius.md, padding: spacing.lg },
  privateCopy: { flex: 1 },
  privateTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  privateText: { marginTop: spacing.xs, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  actions: { marginTop: spacing.xl, gap: spacing.md, marginBottom: spacing.xl },
});
