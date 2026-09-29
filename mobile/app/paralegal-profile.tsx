import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import type React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalProfileScreen() {
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ name?: string; district?: string; region?: string; phone?: string; specialties?: string; languages?: string; bio?: string; availability?: string; verified?: string }>();
  const name = params.name || (locale === "sw" ? "Paralegal wa LSF" : "LSF paralegal");
  const district = params.district || "";
  const region = params.region || "";
  const location = [district, region].filter(Boolean).join(", ");
  const specialties = (params.specialties || "").split(",").filter(Boolean);
  const languages = (params.languages || "").split(",").filter(Boolean);
  const phone = params.phone || "";
  const isVerified = params.verified === "true";
  const availability = availabilityLabel(params.availability, locale);

  async function call() {
    if (phone) await Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  }

  async function message() {
    if (phone) await Linking.openURL(`sms:${phone.replace(/\s+/g, "")}`);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.circleButton}>
          <Ionicons name="chevron-back" size={22} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Wasifu wa paralegal" : "Paralegal Profile"}</Text>
        <View style={styles.circleButtonSpacer} />
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</Text>
        </View>
        <View style={styles.heroCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isVerified ? <Ionicons name="checkmark-circle" size={19} color={colors.surface} /> : null}
          </View>
          <Text style={styles.verified}>{isVerified ? (locale === "sw" ? "Paralegal aliyethibitishwa na LSF" : "LSF verified paralegal") : (locale === "sw" ? "Wasifu wa mtandao wa LSF" : "LSF network profile")}</Text>
          <Text style={styles.location}>{location || (locale === "sw" ? "Eneo halijaonyeshwa" : "Location not listed")}</Text>
        </View>
      </View>

      <View style={styles.responsePill}>
        <Ionicons name="pulse-outline" size={16} color={colors.burgundy} />
        <Text style={styles.responseText}>{availability}</Text>
      </View>

      <View style={styles.section}>
        <InfoRow icon="briefcase-outline" label={locale === "sw" ? "Utaalamu" : "Specialties"}>
          <View style={styles.chips}>
            {(specialties.length ? specialties : [locale === "sw" ? "Msaada wa kisheria" : "Legal support"]).map((tag) => <Text key={tag} style={styles.chip}>{tag}</Text>)}
          </View>
        </InfoRow>
        <InfoRow icon="location-outline" label={locale === "sw" ? "Eneo" : "Location"} value={location || (locale === "sw" ? "Halijaonyeshwa" : "Not listed")} />
        <InfoRow icon="chatbubble-outline" label={locale === "sw" ? "Lugha" : "Languages"} value={languages.length ? languages.join(", ") : (locale === "sw" ? "Haijaonyeshwa" : "Not listed")} />
        <InfoRow icon="calendar-outline" label={locale === "sw" ? "Upatikanaji" : "Availability"} value={availability} />
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>{locale === "sw" ? `Kuhusu ${name.split(" ")[0]}` : `About ${name.split(" ")[0]}`}</Text>
        <Text style={styles.aboutText}>
          {params.bio || (locale === "sw"
            ? "Wasifu huu unatokana na taarifa za umma zilizothibitishwa kwenye mtandao wa LSF. Tuma ombi ikiwa unahitaji LSF ikupangie msaada salama."
            : "This profile is based on verified public LSF network details. Start a request if you need LSF to match safe support.")}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryAction} disabled={!phone} onPress={() => void call()}>
          <Ionicons name="call-outline" size={18} color={colors.burgundy} />
          <Text style={styles.secondaryText}>{locale === "sw" ? "Piga simu" : "Call"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} disabled={!phone} onPress={() => void message()}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.burgundy} />
          <Text style={styles.secondaryText}>{locale === "sw" ? "Ujumbe" : "Message"}</Text>
        </Pressable>
        <Pressable
          style={styles.primaryAction}
          onPress={() =>
            router.push({
              pathname: "/appointments",
              params: {
                providerName: name,
                providerDistrict: location,
                providerPhone: phone,
              },
            })
          }
        >
          <Ionicons name="calendar-outline" size={18} color={colors.surface} />
          <Text style={styles.primaryText}>{locale === "sw" ? "Weka miadi" : "Book support"}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function availabilityLabel(status: string | undefined, locale: "sw" | "en") {
  const labels = {
    sw: {
      accepting_cases: "Anapokea maombi mapya",
      limited: "Upatikanaji mdogo",
      paused: "Amesitisha kupokea maombi mapya",
      unavailable: "Hayupo kwa sasa",
    },
    en: {
      accepting_cases: "Accepting new requests",
      limited: "Limited availability",
      paused: "Paused for new requests",
      unavailable: "Unavailable now",
    },
  };
  return labels[locale][(status ?? "accepting_cases") as keyof typeof labels.en] ?? labels[locale].accepting_cases;
}

function InfoRow({ icon, label, value, children }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; children?: React.ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={19} color={colors.burgundy} />
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        {children || <Text style={styles.infoValue}>{value}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md },
  circleButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  circleButtonSpacer: { width: 38, height: 38 },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 16 },
  hero: { marginTop: spacing.xl, minHeight: 150, borderRadius: radius.lg, backgroundColor: colors.burgundy, padding: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.lg, overflow: "hidden" },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#F3D7DE", borderWidth: 4, borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 26 },
  heroCopy: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  name: { flex: 1, fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 22, letterSpacing: -0.5 },
  verified: { fontFamily: type.medium, fontWeight: "500", color: "rgba(255,255,255,0.86)", fontSize: 13 },
  location: { fontFamily: type.regular, color: "rgba(255,255,255,0.86)", fontSize: 13 },
  responsePill: { alignSelf: "flex-start", marginTop: spacing.md, borderRadius: radius.pill, backgroundColor: "#FFF7FA", borderWidth: 1, borderColor: "#E8B8CC", flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  responseText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  section: { marginTop: spacing.xl, gap: spacing.lg },
  infoRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  infoCopy: { flex: 1, gap: spacing.xs },
  infoLabel: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  infoValue: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.softPink, color: colors.burgundy, fontFamily: type.bold, fontWeight: "700", fontSize: 13, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  aboutCard: { marginTop: spacing.xl, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.sm },
  aboutTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 },
  aboutText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xl },
  secondaryAction: { flex: 1, minHeight: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, backgroundColor: colors.surface },
  secondaryText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  primaryAction: { flex: 1.3, minHeight: 52, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs },
  primaryText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 13 },
});
