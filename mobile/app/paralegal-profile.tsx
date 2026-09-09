import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import type React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalProfileScreen() {
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ name?: string; district?: string; region?: string; phone?: string; specialties?: string }>();
  const name = params.name || "Rehema Mwanga";
  const district = params.district || "Kinondoni";
  const region = params.region || "Dar es Salaam";
  const specialties = (params.specialties || "Employment,Land,Family").split(",").filter(Boolean);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.circleButton}>
          <Ionicons name="chevron-back" size={22} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Wasifu wa paralegal" : "Paralegal Profile"}</Text>
        <Pressable accessibilityRole="button" style={styles.circleButton}>
          <Ionicons name="share-outline" size={20} color={colors.burgundy} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</Text>
        </View>
        <View style={styles.heroCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <Ionicons name="checkmark-circle" size={19} color={colors.surface} />
          </View>
          <Text style={styles.verified}>{locale === "sw" ? "Paralegal aliyethibitishwa" : "Verified Paralegal"}</Text>
          <Text style={styles.rating}>4.9 ★ (128 {locale === "sw" ? "maoni" : "reviews"})</Text>
          <Text style={styles.location}>{district}, {region}</Text>
        </View>
      </View>

      <View style={styles.responsePill}>
        <Ionicons name="time-outline" size={16} color={colors.burgundy} />
        <Text style={styles.responseText}>{locale === "sw" ? "Hujibu ndani ya saa chache" : "Responds within a few hours"}</Text>
      </View>

      <View style={styles.section}>
        <InfoRow icon="briefcase-outline" label={locale === "sw" ? "Utaalamu" : "Specialties"}>
          <View style={styles.chips}>
            {specialties.map((tag) => <Text key={tag} style={styles.chip}>{tag}</Text>)}
          </View>
        </InfoRow>
        <InfoRow icon="location-outline" label={locale === "sw" ? "Maeneo anayohudumia" : "Districts Served"} value="Kinondoni, Ilala, Temeke" />
        <InfoRow icon="chatbubble-outline" label={locale === "sw" ? "Lugha" : "Languages"} value="Swahili, English" />
        <InfoRow icon="calendar-outline" label={locale === "sw" ? "Upatikanaji" : "Availability"} value="Mon - Sat, 8:00 AM - 6:00 PM" />
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>{locale === "sw" ? `Kuhusu ${name.split(" ")[0]}` : `About ${name.split(" ")[0]}`}</Text>
        <Text style={styles.aboutText}>
          {locale === "sw"
            ? "Husaidia watu kuelewa hatua salama, kupanga nyaraka, na kuunganishwa na huduma sahihi bila kuvunja faragha."
            : "Helps people understand safe next steps, organize documents, and connect to the right support while protecting privacy."}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.secondaryAction} onPress={() => router.push("/sara")}>
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
                providerDistrict: `${district}, ${region}`,
                providerPhone: params.phone ?? "",
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
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 16 },
  hero: { marginTop: spacing.xl, minHeight: 150, borderRadius: radius.lg, backgroundColor: colors.burgundy, padding: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.lg, overflow: "hidden" },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#F3D7DE", borderWidth: 4, borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 26 },
  heroCopy: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  name: { flex: 1, fontFamily: type.bold, color: colors.surface, fontSize: 22, letterSpacing: -0.5 },
  verified: { fontFamily: type.medium, color: "rgba(255,255,255,0.86)", fontSize: 13 },
  rating: { fontFamily: type.bold, color: "#FFD27A", fontSize: 13 },
  location: { fontFamily: type.regular, color: "rgba(255,255,255,0.86)", fontSize: 13 },
  responsePill: { alignSelf: "flex-start", marginTop: spacing.md, borderRadius: radius.pill, backgroundColor: "#FFF7FA", borderWidth: 1, borderColor: "#E8B8CC", flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  responseText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  section: { marginTop: spacing.xl, gap: spacing.lg },
  infoRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  infoCopy: { flex: 1, gap: spacing.xs },
  infoLabel: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  infoValue: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.softPink, color: colors.burgundy, fontFamily: type.bold, fontSize: 11, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  aboutCard: { marginTop: spacing.xl, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.sm },
  aboutTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  aboutText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xl },
  secondaryAction: { flex: 1, minHeight: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, backgroundColor: colors.surface },
  secondaryText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  primaryAction: { flex: 1.3, minHeight: 52, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs },
  primaryText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
});
