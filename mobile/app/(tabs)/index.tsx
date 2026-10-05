import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth, useUser } from "../../src/auth";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { civic, colors, type } from "../../src/theme";

const primaryActions = [
  { sw: "Tafuta msaada", en: "Find help", subSw: "Anza na tatizo lako", subEn: "Start with your issue", route: "/find-services", icon: "search-outline", palette: civic.actionCards.find },
  { sw: "Omba msaada", en: "Request help", subSw: "Tuambie kilichotokea", subEn: "Tell us what happened", route: "/intake", icon: "document-text-outline", palette: civic.actionCards.request },
  { sw: "Haki Yangu AI", en: "Haki Yangu AI", subSw: "Pata maelezo rahisi", subEn: "Get simple guidance", route: "/sara", icon: "chatbubble-ellipses-outline", palette: civic.actionCards.saada },
  { sw: "Jua haki zako", en: "Know your rights", subSw: "Miongozo ya kila siku", subEn: "Everyday guides", route: "/(tabs)/learn?view=all", icon: "book-outline", palette: civic.actionCards.rights },
] as const;

const homeSlides = [
  { image: require("../../assets/home-hero.jpg"), eyebrow: { sw: "HAKI YANGU", en: "HAKI YANGU" }, title: { sw: "Elewa haki zako. Chukua hatua.", en: "Know your rights. Take the next step." }, body: { sw: "Mwongozo na msaada wa kisheria, mahali pamoja.", en: "Clear guidance and legal help in one place." }, action: { sw: "Anza hapa", en: "Start here" }, route: "/explore" },
  { image: require("../../assets/home-find-help.jpg"), eyebrow: { sw: "TAFUTA MSAADA", en: "FIND HELP" }, title: { sw: "Anza na tatizo lako.", en: "Start with your issue." }, body: { sw: "Jibu maswali machache, kisha uone msaada unaokufaa.", en: "Answer a few questions to find a suitable next step." }, action: { sw: "Anza kutafuta", en: "Get started" }, route: "/find-services" },
  { image: require("../../assets/home-request-help.jpg"), eyebrow: { sw: "OMBA MSAADA", en: "REQUEST HELP" }, title: { sw: "Huhitaji kujua pa kuanzia.", en: "You don't have to know where to start." }, body: { sw: "Eleza kinachokusumbua. Tutakuonyesha hatua inayofuata.", en: "Tell us what is happening. We'll show you a next step." }, action: { sw: "Omba msaada", en: "Request help" }, route: "/intake" },
] as const;

const quickTools = [
  { icon: "document-text-outline", sw: "Kagua hati", en: "Check document", subSw: "Elewa hati yako", subEn: "Understand a document", route: "/document-checker", color: "#2476C8", tint: "#EAF3FD" },
  { icon: "location-outline", sw: "Msaada karibu", en: "Nearby help", subSw: "Huduma katika eneo lako", subEn: "Services in your area", route: "/nearby-help", color: "#048E83", tint: "#E7F6F3" },
  { icon: "shield-checkmark-outline", sw: "Usalama", en: "Safety", subSw: "Namba za dharura", subEn: "Emergency numbers", route: "/safety", color: "#D89400", tint: "#FFF5D8" },
  { icon: "call-outline", sw: "Piga LSF", en: "Call LSF", subSw: "Msaada wa moja kwa moja", subEn: "Talk to our team", route: "tel:+255222601534", color: "#9A1744", tint: "#F9ECF1" },
] as const;

const requestStatusLabels = {
  draft: { sw: "Rasimu", en: "Draft" },
  submitted: { sw: "Limewasilishwa", en: "Submitted" },
  under_review: { sw: "Linakaguliwa", en: "Under review" },
  waiting_for_information: { sw: "Taarifa zinahitajika", en: "Information needed" },
  information_only: { sw: "Mwongozo umetolewa", en: "Guidance provided" },
  referred: { sw: "Limepelekwa kwa mtoa huduma", en: "Referred" },
  converted_to_case: { sw: "Limekuwa kesi", en: "Converted to case" },
  withdrawn: { sw: "Limeondolewa", en: "Withdrawn" },
  closed: { sw: "Limefungwa", en: "Closed" },
} as const;

export default function HomeScreen() {
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRef = useRef<ScrollView>(null);
  const { isSignedIn } = useAuth();
  const { ready: accountReady } = useAccountSync();
  const { user } = useUser();
  const { locale } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn && accountReady ? {} : "skip");
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn && accountReady ? {} : "skip");
  const invitations = useQuery(api.providerInvitations.mine, isSignedIn && accountReady ? {} : "skip");
  const activeCase = cases?.find((item) => !["closed", "closed_unresolved"].includes(item.status));
  const activeRequest = requests?.find((item) => !["converted_to_case", "withdrawn", "closed"].includes(item.status));
  const isLoadingJourney = isSignedIn && (cases === undefined || requests === undefined);
  const firstName = user?.firstName;
  const journeyTitle = activeCase ? (locale === "sw" ? "Kesi yangu" : "My case") : activeRequest ? (locale === "sw" ? "Ombi langu" : "My request") : (locale === "sw" ? "Kesi yangu" : "My case");
  const journeyStatus = activeCase
    ? `${activeCase.publicId} · ${caseStatusLabels[locale][activeCase.status]}`
    : activeRequest
      ? `${activeRequest.publicId} · ${requestStatusLabels[activeRequest.status][locale]}`
      : isLoadingJourney
        ? (locale === "sw" ? "Tunapakua taarifa zako..." : "Loading your progress...")
        : (locale === "sw" ? "Bado hakuna kesi" : "No case yet");
  const journeyHint = activeCase || activeRequest
    ? (locale === "sw" ? "Fungua kuona hatua inayofuata" : "Open to see your next step")
    : (locale === "sw" ? "Ukiomba msaada, litaonekana hapa." : "Your request will appear here when you ask for help.");
  const openJourney = () => {
    if (activeCase) return router.push({ pathname: "/case/[id]", params: { id: activeCase._id } });
    if (activeRequest) return router.push({ pathname: "/request/[id]", params: { id: activeRequest._id } });
    return router.push("/(tabs)/cases");
  };

  useEffect(() => {
    if (!slideWidth) return;
    const timer = setInterval(() => {
      setActiveSlide((current) => {
        const next = (current + 1) % homeSlides.length;
        slideRef.current?.scrollTo({ x: next * slideWidth, animated: true });
        return next;
      });
    }, 6500);
    return () => clearInterval(timer);
  }, [slideWidth]);

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Fungua wasifu" : "Open profile"} onPress={() => router.push("/(tabs)/profile")}>{user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> : <View style={styles.avatarFallback}><Text style={styles.avatarInitial}>{firstName?.slice(0, 1).toUpperCase() ?? "H"}</Text></View>}</Pressable>
        <View style={styles.greeting}>
          <Text style={styles.greetingEyebrow}>HAKI YANGU</Text>
          <Text style={styles.greetingTitle}>{firstName ? (locale === "sw" ? `Karibu, ${firstName}` : `Welcome, ${firstName}`) : (locale === "sw" ? "Karibu" : "Welcome")}</Text>
          <Text style={styles.greetingBody}>{locale === "sw" ? "Haki yako, hatua inayofuata" : "Your rights, your next step"}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Arifa" : "Notifications"} style={styles.bell} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={29} color={colors.burgundy} />
        </Pressable>
      </View>

      <ScrollView style={styles.homeScroll} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
      {!!invitations?.length && <Pressable accessibilityRole="button" onPress={() => router.push('/join')} style={{ padding: 18, borderRadius: 18, backgroundColor: colors.burgundySoft }}><Text style={{ color: colors.burgundy, fontFamily: type.bold, fontSize: 16 }}>{locale === 'sw' ? `Mialiko ya timu (${invitations.length})` : `Team invitations (${invitations.length})`}</Text><Text style={{ color: colors.inkMuted, marginTop: 6 }}>{locale === 'sw' ? 'Kagua mwaliko. LSF lazima iidhinishe kabla ya kutoa ruhusa.' : 'Review your invitation. LSF approval is required before work access.'}</Text></Pressable>}
      <View style={styles.hero} onLayout={(event) => setSlideWidth(event.nativeEvent.layout.width)}>
        {slideWidth > 0 ? <ScrollView ref={slideRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(event) => setActiveSlide(Math.round(event.nativeEvent.contentOffset.x / slideWidth))}>
          {homeSlides.map((slide) => <ImageBackground key={slide.route} source={slide.image} resizeMode="cover" style={[styles.heroSlide, { width: slideWidth }]}>
            <View style={styles.heroShade} />
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>{slide.eyebrow[locale]}</Text>
              <Text style={styles.heroTitle}>{slide.title[locale]}</Text>
              <Text style={styles.heroBody}>{slide.body[locale]}</Text>
              <Pressable accessibilityRole="button" style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]} onPress={() => router.push(slide.route)}><Text style={styles.heroButtonText}>{slide.action[locale]}</Text><Ionicons name="arrow-forward" size={18} color="#16242B" /></Pressable>
            </View>
          </ImageBackground>)}
        </ScrollView> : null}
        <View style={styles.slideDots}>{homeSlides.map((slide, index) => <Pressable key={slide.route} accessibilityRole="button" accessibilityLabel={`${index + 1} / ${homeSlides.length}`} onPress={() => { slideRef.current?.scrollTo({ x: index * slideWidth, animated: true }); setActiveSlide(index); }} style={[styles.slideDot, index === activeSlide && styles.slideDotActive]} />)}</View>
      </View>
      <View style={styles.intro}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Nianze wapi?" : "Where do I start?"}</Text>
        <Text style={styles.sectionSubtitle}>{locale === "sw" ? "Chagua unachohitaji sasa." : "Choose what you need now."}</Text>
      </View>
      <View style={styles.actionGrid}>
        {primaryActions.map((action) => (
          <Pressable key={action.en} accessibilityRole="button" accessibilityLabel={action[locale]} accessibilityHint={locale === "sw" ? action.subSw : action.subEn} style={({ pressed }) => [styles.actionCard, { backgroundColor: action.palette.background }, pressed && styles.pressed]} onPress={() => router.push(action.route)}>
            <View style={[styles.actionIcon, { backgroundColor: "#FFFFFF" }]}><Ionicons name={action.icon} size={30} color={action.palette.foreground} /></View>
            <Text style={[styles.actionTitle, { color: action.palette.foreground }]}>{action[locale]}</Text>
            <Text style={styles.actionBody}>{locale === "sw" ? action.subSw : action.subEn}</Text>
            <Ionicons name="arrow-forward" size={21} color={action.palette.foreground} style={styles.actionArrow} />
          </Pressable>
        ))}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel={`${journeyTitle}. ${journeyStatus}`} accessibilityHint={journeyHint} style={({ pressed }) => [styles.caseCard, pressed && styles.pressed]} onPress={openJourney}>
        <View style={styles.caseIcon}><Ionicons name="folder-outline" size={27} color="#0C4A6E" /></View>
        <View style={styles.caseCopy}>
          <Text style={styles.caseTitle}>{journeyTitle}</Text>
          <Text style={styles.caseBody}>{journeyStatus}</Text>
          <Text style={styles.caseHint}>{journeyHint}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#123B52" />
      </Pressable>

      <View style={styles.sectionHeader}><Text style={styles.toolsHeading}>{locale === "sw" ? "Zana za haraka" : "Quick tools"}</Text><Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Tazama zana zote" : "See all tools"} style={styles.seeAllButton} onPress={() => router.push("/explore")}><Text style={styles.seeAll}>{locale === "sw" ? "Tazama zote" : "See all"}</Text><Ionicons name="chevron-forward" size={19} color="#075171" /></Pressable></View>
      <View style={styles.tools}>
        {quickTools.map((tool) => (
          <Pressable key={tool.en} accessibilityRole="button" accessibilityLabel={locale === "sw" ? tool.sw : tool.en} accessibilityHint={locale === "sw" ? tool.subSw : tool.subEn} style={({ pressed }) => [styles.tool, { backgroundColor: tool.tint }, pressed && styles.pressed]} onPress={() => tool.route.startsWith("tel:") ? void Linking.openURL(tool.route) : router.push(tool.route)}>
            <View style={styles.toolIcon}><Ionicons name={tool.icon} size={23} color={tool.color} /></View>
            <Text style={styles.toolText}>{tool[locale]}</Text>
            <Ionicons name="chevron-forward" size={20} color={tool.color} />
          </Pressable>
        ))}
      </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8, paddingHorizontal: civic.pageInset, paddingBottom: 0, backgroundColor: colors.warmBackground },
  header: { minHeight: 72, flexDirection: "row", alignItems: "center", marginBottom: 12, paddingHorizontal: 4 },
  homeScroll: { flex: 1 },
  homeContent: { paddingBottom: 32 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarFallback: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#F3D2DD", alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: type.bold, color: colors.burgundy, fontSize: 25 },
  greeting: { flex: 1, marginLeft: 12 },
  greetingEyebrow: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11, letterSpacing: 0.2 },
  greetingTitle: { marginTop: 1, fontFamily: type.bold, color: "#102229", fontSize: 22 },
  greetingBody: { marginTop: 2, fontFamily: type.regular, color: "#555966", fontSize: 14 },
  bell: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  hero: { height: 205, borderRadius: 18, overflow: "hidden", backgroundColor: "#6C0B37" },
  heroSlide: { height: 205 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(20,15,20,0.16)" },
  heroContent: { flex: 1, alignItems: "flex-start", justifyContent: "center", paddingHorizontal: 18, paddingBottom: 12 },
  heroEyebrow: { maxWidth: "72%", fontFamily: type.semibold, color: "#FFE2DB", fontSize: 10 },
  heroTitle: { marginTop: 6, maxWidth: "72%", fontFamily: type.editorial, color: "#FFFFFF", fontSize: 23, lineHeight: 27 },
  heroBody: { marginTop: 5, maxWidth: "73%", fontFamily: type.regular, color: "#FFFFFF", fontSize: 12, lineHeight: 17 },
  heroButton: { minHeight: 34, minWidth: 120, marginTop: 10, paddingHorizontal: 11, borderRadius: 18, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  heroButtonText: { fontFamily: type.semibold, color: "#16242B", fontSize: 15 },
  slideDots: { position: "absolute", right: 15, bottom: 13, flexDirection: "row", gap: 6 },
  slideDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.55)" },
  slideDotActive: { width: 18, backgroundColor: "#FFFFFF" },
  intro: { marginTop: civic.sectionGap, marginBottom: 16, paddingHorizontal: 3 },
  sectionTitle: { fontFamily: type.editorial, color: "#102229", fontSize: 26 },
  sectionSubtitle: { marginTop: 2, fontFamily: type.regular, color: "#555966", fontSize: 15 },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 16 },
  actionCard: { width: "47.5%", minHeight: 168, borderRadius: 22, padding: 16, justifyContent: "flex-start" },
  actionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionTitle: { marginTop: 16, fontFamily: type.semibold, fontSize: 18, lineHeight: 23 },
  actionBody: { marginTop: 5, marginRight: 14, fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 19 },
  actionArrow: { position: "absolute", right: 13, bottom: 16 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  caseCard: { minHeight: 96, marginTop: 24, borderRadius: 20, backgroundColor: "#FFFFFF", padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: colors.line },
  caseIcon: { width: 52, height: 52, borderRadius: 15, backgroundColor: "#E0F0F5", alignItems: "center", justifyContent: "center" },
  caseCopy: { flex: 1 },
  caseTitle: { fontFamily: type.bold, color: "#102D3A", fontSize: 18 },
  caseBody: { marginTop: 1, fontFamily: type.medium, color: "#555966", fontSize: 13 },
  caseHint: { marginTop: 2, fontFamily: type.regular, color: "#66717E", fontSize: 12, lineHeight: 16 },
  sectionHeader: { marginTop: 24, marginBottom: 11, paddingHorizontal: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toolsHeading: { fontFamily: type.bold, color: "#0D445E", fontSize: 20 },
  seeAllButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 1 },
  seeAll: { fontFamily: type.medium, color: "#075171", fontSize: 13 },
  tools: { gap: 8 },
  tool: { width: "100%", minHeight: 60, borderRadius: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 13 },
  toolIcon: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  toolText: { flex: 1, fontFamily: type.semibold, color: "#11364A", fontSize: 15, lineHeight: 20 },
});
