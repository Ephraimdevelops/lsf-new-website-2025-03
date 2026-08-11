import { Image, StyleSheet, Text, View } from "react-native";
import { colors, spacing, type } from "../theme";

const logoWhite = require("../../assets/lsf-logo-white.png");
const logoBurgundy = require("../../assets/lsf-logo-burgundy.png");

export function BrandMark({ light = false, markOnly = false, size = "default" }: { light?: boolean; markOnly?: boolean; size?: "default" | "small" | "large" }) {
  if (markOnly) {
    return (
      <Image
        source={light ? logoWhite : logoBurgundy}
        resizeMode="contain"
        style={[styles.imageMark, size === "small" && styles.imageMarkSmall, size === "large" && styles.imageMarkLarge]}
        accessibilityLabel="Legal Services Facility"
      />
    );
  }

  return (
    <View style={styles.row} accessibilityLabel="Legal Services Facility">
      <Text style={[styles.lsf, light && styles.light]}>LSF</Text>
      <View style={styles.bar} />
      <Text style={[styles.name, light && styles.light]}>LEGAL{`\n`}SERVICES{`\n`}FACILITY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  imageMark: { width: 82, height: 36 },
  imageMarkSmall: { width: 52, height: 26 },
  imageMarkLarge: { width: 132, height: 74 },
  lsf: { color: colors.charcoal, fontFamily: type.bold, fontSize: 28, letterSpacing: -1.5 },
  bar: { width: 2, height: 31, backgroundColor: colors.orange },
  name: { color: colors.charcoal, fontFamily: type.bold, fontSize: 7.5, lineHeight: 9 },
  light: { color: colors.surface },
});
