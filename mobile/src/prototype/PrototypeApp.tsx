import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../i18n";
import { colors, radius, spacing, type } from "../theme";

type ScreenKey =
  | "splash"
  | "onboarding"
  | "home"
  | "intake"
  | "sara"
  | "learn"
  | "resource"
  | "paralegals"
  | "caseTimeline"
  | "caseChat"
  | "documents"
  | "documentChecker"
  | "letterBuilder"
  | "appointments"
  | "notifications"
  | "offline"
  | "safety"
  | "profile";

const screens: Array<{ key: ScreenKey; label: string; group: string; done: string }> = [
  { key: "splash", label: "Splash", group: "Start", done: "visual" },
  { key: "onboarding", label: "Onboarding", group: "Start", done: "visual" },
  { key: "home", label: "Home dashboard", group: "Core", done: "connected" },
  { key: "intake", label: "Guided intake", group: "Core", done: "connected" },
  { key: "sara", label: "Saada assistant", group: "Assistant", done: "concept" },
  { key: "learn", label: "Know your rights", group: "Learning", done: "local" },
  { key: "resource", label: "Guide detail", group: "Learning", done: "local" },
  { key: "paralegals", label: "Find paralegal", group: "Support", done: "connected" },
  { key: "caseTimeline", label: "Case timeline", group: "Case", done: "connected" },
  { key: "caseChat", label: "Case chat", group: "Case", done: "connected" },
  { key: "documents", label: "My documents", group: "Case", done: "connected" },
  { key: "documentChecker", label: "Document checker", group: "Tools", done: "connected" },
  { key: "letterBuilder", label: "Letter builder", group: "Tools", done: "connected" },
  { key: "appointments", label: "Appointments", group: "Case", done: "connected" },
  { key: "notifications", label: "Notifications", group: "System", done: "connected" },
  { key: "offline", label: "Offline mode", group: "System", done: "local" },
  { key: "safety", label: "Safety plan", group: "Safety", done: "local" },
  { key: "profile", label: "Profile", group: "Account", done: "connected" },
];

const legacyAssistantContractName = "SARA assistant";

export function PrototypeApp() {
  const { locale, setLocale } = useLanguage();
  const [selected, setSelected] = useState<ScreenKey>("home");
  const { width } = useWindowDimensions();
  const selectedScreen = useMemo(() => screens.find((screen) => screen.key === selected) ?? screens[0], [selected]);
  const currentIndex = screens.findIndex((screen) => screen.key === selected);
  const isCompact = width < 720;

  if (isCompact) {
    const previous = screens[(currentIndex - 1 + screens.length) % screens.length];
    const next = screens[(currentIndex + 1) % screens.length];

    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.compactShell}>
          <View style={styles.compactTopBar}>
            <View style={styles.brandRow}>
              <Text style={styles.logoSmall}>LSF</Text>
              <View>
                <Text style={styles.kicker}>{selectedScreen.label}</Text>
                <Text style={styles.prototypeTag}>Prototype mode</Text>
              </View>
            </View>
            <Pressable style={styles.compactLanguageButton} onPress={() => void setLocale(locale === "sw" ? "en" : "sw")}>
              <Ionicons name="language-outline" size={16} color={colors.burgundy} />
            </Pressable>
          </View>
          <View style={styles.compactControls}>
            <Pressable style={styles.compactControl} onPress={() => setSelected(previous.key)}>
              <Ionicons name="chevron-back" size={16} color={colors.burgundy} />
              <Text style={styles.compactControlText}>{previous.label}</Text>
            </Pressable>
            <Pressable style={styles.compactControl} onPress={() => setSelected(next.key)}>
              <Text style={styles.compactControlText}>{next.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.burgundy} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compactScreenRailWrapper} contentContainerStyle={styles.compactScreenRail}>
            {screens.map((screen) => (
              <Pressable key={screen.key} onPress={() => setSelected(screen.key)} style={[styles.compactChip, selected === screen.key && styles.compactChipActive]}>
                <Text style={[styles.compactChipText, selected === screen.key && styles.compactChipTextActive]}>{screen.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.compactStage}>
            <PhoneScreen screen={selected} locale={locale} onNavigate={setSelected} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.sidebar}>
          <View style={styles.brandRow}>
            <Text style={styles.logo}>LSF</Text>
            <View>
              <Text style={styles.kicker}>Haki Yangu</Text>
              <Text style={styles.prototypeTag}>Prototype review mode</Text>
            </View>
          </View>
          <Pressable style={styles.languageButton} onPress={() => void setLocale(locale === "sw" ? "en" : "sw")}>
            <Ionicons name="language-outline" size={16} color={colors.burgundy} />
            <Text style={styles.languageText}>{locale === "sw" ? "Kiswahili" : "English"}</Text>
          </Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            {screens.map((screen) => (
              <Pressable key={screen.key} onPress={() => setSelected(screen.key)} style={[styles.navItem, selected === screen.key && styles.navItemActive]}>
                <View style={styles.navCopy}>
                  <Text style={[styles.navLabel, selected === screen.key && styles.navLabelActive]}>{screen.label}</Text>
                  <Text style={styles.navMeta}>{screen.group} · {screen.done}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={selected === screen.key ? colors.burgundy : colors.inkMuted} />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.stage}>
          <View style={styles.stageHeader}>
            <View>
              <Text style={styles.stageTitle}>{selectedScreen.label}</Text>
              <Text style={styles.stageMeta}>Review flow, spacing, copy, and mobile navigation before device QA.</Text>
            </View>
            <View style={styles.statusPill}><Text style={styles.statusText}>{selectedScreen.done}</Text></View>
          </View>
          <View style={styles.phoneFrame}>
            <PhoneScreen screen={selected} locale={locale} onNavigate={setSelected} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PhoneScreen({ screen, locale, onNavigate }: { screen: ScreenKey; locale: "sw" | "en"; onNavigate: (screen: ScreenKey) => void }) {
  if (screen === "splash") return <Splash />;
  if (screen === "onboarding") return <Onboarding onNavigate={onNavigate} />;
  if (screen === "home") return <Home locale={locale} onNavigate={onNavigate} />;
  if (screen === "intake") return <Intake locale={locale} />;
  if (screen === "sara") return <Sara locale={locale} />;
  if (screen === "learn") return <Learn onNavigate={onNavigate} />;
  if (screen === "resource") return <Resource onNavigate={onNavigate} />;
  if (screen === "paralegals") return <Paralegals locale={locale} />;
  if (screen === "caseTimeline") return <CaseTimeline onNavigate={onNavigate} />;
  if (screen === "caseChat") return <CaseChat />;
  if (screen === "documents") return <Documents onNavigate={onNavigate} />;
  if (screen === "documentChecker") return <DocumentChecker onNavigate={onNavigate} />;
  if (screen === "letterBuilder") return <LetterBuilder />;
  if (screen === "appointments") return <Appointments onNavigate={onNavigate} />;
  if (screen === "notifications") return <Notifications />;
  if (screen === "offline") return <Offline />;
  if (screen === "safety") return <Safety />;
  return <Profile onNavigate={onNavigate} />;
}

const logoWhite = require("../../assets/lsf-logo-white.png");
const logoBurgundy = require("../../assets/lsf-logo-burgundy.png");

function PhoneChrome({ children, nav = true }: { children: React.ReactNode; nav?: boolean }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 720;

  return (
    <View style={[styles.phone, isCompact && styles.phoneCompact]}>
      {!isCompact ? <View style={styles.notch} /> : null}
      <ScrollView contentContainerStyle={[styles.phoneContent, nav && styles.phoneContentWithNav]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {nav ? <FloatingNav /> : null}
      {!isCompact ? <View style={styles.homeBar} /> : null}
    </View>
  );
}

function Splash() {
  return (
    <PhoneChrome nav={false}>
      <ImageBackground source={logoWhite} resizeMode="cover" imageStyle={styles.splashWatermark} style={styles.splash}>
        <View style={styles.splashGlow} />
        <Image source={logoWhite} resizeMode="contain" style={styles.splashBrand} />
        <View style={styles.splashCopy}>
          <Text style={styles.splashEyebrow}>Haki Yangu</Text>
          <Text style={styles.splashTitle}>Justice that moves with you.</Text>
          <Text style={styles.splashBody}>Find trusted legal help, understand your rights, and follow your case in simple steps.</Text>
        </View>
        <Text style={styles.splashFooter}>Legal Services Facility</Text>
      </ImageBackground>
    </PhoneChrome>
  );
}

function Onboarding({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome nav={false}><Image source={logoBurgundy} resizeMode="contain" style={styles.onboardingLogo} /><Text style={styles.title}>Everyday justice, finally simple.</Text><Text style={styles.body}>Connect with verified paralegals, ask clear legal questions, book support, and track every step.</Text><People /><ButtonRow label="Get started" onPress={() => onNavigate("home")} /><OutlineButton label="I have an account" /></PhoneChrome>;
}

function Home({ locale, onNavigate }: { locale: "sw" | "en"; onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title={locale === "sw" ? "Habari, Asha" : "Hello, Asha"} /><HeroCard onNavigate={onNavigate} /><Text style={styles.sectionTitle}>Start here</Text><View style={styles.premiumGrid}>{[
    ["Find paralegal", "paralegals", "people-outline"],
    ["Ask Saada", "sara", "chatbubble-ellipses-outline"],
    ["Book support", "appointments", "calendar-outline"],
    ["Request help", "intake", "document-text-outline"],
  ].map(([label, key, icon], index) => <PremiumAction key={key} label={label} icon={icon as keyof typeof Ionicons.glyphMap} featured={index === 0} onPress={() => onNavigate(key as ScreenKey)} />)}</View><Text style={styles.sectionTitle}>Quick tools</Text><View style={styles.quickTools}>{[
    ["Know rights", "learn", "book-outline"],
    ["My case", "caseTimeline", "briefcase-outline"],
    ["Documents", "documents", "folder-open-outline"],
    ["Safety", "safety", "shield-checkmark-outline"],
  ].map(([label, key, icon]) => <QuickTool key={key} label={label} icon={icon as keyof typeof Ionicons.glyphMap} onPress={() => onNavigate(key as ScreenKey)} />)}</View><CaseStatus onPress={() => onNavigate("caseTimeline")} /></PhoneChrome>;
}

function HeroCard({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroOrbOne} />
      <View style={styles.heroOrbTwo} />
      <Text style={styles.heroKicker}>Trusted support nearby</Text>
      <Text style={styles.heroTitle}>Get matched with the right paralegal today.</Text>
      <Text style={styles.heroBody}>Verified help for employment, land, family, safety, and consumer issues across Tanzania.</Text>
      <Pressable style={styles.heroButton} onPress={() => onNavigate("paralegals")}>
        <Text style={styles.heroButtonText}>Find a paralegal</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.burgundy} />
      </Pressable>
    </View>
  );
}

function PremiumAction({ label, icon, featured, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; featured?: boolean; onPress: () => void }) {
  return <Pressable style={[styles.premiumAction, featured && styles.premiumActionFeatured]} onPress={onPress}><View style={[styles.premiumIcon, featured && styles.premiumIconFeatured]}><Ionicons name={icon} size={featured ? 28 : 23} color={featured ? colors.surface : colors.burgundy} /></View><Text style={[styles.premiumActionText, featured && styles.premiumActionTextFeatured]}>{label}</Text><Text style={[styles.premiumActionMeta, featured && styles.premiumActionMetaFeatured]}>{featured ? "Verified support near you" : "Open"}</Text></Pressable>;
}

function QuickTool({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return <Pressable style={styles.quickTool} onPress={onPress}><Ionicons name={icon} size={18} color={colors.burgundy} /><Text style={styles.quickToolText}>{label}</Text></Pressable>;
}

function CaseStatus({ onPress }: { onPress: () => void }) {
  return <Pressable style={styles.caseStatus} onPress={onPress}><View><Text style={styles.sectionTitle}>Case #25-000123</Text><Text style={styles.meta}>Under review by LSF · Today, 10:30 AM</Text></View><View style={styles.progressRing}><Text style={styles.progressText}>2/5</Text></View></Pressable>;
}

function FloatingNav() {
  return (
    <View style={styles.floatingNav}>
      {[
        ["Home", "home-outline"],
        ["Cases", "briefcase-outline"],
        ["+", "add"],
        ["Learn", "book-outline"],
        ["Profile", "person-outline"],
      ].map(([label, icon], index) => (
        <View key={label} style={[styles.navBubble, index === 2 && styles.navBubbleCenter]}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={index === 2 ? 22 : 18} color={index === 2 ? colors.surface : colors.burgundy} />
          {index !== 2 ? <Text style={styles.floatingNavText}>{label}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function LegacyHomeUnused({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title="Habari, Asha" /><View style={styles.grid}>{[
    ["Ask Haki", "sara", "chatbubble-ellipses-outline"],
    ["Request help", "intake", "document-text-outline"],
    ["Find paralegal", "paralegals", "people-outline"],
    ["Track case", "caseTimeline", "briefcase-outline"],
  ].map(([label, key, icon]) => <Action key={key} label={label} icon={icon as keyof typeof Ionicons.glyphMap} onPress={() => onNavigate(key as ScreenKey)} />)}</View><CaseCard onPress={() => onNavigate("caseTimeline")} /><ToolRow onNavigate={onNavigate} /></PhoneChrome>;
}

function Intake({ locale }: { locale: "sw" | "en" }) {
  return <PhoneChrome><BackTitle title={locale === "sw" ? "Nini kilitokea?" : "What happened?"} /><Text style={styles.body}>Tell us in your own words. You can write, speak, upload documents, or save for later.</Text><View style={styles.segment}><Text style={styles.segmentActive}>Write</Text><Text style={styles.segmentText}>Speak</Text></View><View style={styles.textBox}><Text style={styles.placeholder}>Example: My employer has not paid me for two months...</Text></View><Checklist items={["Choose topic", "Upload documents", "Preferred language", "Consent and privacy"]} /><ButtonRow label="Next" /></PhoneChrome>;
}

function Sara({ locale }: { locale: "sw" | "en" }) {
  return <PhoneChrome><BackTitle title="Ask Haki" /><Message text={locale === "sw" ? "Uliza swali la haki zako kwa lugha rahisi." : "Ask a rights question in plain language."} /><Message mine text="My employer has not paid me. What can I do?" /><Message text="Keep evidence, request payment in writing, and connect with a verified paralegal if there is no response." /><View style={styles.composer}><Text style={styles.placeholder}>Ask about your rights...</Text><Ionicons name="arrow-up" size={18} color={colors.surface} /></View></PhoneChrome>;
}

function Learn({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title="Know your rights" /><Search /><CategoryGrid /><Text style={styles.sectionTitle}>Popular guides</Text>{["What to do if you are not paid", "Understanding land agreements", "How to report GBV safely"].map((item) => <ListCard key={item} title={item} meta="5 min read" onPress={() => onNavigate("resource")} />)}</PhoneChrome>;
}

function Resource({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><BackTitle title="What to do if you are not paid" /><Text style={styles.meta}>5 min read</Text><Panel title="In this guide" items={["Check your agreement", "Request payment", "Keep records", "Ask for help"]} /><Text style={styles.body}>Review your contract or salary agreement. Keep screenshots, witnesses, and payment records.</Text><ButtonRow label="Build a demand letter" onPress={() => onNavigate("letterBuilder")} /><OutlineButton label="Request legal help" /></PhoneChrome>;
}

function Paralegals({ locale }: { locale: "sw" | "en" }) {
  return <PhoneChrome><Header title={locale === "sw" ? "Wasaidizi karibu nawe" : "Paralegals near you"} /><Search /><FilterRow /><ParalegalCard name="Neema J. Mollel" tags="Employment, Labour" /><ParalegalCard name="Juma K. Ramadhani" tags="Land, Contracts" /><ParalegalCard name="Asha Said" tags="Women rights" /></PhoneChrome>;
}

function CaseTimeline({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><BackTitle title="Case #25-000123" /><Text style={styles.statusLarge}>In progress</Text><Tabs labels={["Timeline", "Messages", "Docs"]} /><Timeline items={["Request submitted", "Under review by LSF", "Assigned to paralegal", "Appointment scheduled"]} /><ButtonRow label="Message paralegal" onPress={() => onNavigate("caseChat")} /><OutlineButton label="View documents" onPress={() => onNavigate("documents")} /></PhoneChrome>;
}

function CaseChat() {
  return <PhoneChrome><BackTitle title="Case chat" /><Message text="Habari Asha, nimepokea kesi yako." /><Message mine text="Asante sana, natarajia msaada." /><Message text="Tafadhali tuma mkataba wako au malipo uliyopokea." /><View style={styles.attachment}><Ionicons name="document-text-outline" size={18} color={colors.burgundy} /><Text style={styles.meta}>Employment Contract.pdf</Text></View><View style={styles.composer}><Text style={styles.placeholder}>Type a message...</Text><Ionicons name="arrow-up" size={18} color={colors.surface} /></View></PhoneChrome>;
}

function Documents({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title="My documents" /><Summary number="4" label="documents across your cases" />{["Employment Contract", "Salary Demand Letter", "Payment proof", "Land Agreement"].map((item, index) => <ListCard key={item} title={item} meta={index === 1 ? "Text draft · pending review" : "PDF · pending review"} />)}<ButtonRow label="Check a document" onPress={() => onNavigate("documentChecker")} /></PhoneChrome>;
}

function DocumentChecker({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><BackTitle title="Before you sign" /><UploadBox /><Panel title="Before signing, check" items={["Names are correct", "Amount and dates are clear", "No blank fields", "You can keep a copy"]} /><WarningPanel /><ButtonRow label="Attach document to case" /><OutlineButton label="Build a letter instead" onPress={() => onNavigate("letterBuilder")} /></PhoneChrome>;
}

function LetterBuilder() {
  return <PhoneChrome><BackTitle title="Letter builder" /><Text style={styles.body}>Draft a demand letter step by step. Save locally or attach to a case when ready.</Text><InputLabel label="Who are you writing to?" value="ABC Company Ltd" /><InputLabel label="What is the issue?" value="I have not been paid for two months." /><View style={styles.preview}><Text style={styles.previewText}>RE: REQUEST TO RESOLVE A LEGAL ISSUE{"\n\n"}Please respond within 7 days...</Text></View><ButtonRow label="Attach draft to case" /><OutlineButton label="Save secure draft" /></PhoneChrome>;
}

function Appointments({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title="Book support" /><View style={styles.bookingHero}><Text style={styles.heroKicker}>Book with confidence</Text><Text style={styles.bookingTitle}>Choose the kind of help you need.</Text><Text style={styles.heroBody}>Meet a verified paralegal, join a legal clinic, or get a phone consultation.</Text></View><BookingOption icon="people-outline" title="Paralegal meeting" meta="In-person or remote" active /><BookingOption icon="business-outline" title="Legal clinic" meta="Community legal aid clinic" /><BookingOption icon="call-outline" title="Phone consultation" meta="Talk to a paralegal" /><Text style={styles.sectionTitle}>Available date</Text><View style={styles.calendarStrip}>{["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => <View key={day} style={[styles.dayChip, index === 2 && styles.dayChipActive]}><Text style={[styles.dayText, index === 2 && styles.dayTextActive]}>{day}</Text><Text style={[styles.dateText, index === 2 && styles.dayTextActive]}>{20 + index}</Text></View>)}</View><ButtonRow label="Book appointment" onPress={() => onNavigate("caseTimeline")} /></PhoneChrome>;
}

function BookingOption({ icon, title, meta, active }: { icon: keyof typeof Ionicons.glyphMap; title: string; meta: string; active?: boolean }) {
  return <View style={[styles.bookingOption, active && styles.bookingOptionActive]}><View style={styles.bookingIcon}><Ionicons name={icon} size={21} color={colors.burgundy} /></View><View style={styles.listCopy}><Text style={styles.listTitle}>{title}</Text><Text style={styles.meta}>{meta}</Text></View><Ionicons name={active ? "checkmark-circle" : "chevron-forward"} size={20} color={active ? colors.teal : colors.inkMuted} /></View>;
}

function Notifications() {
  return <PhoneChrome><Header title="Notifications" />{["Neema sent you a message", "Appointment reminder", "Your case status changed", "Document review updated"].map((item) => <ListCard key={item} title={item} meta="Today" />)}<ButtonRow label="Mark all as read" /></PhoneChrome>;
}

function Offline() {
  return <PhoneChrome><BackTitle title="You are offline" /><Text style={styles.body}>You can still read saved guides, draft requests, view saved resources, and write notes.</Text><Panel title="Pending sync" items={["1 message", "2 documents", "1 appointment request"]} /><ButtonRow label="Try syncing now" /></PhoneChrome>;
}

function Safety() {
  return <PhoneChrome><View style={styles.safetyHero}><Text style={styles.safetyTitle}>Need help now?</Text><Text style={styles.safetyText}>If someone is in immediate danger, call official emergency help.</Text></View><ListCard title="Call Police" meta="112" /><ListCard title="GBV Hotline" meta="0800 753 900" /><Panel title="Safety plan" items={["Trust your instincts", "Identify safe people", "Keep documents", "Plan a safe exit"]} /></PhoneChrome>;
}

function Profile({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <PhoneChrome><Header title="My Profile" /><View style={styles.identity}><View style={styles.avatar}><Text style={styles.avatarText}>AS</Text></View><View><Text style={styles.cardTitle}>Asha Said</Text><Text style={styles.meta}>asha.said@email.com</Text></View></View>{["My Cases", "My Documents", "My Appointments", "Privacy and security", "Help and support"].map((item) => <ListCard key={item} title={item} meta="Open" onPress={() => item.includes("Documents") ? onNavigate("documents") : item.includes("Appointments") ? onNavigate("appointments") : undefined} />)}</PhoneChrome>;
}

function Header({ title }: { title: string }) {
  return <View style={styles.phoneHeader}><Text style={styles.logoSmall}>LSF</Text><Text style={styles.headerTitle}>{title}</Text><Ionicons name="notifications-outline" size={20} color={colors.burgundy} /></View>;
}

function BackTitle({ title }: { title: string }) {
  return <View style={styles.backTitle}><Ionicons name="chevron-back" size={24} color={colors.burgundy} /><Text style={styles.headerTitle}>{title}</Text></View>;
}

function ButtonRow({ label, onPress }: { label: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.primaryButton}><Text style={styles.primaryText}>{label}</Text></Pressable>;
}

function OutlineButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.outlineButton}><Text style={styles.outlineText}>{label}</Text></Pressable>;
}

function Action({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return <Pressable style={styles.actionCard} onPress={onPress}><Ionicons name={icon} size={26} color={colors.burgundy} /><Text style={styles.actionText}>{label}</Text></Pressable>;
}

function People() {
  return <View style={styles.people}><View style={styles.person} /><View style={[styles.person, styles.personTall]} /><View style={styles.person} /></View>;
}

function Search() {
  return <View style={styles.search}><Ionicons name="search-outline" size={17} color={colors.inkMuted} /><Text style={styles.placeholder}>Search rights, topics, guides...</Text></View>;
}

function CategoryGrid() {
  return <View style={styles.categoryGrid}>{["Land", "Employment", "Family", "Safety", "Contracts", "Consumer"].map((item) => <View key={item} style={styles.category}><Text style={styles.categoryText}>{item}</Text></View>)}</View>;
}

function CaseCard({ onPress }: { onPress: () => void }) {
  return <Pressable style={styles.caseCard} onPress={onPress}><Text style={styles.sectionTitle}>My Case</Text><Text style={styles.meta}>Case #25-000123 · under review</Text><Text style={styles.body}>Unpaid salary case. Last update: Today, 10:30 AM</Text></Pressable>;
}

function ToolRow({ onNavigate }: { onNavigate: (screen: ScreenKey) => void }) {
  return <View style={styles.toolRow}><OutlineButton label="Documents" onPress={() => onNavigate("documents")} /><OutlineButton label="Appointments" onPress={() => onNavigate("appointments")} /></View>;
}

function ListCard({ title, meta, onPress }: { title: string; meta: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.listCard}><View style={styles.listIcon}><Ionicons name="document-text-outline" size={18} color={colors.burgundy} /></View><View style={styles.listCopy}><Text style={styles.listTitle}>{title}</Text><Text style={styles.meta}>{meta}</Text></View><Ionicons name="chevron-forward" size={16} color={colors.inkMuted} /></Pressable>;
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <View style={styles.panel}><Text style={styles.cardTitle}>{title}</Text>{items.map((item, index) => <Text key={item} style={styles.panelItem}>{index + 1}. {item}</Text>)}</View>;
}

function Checklist({ items }: { items: string[] }) {
  return <View style={styles.panel}>{items.map((item) => <View key={item} style={styles.checkRow}><Ionicons name="checkmark-circle-outline" size={17} color={colors.teal} /><Text style={styles.panelItem}>{item}</Text></View>)}</View>;
}

function WarningPanel() {
  return <View style={styles.warningPanel}><Text style={styles.cardTitle}>Stop and ask if</Text><Text style={styles.panelItem}>Blank fields, pressure to sign, or penalties you do not understand.</Text></View>;
}

function Tabs({ labels }: { labels: string[] }) {
  return <View style={styles.tabs}>{labels.map((label, index) => <Text key={label} style={[styles.tab, index === 0 && styles.activeTab]}>{label}</Text>)}</View>;
}

function Timeline({ items }: { items: string[] }) {
  return <View style={styles.timeline}>{items.map((item, index) => <View key={item} style={styles.timelineRow}><View style={[styles.timelineDot, index === items.length - 1 && styles.currentDot]} /><View><Text style={styles.listTitle}>{item}</Text><Text style={styles.meta}>20 May 2025</Text></View></View>)}</View>;
}

function Message({ text, mine }: { text: string; mine?: boolean }) {
  return <View style={[styles.message, mine && styles.mineMessage]}><Text style={[styles.messageText, mine && styles.mineMessageText]}>{text}</Text></View>;
}

function FilterRow() {
  return <View style={styles.toolRow}><Text style={styles.filterChip}>Ilala District</Text><Text style={styles.filterChip}>Employment</Text></View>;
}

function ParalegalCard({ name, tags }: { name: string; tags: string }) {
  return <View style={styles.paralegalCard}><View style={styles.avatar}><Text style={styles.avatarText}>{name.slice(0, 1)}</Text></View><View style={styles.listCopy}><Text style={styles.listTitle}>{name}</Text><Text style={styles.meta}>{tags} · Available</Text></View><Text style={styles.rating}>4.8</Text></View>;
}

function UploadBox() {
  return <View style={styles.uploadBox}><Ionicons name="cloud-upload-outline" size={28} color={colors.burgundy} /><Text style={styles.listTitle}>Upload or take a photo</Text><Text style={styles.meta}>JPG, PNG, PDF, Word</Text></View>;
}

function InputLabel({ label, value }: { label: string; value: string }) {
  return <View style={styles.inputGroup}><Text style={styles.meta}>{label}</Text><Text style={styles.inputMock}>{value}</Text></View>;
}

function Summary({ number, label }: { number: string; label: string }) {
  return <View style={styles.summary}><Text style={styles.summaryNumber}>{number}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function AppointmentCard({ status }: { status: string }) {
  return <View style={styles.appointmentCard}><View><Text style={styles.listTitle}>20 May 2025, 10:00 AM</Text><Text style={styles.meta}>Phone · Neema J. Mollel</Text></View><Text style={styles.appointmentStatus}>{status}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F3F1" },
  shell: { flex: 1, flexDirection: "row" },
  compactShell: { flex: 1, backgroundColor: colors.background },
  compactTopBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.background },
  compactLanguageButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  compactControls: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, backgroundColor: colors.background },
  compactControl: { flex: 1, minHeight: 38, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs },
  compactControlText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  compactScreenRailWrapper: { flexGrow: 0, maxHeight: 48, backgroundColor: colors.background },
  compactScreenRail: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, alignItems: "center" },
  compactChip: { height: 34, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, alignItems: "center", justifyContent: "center" },
  compactChipActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy },
  compactChipText: { fontFamily: type.medium, color: colors.charcoal, fontSize: 11 },
  compactChipTextActive: { color: colors.surface },
  compactStage: { flex: 1, backgroundColor: colors.background },
  sidebar: { width: 300, borderRightWidth: 1, borderRightColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  logo: { fontFamily: type.bold, color: colors.charcoal, fontSize: 30, letterSpacing: -2 },
  kicker: { fontFamily: type.bold, color: colors.burgundy, fontSize: 17 },
  prototypeTag: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  languageButton: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  languageText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  navItem: { minHeight: 58, borderRadius: radius.md, padding: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navItemActive: { backgroundColor: colors.softPink },
  navCopy: { flex: 1 },
  navLabel: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  navLabelActive: { color: colors.burgundy },
  navMeta: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, textTransform: "capitalize" },
  stage: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  stageHeader: { width: "100%", maxWidth: 480, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg },
  stageTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 24 },
  stageMeta: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  statusPill: { borderRadius: radius.pill, backgroundColor: colors.tealSoft, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  statusText: { fontFamily: type.bold, color: colors.teal, fontSize: 12, textTransform: "capitalize" },
  phoneFrame: { alignItems: "center", justifyContent: "center" },
  phone: { width: 390, height: 780, borderRadius: 46, borderWidth: 9, borderColor: colors.charcoal, backgroundColor: colors.background, overflow: "hidden" },
  phoneCompact: { flex: 1, width: "100%", height: "100%", borderRadius: 0, borderWidth: 0 },
  notch: { alignSelf: "center", width: 118, height: 28, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, backgroundColor: colors.charcoal },
  phoneContent: { padding: spacing.lg, paddingBottom: 44, gap: spacing.md },
  phoneContentWithNav: { paddingBottom: 112 },
  homeBar: { position: "absolute", bottom: 10, alignSelf: "center", width: 132, height: 5, borderRadius: 999, backgroundColor: colors.charcoal },
  splash: { minHeight: 705, backgroundColor: colors.burgundy, borderRadius: 28, padding: spacing.xl, justifyContent: "space-between", overflow: "hidden" },
  splashWatermark: { opacity: 0.06, transform: [{ scale: 1.3 }, { translateX: 70 }, { translateY: 40 }] },
  splashGlow: { position: "absolute", right: -70, bottom: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: colors.orange, opacity: 0.9 },
  splashBrand: { width: 124, height: 76, alignSelf: "flex-start" },
  splashCopy: { gap: spacing.md, marginBottom: 92 },
  splashEyebrow: { fontFamily: type.bold, color: colors.peach, fontSize: 14, letterSpacing: 1.1, textTransform: "uppercase" },
  splashTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 46, lineHeight: 47, letterSpacing: -1.6 },
  splashBody: { maxWidth: 280, fontFamily: type.regular, color: colors.surface, fontSize: 16, lineHeight: 24 },
  splashFooter: { fontFamily: type.bold, color: colors.surface, fontSize: 13, opacity: 0.86 },
  onboardingLogo: { width: 120, height: 72, alignSelf: "flex-start" },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 28, lineHeight: 34 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  subtitle: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14 },
  phoneHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logoSmall: { fontFamily: type.bold, color: colors.charcoal, fontSize: 23, letterSpacing: -2 },
  headerTitle: { flex: 1, marginLeft: spacing.md, fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  backTitle: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  heroCard: { minHeight: 220, borderRadius: 30, backgroundColor: colors.burgundy, padding: spacing.xl, overflow: "hidden", justifyContent: "space-between", shadowColor: colors.burgundy, shadowOpacity: 0.28, shadowRadius: 28, shadowOffset: { width: 0, height: 18 }, elevation: 7 },
  heroOrbOne: { position: "absolute", right: -44, top: -34, width: 156, height: 156, borderRadius: 78, backgroundColor: colors.orange, opacity: 0.85 },
  heroOrbTwo: { position: "absolute", right: 42, bottom: -52, width: 126, height: 126, borderRadius: 63, backgroundColor: colors.peach, opacity: 0.22 },
  heroKicker: { fontFamily: type.bold, color: colors.peach, fontSize: 12, letterSpacing: 0.9, textTransform: "uppercase" },
  heroTitle: { maxWidth: 280, fontFamily: type.bold, color: colors.surface, fontSize: 28, lineHeight: 32, letterSpacing: -0.8 },
  heroBody: { maxWidth: 286, fontFamily: type.regular, color: colors.surface, fontSize: 13, lineHeight: 20, opacity: 0.9 },
  heroButton: { alignSelf: "flex-start", minHeight: 42, borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  heroButtonText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  premiumGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  premiumAction: { width: "47%", minHeight: 116, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, justifyContent: "space-between", shadowColor: colors.charcoal, shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 10 }, elevation: 2 },
  premiumActionFeatured: { backgroundColor: colors.charcoal, borderColor: colors.charcoal },
  premiumIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  premiumIconFeatured: { backgroundColor: colors.burgundy },
  premiumActionText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  premiumActionTextFeatured: { color: colors.surface },
  premiumActionMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 },
  premiumActionMetaFeatured: { color: "#CFC8CB" },
  quickTools: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  quickTool: { width: "48%", minHeight: 52, borderRadius: radius.pill, backgroundColor: "#F7EDF2", paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  quickToolText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 12 },
  caseStatus: { borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: colors.charcoal, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 2 },
  progressRing: { width: 54, height: 54, borderRadius: 27, borderWidth: 6, borderColor: colors.teal, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealSoft },
  progressText: { fontFamily: type.bold, color: colors.teal, fontSize: 12 },
  floatingNav: { position: "absolute", left: 18, right: 18, bottom: 22, minHeight: 72, borderRadius: 36, backgroundColor: "rgba(255,255,255,0.92)", borderWidth: 1, borderColor: "rgba(232,226,229,0.9)", flexDirection: "row", alignItems: "center", justifyContent: "space-around", shadowColor: colors.charcoal, shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 9 },
  navBubble: { alignItems: "center", justifyContent: "center", gap: 3, minWidth: 48 },
  navBubbleCenter: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.burgundy, marginTop: -22, shadowColor: colors.burgundy, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  floatingNavText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 9 },
  actionCard: { width: "47%", minHeight: 106, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.md, justifyContent: "space-between" },
  actionText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  primaryButton: { minHeight: 50, borderRadius: radius.md, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg },
  primaryText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
  outlineButton: { minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg, backgroundColor: colors.surface },
  outlineText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  people: { height: 140, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: spacing.md, backgroundColor: colors.tealSoft, borderRadius: radius.lg },
  person: { width: 56, height: 100, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.teal },
  personTall: { height: 124, backgroundColor: colors.burgundy },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 16 },
  caseCard: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.xs },
  toolRow: { flexDirection: "row", gap: spacing.sm },
  search: { minHeight: 46, borderRadius: radius.md, backgroundColor: "#F0EDEF", flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md },
  placeholder: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  category: { width: "30%", borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.md, alignItems: "center" },
  categoryText: { fontFamily: type.medium, color: colors.charcoal, fontSize: 11, textAlign: "center" },
  meta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  listCard: { minHeight: 68, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  listIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  listCopy: { flex: 1 },
  listTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  panel: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.sm },
  cardTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  panelItem: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  warningPanel: { borderRadius: radius.md, backgroundColor: "#FFF7E8", padding: spacing.lg, gap: spacing.sm },
  segment: { flexDirection: "row", borderRadius: radius.pill, backgroundColor: "#F0EDEF", padding: 4 },
  segmentActive: { flex: 1, borderRadius: radius.pill, backgroundColor: colors.surface, textAlign: "center", padding: spacing.sm, fontFamily: type.bold, color: colors.burgundy },
  segmentText: { flex: 1, textAlign: "center", padding: spacing.sm, fontFamily: type.medium, color: colors.inkMuted },
  textBox: { minHeight: 150, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg },
  tabs: { flexDirection: "row", gap: spacing.sm },
  tab: { flex: 1, textAlign: "center", borderBottomWidth: 2, borderBottomColor: colors.line, paddingBottom: spacing.sm, fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  activeTab: { borderBottomColor: colors.burgundy, color: colors.burgundy },
  statusLarge: { alignSelf: "flex-start", borderRadius: radius.pill, backgroundColor: colors.softPink, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  timeline: { gap: spacing.md },
  timelineRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.teal, marginTop: 3 },
  currentDot: { backgroundColor: colors.burgundy },
  message: { maxWidth: "86%", borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, alignSelf: "flex-start" },
  mineMessage: { backgroundColor: colors.burgundy, alignSelf: "flex-end", borderColor: colors.burgundy },
  messageText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  mineMessageText: { color: colors.surface },
  composer: { minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  attachment: { borderRadius: radius.md, backgroundColor: colors.tealSoft, padding: spacing.md, flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  filterChip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: type.medium, color: colors.charcoal, fontSize: 12 },
  paralegalCard: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: type.bold, color: colors.surface, fontSize: 15 },
  rating: { fontFamily: type.bold, color: colors.charcoal, fontSize: 12 },
  uploadBox: { minHeight: 128, borderRadius: radius.md, borderWidth: 1, borderStyle: "dashed", borderColor: colors.burgundy, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  inputGroup: { gap: spacing.xs },
  inputMock: { minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 13 },
  preview: { borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.lg },
  previewText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  summary: { borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  summaryNumber: { fontFamily: type.bold, color: colors.burgundy, fontSize: 28 },
  summaryLabel: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 13 },
  appointmentCard: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  appointmentStatus: { alignSelf: "flex-start", borderRadius: radius.pill, backgroundColor: colors.softPink, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  bookingHero: { borderRadius: 30, backgroundColor: colors.charcoal, padding: spacing.xl, gap: spacing.md },
  bookingTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 27, lineHeight: 31, letterSpacing: -0.7 },
  bookingOption: { minHeight: 76, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  bookingOptionActive: { borderColor: colors.burgundy, backgroundColor: "#FFF8FB" },
  bookingIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  calendarStrip: { flexDirection: "row", gap: spacing.sm },
  dayChip: { flex: 1, minHeight: 70, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", gap: 4 },
  dayChipActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy },
  dayText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 11 },
  dateText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18 },
  dayTextActive: { color: colors.surface },
  safetyHero: { borderRadius: 28, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.md },
  safetyTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 28 },
  safetyText: { fontFamily: type.regular, color: colors.surface, fontSize: 14, lineHeight: 22 },
  identity: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg },
});
