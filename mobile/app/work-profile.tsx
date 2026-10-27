import { BrandLoading } from '../src/components/BrandLoading';
import { useWorkMode } from "../src/work/WorkMode";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { PersonalIntro } from "../src/components/PersonalIntro";
import { LogOutButton } from "../src/components/LogOutButton";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import { Screen } from "../src/components/Screen";
import { Button } from "../src/components/Button";
import { useLanguage } from "../src/i18n";
import { colors, type } from "../src/theme";
export default function WorkProfile() {
  const { isSignedIn } = useAuth(); const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some(role => ["paralegal", "provider_staff"].includes(role));
  const application = useQuery(api.paralegals.getMyApplication, allowed ? {} : "skip");
  return <Screen footer={allowed ? <ParalegalNavigation current="profile" /> : undefined}>
    <CivicPageHeader compact back title={sw ? "Wasifu wa kazi" : "Your work profile"} />
    <PersonalIntro profile body={sw ? "Taarifa zako, maandalizi na msaada wa LSF." : "Your details, work setup and support from LSF."} />
    <LogOutButton />
    {!isSignedIn ? <Button label={sw ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} /> : access === undefined ? <BrandLoading compact text={sw ? "Tunapakia wasifu…" : "Loading your profile…"}/> : !access || !allowed ? <><Text style={styles.body}>{sw ? "Idhini ya kazi inahitajika." : "Work access requires approval."}</Text><Button label={sw ? "Angalia kujiunga" : "See how to join"} onPress={() => router.push("/join")} /></> : <>
      <View style={styles.identity}><View style={styles.flex}><Text style={styles.body}>{access.roles.includes("paralegal") ? (sw ? "Msaidizi wa kisheria" : "Paralegal") : (sw ? "Mtoa huduma" : "Provider staff")}</Text>{application ? <Text style={styles.body}>{[application.district, application.region].filter(Boolean).join(", ")}</Text> : null}</View></View>
      {access.roles.includes("paralegal") ? <><LinkRow title={sw ? "Maandalizi na wasifu wangu" : "My setup and work details"} icon="person-circle-outline" route="/paralegal-onboarding" /><LinkRow title={sw ? "Muda na upatikanaji" : "Hours and availability"} icon="time-outline" route="/paralegal-availability" /></> : null}
      <LinkRow title={sw ? "Taasisi na huduma zangu" : "My organisation and services"} icon="business-outline" route="/my-organisation" />
      <LinkRow title={sw ? "Maendeleo yangu" : "My progress"} icon="trending-up-outline" route="/paralegal-performance" />
      <LinkRow title={sw ? "Msaada wa LSF" : "Ask LSF for help"} icon="people-outline" route="/paralegal-support" />
      <LinkRow title={sw ? "Ustawi wangu" : "My wellbeing"} icon="heart-outline" route="/paralegal-wellbeing" />
      <Text style={styles.heading}>{sw ? "Akaunti yako" : "Your account"}</Text>
      <LinkRow title={sw ? "Huduma binafsi za msaada" : "Get help for myself"} icon="heart-circle-outline" route="/?context=personal" />
      <LinkRow title={sw ? "Wasifu binafsi na mipangilio" : "Personal profile and settings"} icon="settings-outline" route="/(tabs)/profile" />
      <Text style={styles.body}>{sw ? "Mabadiliko ya utambulisho na uthibitishaji hupitiwa na LSF." : "Identity and verification changes are reviewed by LSF."}</Text>
    </>}
  </Screen>;
}
function LinkRow({ title, icon, route }: { title: string; icon: keyof typeof Ionicons.glyphMap; route: string }) { const { setMode } = useWorkMode(); return <Pressable accessibilityRole="button" style={styles.row} onPress={() => { if (route === "/?context=personal" || route === "/(tabs)/profile") setMode("personal"); router.push((route === "/?context=personal" ? "/(tabs)" : route) as Href); }}><Ionicons name={icon} size={23} color={colors.burgundy} /><Text style={styles.label}>{title}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, identity: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, borderRadius: 18, backgroundColor: colors.burgundySoft, marginBottom: 20 }, name: { fontFamily: type.semibold, fontSize: 21, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted, marginTop: 4 }, heading: { fontFamily: type.semibold, fontSize: 20, color: colors.ink, marginTop: 24 }, row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line }, label: { flex: 1, fontFamily: type.medium, fontSize: 16, lineHeight: 23, color: colors.ink } });
