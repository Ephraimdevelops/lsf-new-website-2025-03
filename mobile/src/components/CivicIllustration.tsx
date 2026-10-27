import { View } from "react-native";
import { Image } from "expo-image";
import { useId } from "react";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export type CivicPose = "welcome" | "voice" | "location" | "direction" | "documents" | "safety" | "contact" | "review";
const poses: CivicPose[] = ["welcome", "voice", "location", "direction", "documents", "safety", "contact", "review"];

/** Equal-sized sprite tiles keep the branded companion aligned across screens. */
export function CivicIllustration({ pose, size = 96 }: { pose: CivicPose; size?: number }) {
  const tile = poses.indexOf(pose);
  const id = useId().replace(/:/g, "");
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={{ width: size, height: size, overflow: "hidden", flexShrink: 0 }}>
    <Svg width={size} height={size} style={{ position: "absolute" }}>
      <Defs><LinearGradient id={`back-${id}`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#F8EEF2" /><Stop offset="1" stopColor="#E3F1EF" /></LinearGradient></Defs>
      <Rect x={size * 0.08} y={size * 0.12} width={size * 0.84} height={size * 0.88} rx={size * 0.18} fill={`url(#back-${id})`} />
    </Svg>
    <Image accessible={false} source={require("../../assets/civic-steps.webp")} contentFit="fill" style={{ position: "absolute", width: size * 4, height: size * 2, left: -(tile % 4) * size, top: -Math.floor(tile / 4) * size }} />
    <Svg width={size} height={size} style={{ position: "absolute" }}>
      <Defs><LinearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0.73" stopColor="#FFFFFF" stopOpacity="0" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" /></LinearGradient></Defs>
      <Rect width={size} height={size} fill={`url(#fade-${id})`} />
    </Svg>
  </View>;
}
