import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CivicIllustration, type CivicPose } from "../components/CivicIllustration";
import { CivicPageIntro } from "../components/CivicPageIntro";
import { colors, type, typography } from "../theme";

type AdminIntroProps = Omit<ComponentProps<typeof CivicPageIntro>, "eyebrow"> & { eyebrow?: string };

export function AdminIntro({ title, description, icon }: AdminIntroProps) {
  const pose: CivicPose = /shield|lock/.test(icon) ? "safety" : /people|person|ribbon/.test(icon) ? "review" : /location|business/.test(icon) ? "location" : /call|heart/.test(icon) ? "contact" : /book|school|library|document/.test(icon) ? "documents" : "direction";
  return <View style={styles.intro}><View style={styles.copy}><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={styles.body}>{description}</Text></View><CivicIllustration pose={pose} size={88} /></View>;
}
const styles = StyleSheet.create({ intro: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 8 }, copy: { flex: 1, gap: 8 }, title: { ...typography.pageTitle }, body: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.inkMuted } });
