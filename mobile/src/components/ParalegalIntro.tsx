import { StyleSheet, Text, View } from "react-native";
import { CivicIllustration, type CivicPose } from "./CivicIllustration";
import { colors, type, typography } from "../theme";

/** The beneficiary journey's compact, soft clay illustration treatment. */
export function ParalegalIntro({ title, body, pose = "welcome" }: { title: string; body: string; pose?: CivicPose }) {
  return <View style={styles.intro}><View style={styles.copy}><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text></View><CivicIllustration pose={pose} size={88} /></View>;
}
const styles = StyleSheet.create({ intro: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 }, copy: { flex: 1, gap: 8 }, title: { ...typography.pageTitle }, body: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.inkMuted } });
