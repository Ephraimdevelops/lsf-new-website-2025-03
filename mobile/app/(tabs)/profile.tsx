import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { useAuth, useUser } from "../../src/auth";
import { useLanguage } from "../../src/i18n";
import { resources } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";

export default function ProfileScreen() {
  const { locale, setLocale, t } = useLanguage();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const access = useQuery(api.users.currentAccess);
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : "skip");
  const { savedIds } = useSavedResources();
  const displayName = user?.fullName ?? user?.firstName ?? (locale === "sw" ? "Mgeni" : "Guest");
  const contact = user?.primaryEmailAddress?.emailAddress ?? (locale === "sw" ? "Hujaingia" : "Not signed in");
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "HY";
  const savedResources = savedIds.map((id) => resources.find((resource) => resource.id === id)).filter((resource) => resource !== undefined);
  const roles = isSignedIn && access?.roles?.length ? access.roles : [];
  const roleCopy = getRoleCopy(roles, locale);
  const workspaces: Array<{ label: string; route: "/workspace" | "/operations" | "/safeguarding" | "/governance" | "/reporting" | "/saada-governance"; icon: React.ComponentProps<typeof Ionicons>["name"] }> = [];
  if (roles.some((role) => ["paralegal", "provider_staff"].includes(role))) workspaces.push({ label: locale === "sw" ? "Kazi zangu za msaada" : "My provider workspace", route: "/workspace", icon: "briefcase-outline" });
  if (roles.some((role) => ["admin", "staff", "supervisor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Foleni ya uendeshaji" : "Operations queue", route: "/operations", icon: "file-tray-full-outline" });
  if (roles.some((role) => ["admin", "supervisor", "safeguarding_officer"].includes(role))) workspaces.push({ label: locale === "sw" ? "Foleni ya ulinzi" : "Safeguarding queue", route: "/safeguarding", icon: "shield-checkmark-outline" });
  if (roles.some((role) => ["admin", "supervisor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Utawala wa jukwaa" : "Platform governance", route: "/governance", icon: "settings-outline" });
  if (roles.some((role) => ["admin", "staff"].includes(role))) workspaces.push({ label: locale === "sw" ? "Maarifa na sera za Saada" : "Saada knowledge & policy", route: "/saada-governance", icon: "library-outline" });
  if (roles.some((role) => ["admin", "staff", "supervisor", "stakeholder", "donor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Taarifa za athari" : "Impact reporting", route: "/reporting", icon: "bar-chart-outline" });

  return (
    <Screen>
      <AppHeader title={t("profile")} eyebrow={locale === "sw" ? "AKAUNTI NA MIPANGILIO" : "ACCOUNT & SETTINGS"} avatarUrl={user?.imageUrl} initial={initials} />
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{contact}</Text>
          <Text style={styles.badge}>{isSignedIn ? (locale === "sw" ? "Akaunti salama imewashwa" : "Secure account active") : (locale === "sw" ? "Mgeni: rasilimali za umma pekee" : "Guest: public resources only")}</Text>
        </View>
      </View>
      <View style={styles.scopeCard}>
        <View style={styles.scopeHeader}>
          <View style={styles.scopeIcon}><Ionicons name="key-outline" size={20} color={colors.burgundy} /></View>
          <View style={styles.identityCopy}>
            <Text style={styles.scopeTitle}>{roleCopy.title}</Text>
            <Text style={styles.scopeBody}>{roleCopy.body}</Text>
          </View>
        </View>
        <View style={styles.roleChips}>
          {(roles.length ? roles : ["guest"]).map((role) => (
            <Text key={role} style={styles.roleChip}>{roleLabel(role, locale)}</Text>
          ))}
        </View>
      </View>
      {workspaces.length > 0 ? <>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Sehemu yako ya kazi" : "Your work areas"}</Text>
        <View style={styles.savedCard}>
          {workspaces.map((item) => <Pressable key={item.route} style={styles.row} onPress={() => router.push(item.route)}><Ionicons name={item.icon} size={22} color={colors.burgundy} /><Text style={styles.rowText}>{item.label}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>)}
        </View>
      </> : null}
      {isSignedIn && <Pressable style={styles.row} onPress={() => router.push("/join")}><Ionicons name="people-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Jukumu langu na maombi" : "My role and applications"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>}
      <View style={styles.card}>
        {__DEV__ ? <Pressable style={styles.row} onPress={() => router.push("/review")}><Ionicons name="grid-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Hakiki skrini za akaunti" : "Preview account screens"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable> : null}
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/(tabs)/cases")}><Ionicons name="briefcase-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Kesi na maombi yangu" : "My cases and requests"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => void setLocale(locale === "sw" ? "en" : "sw")}><Ionicons name="language-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Lugha: Kiswahili" : "Language: English"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/offline")}><Ionicons name="cloud-offline-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Nje ya mtandao" : "Offline mode"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/documents")}><Ionicons name="document-text-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Nyaraka zangu" : "My documents"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/appointments")}><Ionicons name="calendar-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Miadi yangu" : "My appointments"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/privacy-security")}><Ionicons name="shield-checkmark-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Faragha na usalama" : "Privacy and security"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/support")}><Ionicons name="help-circle-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Msaada" : "Help and support"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.row} onPress={() => router.push("/about")}><Ionicons name="information-circle-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Kuhusu Haki Yangu" : "About Haki Yangu"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
      </View>
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Miongozo uliyohifadhi" : "Saved guides"}</Text>
      <View style={styles.savedCard}>
        {savedResources.length ? savedResources.map((resource) => (
          <Pressable key={resource.id} style={styles.savedRow} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}>
            <Ionicons name={resource.icon} size={22} color={colors.burgundy} />
            <Text style={styles.rowText}>{resource.title[locale]}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        )) : <Text style={styles.emptySaved}>{locale === "sw" ? "Bado hujahifadhi mwongozo. Fungua Learn kisha hifadhi mwongozo." : "No saved guides yet. Open Learn and save a guide."}</Text>}
      </View>
      {isSignedIn ? <><Text style={styles.sectionTitle}>{locale === "sw" ? "Huduma ulizohifadhi" : "Saved services"}</Text><View style={styles.savedCard}>
        <Pressable style={styles.savedRow} onPress={() => router.push("/saved-services")}><Ionicons name="bookmark-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{locale === "sw" ? "Angalia msaada uliohifadhi na mipango" : "View saved help and plans"}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
        {savedServices?.length ? savedServices.map(({ service }) => <Pressable key={String(service._id)} style={styles.savedRow} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })}><Ionicons name="business-outline" size={22} color={colors.burgundy} /><Text style={styles.rowText}>{service.name} · {service.district}</Text><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>) : <Text style={styles.emptySaved}>{locale === "sw" ? "Bado hujahifadhi huduma. Tafuta huduma kisha uihifadhi." : "No saved services yet. Find a service and save it here."}</Text>}
      </View></> : null}
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Zana za haraka" : "Quick tools"}</Text>
      <View style={styles.toolGrid}>
        <Tool icon="document-text-outline" label={locale === "sw" ? "Kagua hati" : "Check document"} onPress={() => router.push("/document-checker")} />
        <Tool icon="folder-outline" label={locale === "sw" ? "Nyaraka zangu" : "My documents"} onPress={() => router.push("/documents")} />
        <Tool icon="clipboard-outline" label={locale === "sw" ? "Muundo wa barua" : "Letter template"} onPress={() => router.push("/letter-builder")} />
        <Tool icon="shield-checkmark-outline" label={locale === "sw" ? "Vidokezo vya usalama" : "Safety tips"} onPress={() => router.push("/safety")} />
      </View>
      <Pressable accessibilityRole="button" onPress={() => isSignedIn ? void signOut() : router.push("/sign-in")} style={styles.secureButton}>
        <Ionicons name={isSignedIn ? "log-out-outline" : "lock-closed-outline"} size={18} color={colors.burgundy} />
        <Text style={styles.secureText}>{isSignedIn ? (locale === "sw" ? "Ondoka kwenye akaunti" : "Sign out") : (locale === "sw" ? "Ingia kwenye akaunti salama" : "Sign in to secure account")}</Text>
      </Pressable>
    </Screen>
  );
}

function Tool({ icon, label, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.tool}>
    <View style={styles.toolIcon}><Ionicons name={icon} size={21} color={colors.burgundy} /></View>
    <Text style={styles.toolLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color={colors.inkMuted} />
  </Pressable>;
}

function roleLabel(role: string, locale: "sw" | "en") {
  const labels: Record<string, { sw: string; en: string }> = {
    guest: { sw: "Mgeni", en: "Guest" },
    user: { sw: "Mnufaika", en: "Beneficiary" },
    paralegal: { sw: "Paralegal", en: "Paralegal" },
    provider_staff: { sw: "Mtoa huduma", en: "Provider staff" },
    staff: { sw: "Mfanyakazi LSF", en: "LSF staff" },
    safeguarding_officer: { sw: "Afisa ulinzi", en: "Safeguarding officer" },
    supervisor: { sw: "Msimamizi", en: "Supervisor" },
    content_editor: { sw: "Mhariri", en: "Content editor" },
    stakeholder: { sw: "Mdau", en: "Stakeholder" },
    donor: { sw: "Mfadhili", en: "Donor" },
    admin: { sw: "Msimamizi mkuu", en: "Administrator" },
  };
  return labels[role]?.[locale] ?? role.replaceAll("_", " ");
}

function getRoleCopy(roles: string[], locale: "sw" | "en") {
  if (!roles.length) {
    return {
      title: locale === "sw" ? "Ufikiaji wa mgeni" : "Guest access",
      body: locale === "sw" ? "Unaweza kusoma miongozo, kutafuta huduma, na kuanza ombi. Ingia ili kulinda kesi, ujumbe, nyaraka na miadi." : "You can read guides, find services, and start a request. Sign in to protect cases, messages, documents, and appointments.",
    };
  }
  if (roles.some((role) => ["admin", "staff", "supervisor", "safeguarding_officer", "content_editor"].includes(role))) {
    return {
      title: roles.includes("safeguarding_officer") ? (locale === "sw" ? "Ufikiaji wa ulinzi" : "Safeguarding access") : (locale === "sw" ? "Ufikiaji wa uendeshaji" : "Operations access"),
      body: roles.includes("safeguarding_officer") ? (locale === "sw" ? "Akaunti hii inaweza kuona kazi nyeti za ulinzi zilizoidhinishwa kwenye seva." : "This account can see server-approved safeguarding work and safety-sensitive review queues.") : (locale === "sw" ? "Akaunti hii inaweza kusaidia kazi za LSF kulingana na majukumu yaliyoidhinishwa kwenye seva." : "This account can support LSF operations according to server-approved roles."),
    };
  }
  if (roles.some((role) => ["paralegal", "provider_staff"].includes(role))) {
    return {
      title: locale === "sw" ? "Ufikiaji wa mtoa huduma" : "Provider access",
      body: locale === "sw" ? "Unaweza kushughulikia kazi ulizopewa, rufaa, miadi na mawasiliano ya kesi zilizo ndani ya wigo wako." : "You can handle assigned work, referrals, appointments, and case communication within your scope.",
    };
  }
  if (roles.some((role) => ["stakeholder", "donor"].includes(role))) {
    return {
      title: locale === "sw" ? "Ufikiaji wa taarifa" : "Reporting access",
      body: locale === "sw" ? "Unaona taarifa zilizoidhinishwa na zilizojumlishwa; maelezo binafsi ya kesi hayajaonyeshwa." : "You see approved aggregate reporting; private case details are not shown.",
    };
  }
  return {
    title: locale === "sw" ? "Ufikiaji wa mnufaika" : "Beneficiary access",
    body: locale === "sw" ? "Unaweza kutuma ombi, kufuatilia kesi, kutuma ujumbe, kuhifadhi nyaraka, kuomba miadi na kutoa mrejesho." : "You can submit requests, track cases, message your case team, save documents, request appointments, and give feedback.",
  };
}

const styles = StyleSheet.create({
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 30, marginTop: spacing.lg, marginBottom: spacing.xl },
  identity: { flexDirection: "row", gap: spacing.md, alignItems: "center", marginBottom: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl },
  avatar: { width: 64, height: 64, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 21 },
  identityCopy: { flex: 1, gap: 3 },
  name: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 18 },
  email: { fontFamily: type.regular, color: "#F6DDE6", fontSize: 13, marginTop: spacing.xs },
  badge: { alignSelf: "flex-start", overflow: "hidden", marginTop: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: 4, fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  scopeCard: { backgroundColor: colors.tealSoft, borderRadius: radius.lg, borderWidth: 0, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.xl },
  scopeHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  scopeIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  scopeTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 },
  scopeBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  roleChips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  roleChip: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.tealSoft, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.bold, fontWeight: "700", color: colors.teal, fontSize: 13 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.xl, overflow: "hidden" },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  rowText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 14 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 54 },
  sectionTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17, marginBottom: spacing.md },
  savedCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.xl, overflow: "hidden" },
  toolGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  tool: { width: "48.5%", minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface },
  toolIcon: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.softPink },
  toolLabel: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 12 },
  savedRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  emptySaved: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", padding: spacing.lg },
  secureButton: { marginTop: spacing.md, marginBottom: spacing.xl, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.sm },
  secureText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
});
