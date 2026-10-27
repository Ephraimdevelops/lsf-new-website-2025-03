import { Image } from "expo-image";
import { View } from "react-native";

export type CivicObjectKind = "beneficiary" | "paralegal" | "organisation" | "stakeholder" | "empty" | "question";
const kinds: CivicObjectKind[] = ["beneficiary", "paralegal", "organisation", "stakeholder", "empty", "question"];

export function CivicObject({ kind, size = 80 }: { kind: CivicObjectKind; size?: number }) {
  const index = kinds.indexOf(kind);
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={{ width: size, height: size, overflow: "hidden", flexShrink: 0 }}>
    <Image accessible={false} source={require("../../assets/civic-objects.webp")} contentFit="fill" style={{ width: size * 3, height: size * 2, position: "absolute", left: -(index % 3) * size, top: -Math.floor(index / 3) * size }} />
  </View>;
}
