import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const statusLabels: Record<string, { sw: string; en: string }> = {
  verified: { sw: "Imethibitishwa", en: "Verified" },
  draft: { sw: "Rasimu", en: "Draft" },
  suspended: { sw: "Imesimamishwa", en: "Suspended" },
  inactive: { sw: "Haifanyi kazi", en: "Inactive" },
  active: { sw: "Inafanya kazi", en: "Active" },
  limited: { sw: "Ina nafasi chache", en: "Limited" },
  closed: { sw: "Imefungwa", en: "Closed" },
  emergency_only: { sw: "Dharura pekee", en: "Emergency only" },
};

export default function MyOrganisationScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const approved = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const record = useQuery(api.justiceServices.myOrganization, approved ? {} : "skip");
  if (!isSignedIn) return <Screen><AppHeader back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} eyebrow="Haki Yangu · Provider" /><View style={styles.hero}><View style={styles.icon}><Ionicons name="business-outline" size={28} color={colors.surface} /></View><Text style={styles.heroTitle}>{locale === "sw" ? "Huduma na watu, mahali pamoja." : "Services and people in one place."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Taasisi iliyoidhinishwa huona hali ya uthibitishaji, huduma zilizounganishwa na taarifa za ulinzi hapa." : "An approved organisation sees verification, linked services and safeguarding status here."}</Text></View><Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Taarifa za ndani zinalindwa" : "Internal details are protected"}</Text><Text style={styles.body}>{locale === "sw" ? "Ingia kwa akaunti iliyounganishwa na taasisi ili kuona rekodi zake." : "Sign in with an account linked to the organisation to view its records."}</Text><Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></Surface></Screen>;
  if (access === undefined) return <Screen><Text style={styles.body}>{locale === "sw" ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!approved) return <Screen><AppHeader back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} /><Surface tone="orange"><Text style={styles.title}>{locale === "sw" ? "Idhini ya mtoa huduma inahitajika" : "Provider approval required"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF lazima iidhinishe jukumu lako kabla ya taarifa za taasisi kuonekana." : "LSF must approve your provider role before organisation details are available."}</Text><Button label={locale === "sw" ? "Angalia kujiunga" : "View onboarding"} onPress={() => router.push("/paralegal-onboarding")} /></Surface></Screen>;
  if (record === undefined) return <Screen><Text style={styles.body}>{locale === "sw" ? "Tunapakia taasisi yako..." : "Loading your organisation..."}</Text></Screen>;
  if (!record) return <Screen><AppHeader back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} eyebrow="Haki Yangu" /><Surface tone="orange"><Text style={styles.title}>{locale === "sw" ? "Hakuna taasisi iliyounganishwa" : "No organisation linked"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF lazima iunganishe akaunti yako na taasisi iliyothibitishwa kabla ya huduma zake kuonekana hapa." : "LSF must link your account to a verified organisation before its services appear here."}</Text><Button label={locale === "sw" ? "Rudi workspace" : "Return to workspace"} onPress={() => router.back()} /></Surface></Screen>;
  const { organization, services } = record;
  return <Screen>
    <AppHeader back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} eyebrow="Haki Yangu · Provider" />
    <View style={styles.hero}><View style={styles.icon}><Ionicons name="business-outline" size={28} color={colors.surface} /></View><Text style={styles.heroTitle}>{organization.name}</Text><Text style={styles.heroBody}>{organization.organizationType.replaceAll("_", " ")}</Text><View style={styles.badges}><Badge label={statusLabels[organization.verificationStatus]?.[locale] ?? organization.verificationStatus} tone="teal" /><Badge label={statusLabels[organization.referralAgreementStatus]?.[locale] ?? organization.referralAgreementStatus} tone="pink" /></View></View>
    <SectionHeading title={locale === "sw" ? "Uaminifu na ulinzi" : "Trust and safeguarding"} />
    <Surface><Info label={locale === "sw" ? "Taasisi" : "Organisation status"} value={statusLabels[organization.verificationStatus]?.[locale] ?? organization.verificationStatus} /><Info label={locale === "sw" ? "Makubaliano ya rufaa" : "Referral agreement"} value={statusLabels[organization.referralAgreementStatus]?.[locale] ?? organization.referralAgreementStatus} /><Info label={locale === "sw" ? "Ulinzi" : "Safeguarding"} value={organization.safeguardingReady ? (locale === "sw" ? "Uko tayari" : "Ready") : (locale === "sw" ? "Inahitaji kupitia" : "Needs review")} />{organization.slaHours ? <Info label="SLA" value={`${organization.slaHours} ${locale === "sw" ? "saa" : "hours"}`} /> : null}</Surface>
    <SectionHeading title={locale === "sw" ? "Huduma zilizounganishwa" : "Linked services"} />
    {services.length ? services.map((service) => <Pressable key={service._id} style={styles.service} onPress={() => router.push({ pathname: "/service/[id]", params: { id: service._id } })}><View style={styles.serviceIcon}><Ionicons name="medical-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.serviceName}>{service.name}</Text><Text style={styles.meta}>{[service.district, service.region].filter(Boolean).join(", ")} · {service.servicePointType.replaceAll("_", " ")}</Text><Text style={styles.meta}>{statusLabels[service.verificationStatus]?.[locale] ?? service.verificationStatus} · {statusLabels[service.currentIntakeState]?.[locale] ?? service.currentIntakeState}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>) : <Surface><Text style={styles.body}>{locale === "sw" ? "Hakuna huduma iliyounganishwa bado." : "No service points are linked yet."}</Text></Surface>}
    <Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Mabadiliko yanadhibitiwa" : "Changes are governed"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF pekee ndiyo inaweza kuthibitisha, kusimamisha au kubadilisha taarifa za taasisi na huduma za umma." : "Only LSF can verify, suspend, or change organisation and public service records."}</Text></Surface>
  </Screen>;
}

function Badge({ label, tone }: { label: string; tone: "teal" | "pink" }) { return <Text style={[styles.badge, tone === "teal" ? styles.badgeTeal : styles.badgePink]}>{label}</Text>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.meta}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, marginTop: spacing.lg }, icon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 24 }, heroBody: { color: "#D8D2D5", fontFamily: type.regular, fontSize: 14, textTransform: "capitalize" }, badges: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }, badge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6, fontFamily: type.bold, fontWeight: "700", fontSize: 12 }, badgeTeal: { backgroundColor: "#DDF4EB", color: colors.teal }, badgePink: { backgroundColor: colors.softPink, color: colors.burgundy }, info: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 3 }, infoValue: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14, textTransform: "capitalize" }, service: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, marginBottom: spacing.sm }, serviceIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1, gap: 3 }, serviceName: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, textTransform: "capitalize" }, title: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 18 }, body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginTop: spacing.sm }, noteTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 },
});
