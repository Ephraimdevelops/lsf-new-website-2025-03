import { Image, StyleSheet } from "react-native";

const logoWhite = require("../../assets/lsf-logo-white.png");
const logoBurgundy = require("../../assets/lsf-official.png");

export function BrandMark({ light = false, size = "default" }: { light?: boolean; markOnly?: boolean; size?: "default" | "small" | "large" }) {
  return (
    <Image
      source={light ? logoWhite : logoBurgundy}
      resizeMode="contain"
      style={[styles.imageMark, size === "small" && styles.imageMarkSmall, size === "large" && styles.imageMarkLarge]}
      accessibilityLabel="Legal Services Facility"
    />
  );
}

const styles = StyleSheet.create({
  imageMark: { width: 96, height: 42 },
  imageMarkSmall: { width: 68, height: 30 },
  imageMarkLarge: { width: 150, height: 82 },
});
