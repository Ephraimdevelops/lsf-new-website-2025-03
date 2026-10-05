import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { useAuth, useUser } from "../../src/auth";
import { useLanguage } from "../../src/i18n";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, spacing, type } from "../../src/theme";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { useSafeSignOut } from "../../src/useSafeSignOut";

export default function ProfileScreen() {
  const { locale, setLocale, t } = useLanguage();
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [coverRevision, setCoverRevision] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAllWorkspaces, setShowAllWorkspaces] = useState(false);
  const [showMoreSettings, setShowMoreSettings] = useState(false);
  const { isSignedIn } = useAuth();
  const safeSignOut = useSafeSignOut();
  const [signOutError, setSignOutError] = useState(false);
  const { user } = useUser();
  const { status: accountStatus, ready: accountReady, retry: retryAccountSync } = useAccountSync();
  const access = useQuery(api.users.currentAccess, isSignedIn && accountReady ? {} : "skip");
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn && accountReady ? {} : "skip");
  const cases = useQuery(api.caseManagement.myCases, isSignedIn && accountReady ? {} : "skip");
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn && accountReady ? {} : "skip");
  const { savedIds } = useSavedResources();
  const displayName = access?.user.name ?? user?.fullName ?? user?.firstName ?? (locale === "sw" ? "Mgeni" : "Guest");
  const contact = user?.primaryEmailAddress?.emailAddress ?? user?.primaryPhoneNumber?.phoneNumber ?? (isSignedIn ? (locale === "sw" ? "Akaunti inaendelea" : "Account active") : (locale === "sw" ? "Hujaingia" : "Not signed in"));
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "HY";
  const savedCount = savedIds.length + (savedServices?.length ?? 0);
  const roles = isSignedIn && access?.roles?.length ? access.roles : [];
  const roleCopy = getRoleCopy(roles, locale);
  const coverKey = `haki_profile_cover_${user?.id ?? "guest"}`;
  const activeCase = cases?.find((item) => !["closed", "closed_unresolved"].includes(item.status));
  const activeRequest = requests?.find((item) => !["converted_to_case", "withdrawn", "closed"].includes(item.status));
  const workspaces: Array<{ label: string; route: "/workspace" | "/operations" | "/safeguarding" | "/governance" | "/reporting" | "/saada-governance" | "/editorial-workspace"; icon: React.ComponentProps<typeof Ionicons>["name"] }> = [];
  if (roles.some((role) => ["paralegal", "provider_staff"].includes(role))) workspaces.push({ label: locale === "sw" ? "Kazi zangu za msaada" : "My provider workspace", route: "/workspace", icon: "briefcase-outline" });
  if (roles.some((role) => ["admin", "staff", "supervisor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Foleni ya uendeshaji" : "Operations queue", route: "/operations", icon: "file-tray-full-outline" });
  if (roles.some((role) => ["admin", "supervisor", "safeguarding_officer"].includes(role))) workspaces.push({ label: locale === "sw" ? "Foleni ya ulinzi" : "Safeguarding queue", route: "/safeguarding", icon: "shield-checkmark-outline" });
  if (roles.some((role) => ["admin", "staff", "supervisor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Utawala wa jukwaa" : "Platform governance", route: "/governance", icon: "settings-outline" });
  if (roles.some((role) => ["admin", "staff"].includes(role))) workspaces.push({ label: locale === "sw" ? "Maarifa na sera za Saada" : "Saada knowledge & policy", route: "/saada-governance", icon: "library-outline" });
  if (roles.some((role) => ["admin", "content_editor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Uhariri wa miongozo" : "Guide editorial", route: "/editorial-workspace", icon: "book-outline" });
  if (roles.some((role) => ["admin", "staff", "supervisor", "stakeholder", "donor"].includes(role))) workspaces.push({ label: locale === "sw" ? "Taarifa za athari" : "Impact reporting", route: "/reporting", icon: "bar-chart-outline" });

  useEffect(() => {
    setCoverUri(null);
    void AsyncStorage.getItem(coverKey).then((value) => setCoverUri(value)).catch(() => {});
  }, [coverKey]);

  async function pickImage(kind: "cover" | "avatar") {
    if (kind === "avatar" && !user) return router.push("/sign-in");
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(locale === "sw" ? "Ruhusa inahitajika" : "Permission needed", locale === "sw" ? "Ruhusu picha ili kuchagua taswira." : "Allow photo access to choose an image.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: kind === "avatar" ? [1, 1] : [3, 1], quality: 0.8, base64: kind === "avatar" });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (kind === "avatar") {
        if (!asset.base64 || !user) throw new Error("Missing image data");
        setUploadingAvatar(true);
        await user.setProfileImage({ file: `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}` });
        await user.reload();
      } else {
        const uri = Platform.OS === "web" ? asset.uri : new File(Paths.document, `${coverKey.replace(/[^a-zA-Z0-9_-]/g, "")}.jpg`).uri;
        if (Platform.OS !== "web") await new File(asset.uri).copy(new File(uri), { overwrite: true });
        await AsyncStorage.setItem(coverKey, uri);
        setCoverUri(uri);
        setCoverRevision(Date.now());
      }
    } catch {
      Alert.alert(locale === "sw" ? "Picha haijahifadhiwa" : "Image not saved", locale === "sw" ? "Jaribu tena baada ya muda mfupi." : "Please try again shortly.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const highlight = workspaces.length ? {
    icon: "briefcase-outline" as const,
    title: roleCopy.title,
    body: roleCopy.body,
    action: workspaces[0].label,
    onPress: () => router.push(workspaces[0].route),
  } : activeCase ? {
    icon: "folder-open-outline" as const,
    title: locale === "sw" ? "Kesi yako inaendelea" : "Your case is in progress",
    body: `${activeCase.publicId} · ${caseStatusLabels[locale][activeCase.status]}`,
    action: locale === "sw" ? "Angalia kesi" : "View case",
    onPress: () => router.push({ pathname: "/case/[id]", params: { id: activeCase._id } }),
  } : activeRequest ? {
    icon: "document-text-outline" as const,
    title: locale === "sw" ? "Ombi lako linaendelea" : "Your request is in progress",
    body: `${activeRequest.publicId} · ${locale === "sw" ? "Angalia hatua inayofuata" : "See the next step"}`,
    action: locale === "sw" ? "Angalia ombi" : "View request",
    onPress: () => router.push({ pathname: "/request/[id]", params: { id: activeRequest._id } }),
  } : isSignedIn ? {
    icon: "compass-outline" as const,
    title: locale === "sw" ? "Anza na unachohitaji" : "Start with what you need",
    body: locale === "sw" ? "Omba msaada au tafuta huduma iliyo karibu nawe." : "Request help or find a service near you.",
    action: locale === "sw" ? "Omba msaada" : "Request help",
    onPress: () => router.push("/intake"),
  } : {
    icon: "compass-outline" as const,
    title: locale === "sw" ? "Msaada unaanzia hapa" : "Help starts here",
    body: locale === "sw" ? "Tafuta huduma na soma miongozo bila kuingia." : "Find services and read guidance without signing in.",
    action: locale === "sw" ? "Tafuta huduma" : "Find services",
    onPress: () => router.push("/find-services"),
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title={t("profile")} showAvatar={false} />
      <View style={styles.identity}>
        <ImageBackground key={coverRevision} source={coverUri ? { uri: coverUri } : require("../../assets/home-find-help.jpg")} style={styles.cover} imageStyle={styles.coverImage}>
          <View style={styles.coverShade} />
          <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Badili picha ya mandharinyuma" : "Change cover photo"} onPress={() => void pickImage("cover")} style={styles.coverEdit}><Ionicons name="camera-outline" size={16} color={colors.surface} /><Text style={styles.coverEditText}>{locale === "sw" ? "Badili" : "Change"}</Text></Pressable>
        </ImageBackground>
        <View style={styles.identityBody}>
          <View style={styles.avatarWrap}>
            {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} /> : <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>}
            {isSignedIn ? <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Badili picha ya wasifu" : "Change profile photo"} disabled={uploadingAvatar} onPress={() => void pickImage("avatar")} style={styles.avatarEdit}><Ionicons name="camera" size={15} color={colors.surface} /></Pressable> : null}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{contact}</Text>
          <View style={styles.roleLine}><Ionicons name={isSignedIn ? "shield-checkmark-outline" : "person-outline"} size={16} color={colors.teal} /><Text style={styles.roleText}>{roleCopy.title}</Text></View>
          {isSignedIn ? <Pressable accessibilityRole="button" style={styles.editLink} onPress={() => router.push("/join")}><Text style={styles.editText}>{locale === "sw" ? "Angalia wasifu na majukumu" : "View profile and roles"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable> : <Pressable accessibilityRole="button" style={styles.editLink} onPress={() => router.push("/sign-in")}><Text style={styles.editText}>{locale === "sw" ? "Ingia ili kulinda taarifa zako" : "Sign in to protect your information"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable>}
        </View>
      </View>
      {isSignedIn && accountStatus === "error" ? <View style={styles.scopeCard}>
        <Text style={styles.scopeTitle}>{locale === "sw" ? "Akaunti haijaunganishwa" : "Account connection failed"}</Text>
        <Text style={styles.scopeBody}>{locale === "sw" ? "Angalia mtandao kisha ujaribu tena. Ikiwa akaunti imezuiwa, wasiliana na LSF." : "Check your connection and try again. Contact LSF if your account was deactivated."}</Text>
        <Pressable accessibilityRole="button" onPress={retryAccountSync}><Text style={styles.scopeTitle}>{locale === "sw" ? "Jaribu tena" : "Retry connection"}</Text></Pressable>
      </View> : null}
      <View style={styles.highlight}><View style={styles.highlightIcon}><Ionicons name={highlight.icon} size={21} color={colors.teal} /></View><View style={styles.highlightCopy}><Text style={styles.highlightTitle}>{highlight.title}</Text><Text style={styles.highlightBody}>{highlight.body}</Text><Pressable accessibilityRole="button" onPress={highlight.onPress} style={styles.highlightAction}><Text style={styles.highlightActionText}>{highlight.action}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable></View></View>
      {roles.length > 1 ? <Text style={styles.rolesSummary}>{roles.map((role) => roleLabel(role, locale)).join(" · ")}</Text> : null}
      {workspaces.length > 0 ? <>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Sehemu za kazi" : "Workspaces"}</Text>
        <View style={styles.menuGroup}>
          {workspaces.slice(0, showAllWorkspaces ? undefined : 3).map((item) => <ProfileRow key={item.route} icon={item.icon} label={item.label} onPress={() => router.push(item.route)} />)}
          {workspaces.length > 3 ? <ProfileRow icon={showAllWorkspaces ? "chevron-up-outline" : "grid-outline"} label={showAllWorkspaces ? (locale === "sw" ? "Onyesha chache" : "Show fewer") : (locale === "sw" ? "Sehemu nyingine za kazi" : "More work areas")} onPress={() => setShowAllWorkspaces(!showAllWorkspaces)} /> : null}
        </View>
      </> : null}
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Akaunti yangu" : "My account"}</Text>
      <View style={styles.menuGroup}>
        {isSignedIn ? <ProfileRow icon="briefcase-outline" label={locale === "sw" ? "Kesi na maombi yangu" : "My cases and requests"} onPress={() => router.push("/(tabs)/cases")} /> : null}
        <ProfileRow icon="bookmark-outline" label={locale === "sw" ? "Vilivyohifadhiwa" : "Saved items"} detail={savedCount ? `${savedCount}` : undefined} onPress={() => router.push("/(tabs)/learn?view=saved")} />
        {isSignedIn ? <ProfileRow icon="document-text-outline" label={locale === "sw" ? "Nyaraka zangu" : "My documents"} onPress={() => router.push("/documents")} /> : null}
        {isSignedIn ? <ProfileRow icon="calendar-outline" label={locale === "sw" ? "Miadi yangu" : "My appointments"} onPress={() => router.push("/appointments")} /> : null}
        {!isSignedIn ? <ProfileRow icon="book-outline" label={locale === "sw" ? "Jua haki zako" : "Know your rights"} onPress={() => router.push("/(tabs)/learn?view=all")} /> : null}
      </View>
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Mipangilio na msaada" : "Settings and support"}</Text>
      <View style={styles.menuGroup}>
        <ProfileRow icon="language-outline" label={locale === "sw" ? "Lugha" : "Language"} detail={locale === "sw" ? "Kiswahili" : "English"} onPress={() => void setLocale(locale === "sw" ? "en" : "sw")} />
        <ProfileRow icon="shield-checkmark-outline" label={locale === "sw" ? "Faragha na usalama" : "Privacy and security"} onPress={() => router.push("/privacy-security")} />
        <ProfileRow icon="help-circle-outline" label={locale === "sw" ? "Msaada" : "Help and support"} onPress={() => router.push("/support")} />
        {showMoreSettings ? <><ProfileRow icon="cloud-offline-outline" label={locale === "sw" ? "Nje ya mtandao" : "Offline access"} onPress={() => router.push("/offline")} /><ProfileRow icon="information-circle-outline" label={locale === "sw" ? "Kuhusu Haki Yangu" : "About Haki Yangu"} onPress={() => router.push("/about")} /></> : null}
        <ProfileRow icon={showMoreSettings ? "chevron-up-outline" : "ellipsis-horizontal"} label={showMoreSettings ? (locale === "sw" ? "Onyesha chache" : "Show fewer") : (locale === "sw" ? "Mipangilio zaidi" : "More settings")} onPress={() => setShowMoreSettings(!showMoreSettings)} />
      </View>
      {isSignedIn ? <Pressable accessibilityRole="button" onPress={() => void safeSignOut().catch(() => setSignOutError(true))} style={styles.secureButton}><Ionicons name="log-out-outline" size={18} color={colors.burgundy} /><Text style={styles.secureText}>{locale === "sw" ? "Ondoka kwenye akaunti" : "Sign out"}</Text></Pressable> : null}
      {signOutError ? <Text accessibilityRole="alert" style={styles.secureText}>{locale === "sw" ? "Hatukuweza kuzima arifa za kifaa hiki. Unganisha mtandao na ujaribu tena." : "We could not disable this device's alerts. Reconnect and retry signing out."}</Text> : null}
    </Screen>
  );
}

function ProfileRow({ icon, label, detail, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; detail?: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
    <Ionicons name={icon} size={20} color={colors.burgundy} />
    <Text style={styles.rowText}>{label}</Text>
    {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
    <Ionicons name="chevron-forward" size={17} color={colors.inkMuted} />
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
  screen: { backgroundColor: colors.surface },
  identity: { marginBottom: spacing.md },
  cover: { height: 116, overflow: "hidden", borderRadius: 8, alignItems: "flex-end", justifyContent: "flex-end" },
  coverImage: { borderRadius: 8 },
  coverShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(12,48,51,0.13)" },
  coverEdit: { minHeight: 32, flexDirection: "row", alignItems: "center", gap: 5, margin: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: 16, backgroundColor: "rgba(20,25,27,0.65)" },
  coverEditText: { fontFamily: type.medium, color: colors.surface, fontSize: 12 },
  identityBody: { paddingHorizontal: 4 },
  avatarWrap: { width: 78, height: 78, marginTop: -38 },
  avatar: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, borderColor: colors.surface, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, borderColor: colors.surface, backgroundColor: colors.burgundySoft },
  avatarEdit: { position: "absolute", right: -3, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.burgundy, borderWidth: 2, borderColor: colors.surface, alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: type.semibold, color: colors.burgundy, fontSize: 25 },
  name: { fontFamily: type.semibold, color: colors.ink, fontSize: 22, lineHeight: 28, marginTop: spacing.sm },
  email: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, marginTop: 2 },
  roleLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  roleText: { fontFamily: type.medium, color: colors.teal, fontSize: 13 },
  editLink: { alignSelf: "flex-start", minHeight: 40, flexDirection: "row", alignItems: "center", gap: 8, marginTop: spacing.sm },
  editText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
  highlight: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, backgroundColor: colors.tealSoft, borderRadius: 8, padding: spacing.lg, marginBottom: spacing.xl },
  highlightIcon: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  highlightCopy: { flex: 1, gap: 4 },
  highlightTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 15 },
  highlightBody: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  highlightAction: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 32, marginTop: 2 },
  highlightActionText: { fontFamily: type.semibold, color: colors.burgundy, fontSize: 13 },
  rolesSummary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 19, marginBottom: spacing.lg },
  scopeCard: { backgroundColor: colors.orangeSoft, borderRadius: 8, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.xl },
  scopeTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 15 },
  scopeBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  sectionTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 16, marginBottom: spacing.sm, marginTop: spacing.sm },
  menuGroup: { backgroundColor: "#F6F6F6", borderRadius: 8, paddingVertical: 5, marginBottom: spacing.xl },
  row: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  rowPressed: { backgroundColor: "#EBE9EA" },
  rowText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 15 },
  rowDetail: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  secureButton: { alignSelf: "flex-start", marginTop: spacing.sm, marginBottom: spacing.xl, minHeight: 48, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  secureText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 14 },
});
