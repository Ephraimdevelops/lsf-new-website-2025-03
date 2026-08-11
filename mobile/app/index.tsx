import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { colors, spacing, type } from "../src/theme";

const logoWhite = require("../assets/lsf-logo-white.png");

export default function Index() {
  const [destination, setDestination] = useState<"/onboarding" | "/(tabs)" | null>(null);
  useEffect(() => {
    AsyncStorage.getItem("haki-yangu:onboarded")
      .then((value) => setDestination(value === "yes" ? "/(tabs)" : "/onboarding"));
  }, []);
  if (!destination) return <LoadingScreen />;
  return <Redirect href={destination} />;
}

function LoadingScreen() {
  return (
    <ImageBackground source={logoWhite} resizeMode="cover" imageStyle={styles.watermark} style={styles.loading}>
      <View style={styles.skyBand} />
      <View style={styles.sun} />
      <View style={styles.hillBack} />
      <View style={styles.hillFront} />
      <View style={styles.treeLeft}><View style={styles.treeTop} /><View style={styles.treeTrunk} /></View>
      <View style={styles.treeRight}><View style={styles.treeTopSmall} /><View style={styles.treeTrunk} /></View>
      <View style={styles.villageLine}>
        <View style={styles.house}><View style={styles.roof} /><View style={styles.houseBody} /></View>
        <View style={styles.fieldRows}><View style={styles.fieldLine} /><View style={styles.fieldLineShort} /><View style={styles.fieldLine} /></View>
      </View>
      <View style={styles.beneficiary}>
        <View style={styles.head} />
        <View style={styles.wrap} />
        <View style={styles.bodyShape} />
      </View>
      <View style={styles.logoBadge}><BrandMark light markOnly /></View>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Legal Services Facility</Text>
        <Text style={styles.title}>Rights within reach.</Text>
        <Text style={styles.body}>Support for GBV rights, land justice, social justice, and climate resilience.</Text>
      </View>
      <View style={styles.tags}>
        <View style={styles.tag}><Ionicons name="shield-checkmark-outline" size={15} color={colors.surface} /><Text style={styles.tagText}>GBV rights</Text></View>
        <View style={styles.tag}><Ionicons name="leaf-outline" size={15} color={colors.surface} /><Text style={styles.tagText}>Climate justice</Text></View>
        <View style={styles.tag}><Ionicons name="map-outline" size={15} color={colors.surface} /><Text style={styles.tagText}>Land rights</Text></View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: "#5F0E28", padding: spacing.xxl, justifyContent: "flex-end", overflow: "hidden" },
  watermark: { opacity: 0.05, transform: [{ scale: 1.3 }, { translateX: 70 }, { translateY: -80 }] },
  skyBand: { position: "absolute", top: 0, left: 0, right: 0, height: "62%", backgroundColor: "#7D193C" },
  sun: { position: "absolute", top: 112, right: 44, width: 94, height: 94, borderRadius: 47, backgroundColor: colors.orange, opacity: 0.92 },
  hillBack: { position: "absolute", left: -70, right: -40, bottom: 270, height: 220, borderTopLeftRadius: 180, borderTopRightRadius: 220, backgroundColor: "#2E6F55", opacity: 0.9 },
  hillFront: { position: "absolute", left: -80, right: -80, bottom: 190, height: 230, borderTopLeftRadius: 200, borderTopRightRadius: 200, backgroundColor: "#214B3C" },
  treeLeft: { position: "absolute", left: 28, bottom: 350, alignItems: "center" },
  treeRight: { position: "absolute", right: 42, bottom: 318, alignItems: "center" },
  treeTop: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#79A96B" },
  treeTopSmall: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#8CBF79" },
  treeTrunk: { width: 8, height: 48, backgroundColor: "#6B402A" },
  villageLine: { position: "absolute", left: 34, right: 34, bottom: 278, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  house: { width: 82, height: 70, alignItems: "center" },
  roof: { width: 76, height: 34, backgroundColor: "#F2C57C", transform: [{ rotate: "45deg" }], marginBottom: -14 },
  houseBody: { width: 72, height: 42, borderRadius: 6, backgroundColor: "#F7EFE6" },
  fieldRows: { width: 138, gap: 11, paddingBottom: 10 },
  fieldLine: { height: 3, borderRadius: 2, backgroundColor: "#CDE0B8", opacity: 0.95 },
  fieldLineShort: { width: 92, height: 3, borderRadius: 2, backgroundColor: "#CDE0B8", opacity: 0.8 },
  beneficiary: { position: "absolute", left: 86, bottom: 318, width: 132, height: 190, alignItems: "center" },
  head: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#7A4B36", borderWidth: 3, borderColor: "#EFC8B1" },
  wrap: { marginTop: -6, width: 102, height: 72, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#D94A1E" },
  bodyShape: { marginTop: -18, width: 120, height: 92, borderRadius: 28, backgroundColor: "#F4D8C8" },
  logoBadge: { position: "absolute", top: 58, left: spacing.xxl, width: 104, height: 58, borderRadius: 18, backgroundColor: "rgba(138,21,56,0.34)", alignItems: "center", justifyContent: "center" },
  copy: { gap: spacing.md, marginBottom: spacing.xl },
  eyebrow: { fontFamily: type.bold, color: colors.peach, fontSize: 12, letterSpacing: 0, textTransform: "uppercase" },
  title: { fontFamily: type.bold, color: colors.surface, fontSize: 42, lineHeight: 44 },
  body: { maxWidth: 320, fontFamily: type.regular, color: colors.surface, fontSize: 15, lineHeight: 23 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  tag: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  tagText: { fontFamily: type.bold, color: colors.surface, fontSize: 11 },
});
