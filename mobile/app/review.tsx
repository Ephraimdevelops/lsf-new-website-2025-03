import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState, type ComponentProps } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, spacing, type } from "../src/theme";

const screens = [
  { id: "cases", icon: "folder-open-outline", en: "My cases", sw: "Kesi zangu" },
  { id: "case-detail", icon: "git-branch-outline", en: "Case details", sw: "Maelezo ya kesi" },
  { id: "request-detail", icon: "file-tray-full-outline", en: "Request progress", sw: "Maendeleo ya ombi" },
  { id: "messages", icon: "chatbubbles-outline", en: "Messages", sw: "Ujumbe" },
  { id: "saved", icon: "bookmark-outline", en: "Saved help", sw: "Huduma nilizohifadhiwa" },
  { id: "documents", icon: "document-text-outline", en: "Documents", sw: "Nyaraka" },
  { id: "appointments", icon: "calendar-outline", en: "Appointments", sw: "Miadi" },
  { id: "notifications", icon: "notifications-outline", en: "Notifications", sw: "Arifa" },
  { id: "account", icon: "person-outline", en: "My account", sw: "Akaunti yangu" },
  { id: "security", icon: "shield-checkmark-outline", en: "Privacy & security", sw: "Faragha na usalama" },
] as const;

type ScreenId = (typeof screens)[number]["id"];
type IconName = ComponentProps<typeof Ionicons>["name"];

export default function ReviewScreen() {
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [selected, setSelected] = useState<ScreenId>("cases");
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedView, setSavedView] = useState<"services" | "guides">("services");
  const [privateAlerts, setPrivateAlerts] = useState(true);
  const [caseUpdates, setCaseUpdates] = useState(true);
  const screen = screens.find((item) => item.id === selected)!;

  function chooseScreen(id: ScreenId) {
    setSelected(id);
    setMenuOpen(false);
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Rudi" : "Back"} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Chagua skrini" : "Choose screen"} accessibilityState={{ expanded: menuOpen }} onPress={() => setMenuOpen(true)} style={styles.selector}>
          <View style={styles.selectorIcon}><Ionicons name={screen.icon} size={19} color={colors.burgundy} /></View>
          <View style={styles.selectorCopy}>
            <Text style={styles.selectorEyebrow}>{sw ? "HAKIKI MUONEKANO" : "SCREEN PREVIEW"}</Text>
            <Text style={styles.selectorTitle} numberOfLines={1}>{sw ? screen.sw : screen.en}</Text>
          </View>
          <Ionicons name="chevron-down" size={19} color={colors.burgundy} />
        </Pressable>
      </View>

      <ScrollView style={styles.pageScroll} contentContainerStyle={styles.pageContent} key={selected}>
        <View style={styles.sampleStrip}>
          <View style={styles.sampleDot} />
          <Text style={styles.sampleStripText}>{sw ? "DATA YA MFANO · HAKUNA KINACHOTUMWA" : "SAMPLE DATA · NO ACTIONS ARE SUBMITTED"}</Text>
          <Ionicons name="eye-outline" size={15} color={colors.teal} />
        </View>
        {selected === "cases" ? <CasesPage sw={sw} /> : null}
        {selected === "case-detail" ? <CaseDetailPage sw={sw} /> : null}
        {selected === "request-detail" ? <RequestPage sw={sw} /> : null}
        {selected === "messages" ? <MessagesPage sw={sw} /> : null}
        {selected === "saved" ? <SavedPage sw={sw} view={savedView} setView={setSavedView} /> : null}
        {selected === "documents" ? <DocumentsPage sw={sw} /> : null}
        {selected === "appointments" ? <AppointmentsPage sw={sw} /> : null}
        {selected === "notifications" ? <NotificationsPage sw={sw} /> : null}
        {selected === "account" ? <AccountPage sw={sw} /> : null}
        {selected === "security" ? <SecurityPage sw={sw} privateAlerts={privateAlerts} setPrivateAlerts={setPrivateAlerts} caseUpdates={caseUpdates} setCaseUpdates={setCaseUpdates} /> : null}
      </ScrollView>

      <Modal visible={menuOpen} animationType="fade" transparent statusBarTranslucent onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} accessibilityLabel={sw ? "Funga menyu" : "Close menu"} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuPanel}>
            <View style={styles.menuHeader}>
              <View><Text style={styles.menuEyebrow}>{sw ? "SKRINI ZA AKAUNTI" : "ACCOUNT SCREENS"}</Text><Text style={styles.menuTitle}>{sw ? "Chagua skrini" : "Choose a screen"}</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} onPress={() => setMenuOpen(false)} style={styles.closeButton}><Ionicons name="close" size={20} color={colors.ink} /></Pressable>
            </View>
            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
              {screens.map((item) => {
                const active = item.id === selected;
                return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => chooseScreen(item.id)} style={[styles.menuItem, active && styles.menuItemActive]}>
                  <View style={[styles.menuItemIcon, active && styles.menuItemIconActive]}><Ionicons name={item.icon} size={19} color={active ? colors.burgundy : colors.inkMuted} /></View>
                  <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>{sw ? item.sw : item.en}</Text>
                  {active ? <Ionicons name="checkmark" size={19} color={colors.burgundy} /> : <Ionicons name="chevron-forward" size={17} color={colors.inkMuted} />}
                </Pressable>;
              })}
            </ScrollView>
            <Text style={styles.menuNote}>{sw ? "Mifano hii ni ya kubuniwa. Taarifa binafsi zinahitaji kuingia." : "Examples are fictional. Personal records require sign-in."}</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function PageTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return <View style={styles.pageTitleBlock}><Text style={styles.pageEyebrow}>{eyebrow}</Text><Text style={styles.pageTitle}>{title}</Text>{detail ? <Text style={styles.pageLead}>{detail}</Text> : null}</View>;
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Text style={styles.sectionAction}>{action}</Text> : null}</View>;
}

function IconBox({ name, tone = "pink" }: { name: IconName; tone?: "pink" | "teal" | "gold" | "orange" }) {
  return <View style={[styles.iconBox, styles[`tone_${tone}`]]}><Ionicons name={name} size={20} color={tone === "teal" ? colors.teal : colors.burgundy} /></View>;
}

function CasesPage({ sw }: { sw: boolean }) {
  return <>
    <PageTitle eyebrow={sw ? "HATUA ZAKO" : "YOUR LEGAL JOURNEY"} title={sw ? "Kesi na maombi" : "Cases & requests"} detail={sw ? "Angalia hali ya maombi yako na hatua inayofuata." : "See where your requests stand and what happens next."} />
    <View style={styles.filterRow}><Text style={styles.filterActive}>{sw ? "Zinazoendelea" : "In progress"}</Text><Text style={styles.filterInactive}>{sw ? "Zilizofungwa" : "Closed"}</Text><Text style={styles.filterCount}>2</Text></View>
    <Pressable style={styles.featureCase}>
      <View style={styles.featureTop}><Text style={styles.caseNumber}>HYG-2048</Text><View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>{sw ? "Inakaguliwa" : "Under review"}</Text></View></View>
      <Text style={styles.featureTitle}>{sw ? "Malipo ya mshahara" : "Unpaid salary"}</Text>
      <Text style={styles.featureDetail}>{sw ? "Ombi limepokelewa 18 Septemba 2026" : "Request received 18 September 2026"}</Text>
      <View style={styles.progressTrack}><View style={styles.progressDone} /><View style={styles.progressCurrent} /><View style={styles.progressTodo} /><View style={styles.progressTodo} /></View>
      <View style={styles.progressLabels}><Text style={styles.progressLabel}>{sw ? "Imepokelewa" : "Received"}</Text><Text style={styles.progressLabel}>{sw ? "Mapitio" : "Review"}</Text><Text style={styles.progressLabel}>{sw ? "Hatua" : "Next step"}</Text></View>
      <View style={styles.featureDivider} />
      <View style={styles.nextStepRow}><View style={styles.nextStepIcon}><Ionicons name="time-outline" size={17} color={colors.burgundy} /></View><Text style={styles.nextStepText}>{sw ? "Timu inakagua taarifa ulizotuma" : "The team is reviewing your information"}</Text><Ionicons name="chevron-forward" size={18} color={colors.burgundy} /></View>
    </Pressable>
    <SectionTitle title={sw ? "Ombi lingine" : "Another request"} />
    <View style={styles.secondaryCase}>
      <IconBox name="home-outline" tone="teal" />
      <View style={styles.flexCopy}><Text style={styles.rowTitle}>{sw ? "Mkataba wa upangaji" : "Tenancy agreement"}</Text><Text style={styles.rowDetail}>HYG-1972 · {sw ? "Imekamilika 4 Septemba" : "Closed 4 September"}</Text></View>
      <Ionicons name="chevron-forward" size={19} color={colors.inkMuted} />
    </View>
    <View style={styles.helpBand}><Ionicons name="shield-checkmark-outline" size={20} color={colors.teal} /><Text style={styles.helpBandText}>{sw ? "Taarifa zako huonekana kwako na kwa timu iliyoidhinishwa pekee." : "Your case information is visible only to you and your authorised team."}</Text></View>
  </>;
}

function CaseDetailPage({ sw }: { sw: boolean }) {
  return <>
    <View style={styles.detailHero}>
      <View style={styles.detailHeroTop}><Text style={styles.detailId}>HYG-2048</Text><Text style={styles.detailStatus}>{sw ? "Inaendelea" : "Active"}</Text></View>
      <Text style={styles.detailHeroTitle}>{sw ? "Kutopokea mshahara" : "Unpaid salary"}</Text>
      <Text style={styles.detailHeroCopy}>{sw ? "Ombi la msaada wa ajira" : "Employment support request"}</Text>
      <View style={styles.detailMeta}><Text style={styles.detailMetaText}>{sw ? "Ilifunguliwa 18 Septemba 2026" : "Opened 18 September 2026"}</Text><Text style={styles.detailMetaText}>·</Text><Text style={styles.detailMetaText}>{sw ? "Timu ya LSF" : "LSF case team"}</Text></View>
    </View>
    <View style={styles.detailTabs}><Text style={styles.detailTabActive}>{sw ? "Muhtasari" : "Overview"}</Text><Text style={styles.detailTab}>{sw ? "Ujumbe" : "Messages"}</Text><Text style={styles.detailTab}>{sw ? "Nyaraka" : "Files"}</Text></View>
    <SectionTitle title={sw ? "Hatua za kesi" : "Case timeline"} action="3" />
    <View style={styles.timeline}>
      <TimelineItem done title={sw ? "Ombi limepokelewa" : "Request received"} detail={sw ? "18 Septemba · Saa 09:14" : "18 September · 9:14 AM"} />
      <TimelineItem current title={sw ? "Mapitio ya awali" : "Initial review"} detail={sw ? "Timu inakagua maelezo ya ombi" : "The team is reviewing your request"} />
      <TimelineItem title={sw ? "Hatua inayofuata" : "Next step"} detail={sw ? "Tutakujulisha hapa" : "We will update you here"} last />
    </View>
    <View style={styles.nextCard}><Text style={styles.nextEyebrow}>{sw ? "UNACHOWEZA KUFANYA" : "YOUR NEXT STEP"}</Text><Text style={styles.nextTitle}>{sw ? "Andaa nyaraka za malipo" : "Gather payment records"}</Text><Text style={styles.nextDetail}>{sw ? "Kama unazo, zihifadhi kabla ya timu kukuomba." : "Keep any records ready in case your case team requests them."}</Text><View style={styles.nextAction}><Ionicons name="folder-open-outline" size={17} color={colors.burgundy} /><Text style={styles.nextActionText}>{sw ? "Nyaraka zangu" : "My documents"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></View></View>
  </>;
}

function TimelineItem({ title, detail, done, current, last }: { title: string; detail: string; done?: boolean; current?: boolean; last?: boolean }) {
  return <View style={styles.timelineItem}><View style={styles.timelineRail}><View style={[styles.timelineNode, done && styles.timelineNodeDone, current && styles.timelineNodeCurrent]}>{done ? <Ionicons name="checkmark" size={12} color={colors.surface} /> : current ? <View style={styles.timelineNodeInner} /> : null}</View>{!last ? <View style={styles.timelineLine} /> : null}</View><View style={styles.timelineCopy}><Text style={[styles.timelineTitle, current && styles.timelineCurrentText]}>{title}</Text><Text style={styles.timelineDetail}>{detail}</Text></View>{current ? <Text style={styles.liveTag}>NOW</Text> : null}</View>;
}

function RequestPage({ sw }: { sw: boolean }) {
  return <>
    <PageTitle eyebrow={sw ? "OMBI LAKO" : "YOUR REQUEST"} title={sw ? "Maendeleo ya ombi" : "Request progress"} detail={sw ? "Tunaonyesha kilichotokea na kinachofuata." : "A clear record of what has happened and what comes next."} />
    <View style={styles.requestTop}><View style={styles.requestGlyph}><Ionicons name="document-text-outline" size={23} color={colors.burgundy} /></View><View style={styles.flexCopy}><Text style={styles.requestRef}>HYG-2048</Text><Text style={styles.rowDetail}>{sw ? "Imetumwa 18 Septemba 2026" : "Submitted 18 September 2026"}</Text></View><View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>{sw ? "Inapitiwa" : "Reviewing"}</Text></View></View>
    <View style={styles.requestProgress}><Text style={styles.progressTitle}>{sw ? "Mapitio ya timu" : "Team review"}</Text><Text style={styles.progressPercent}>2/4</Text><View style={styles.requestProgressTrack}><View style={styles.requestProgressFill} /></View><Text style={styles.rowDetail}>{sw ? "Hatua inayofuata: taarifa zaidi au uelekezaji" : "Next: request for details or referral"}</Text></View>
    <SectionTitle title={sw ? "Muhtasari wa ombi" : "Request summary"} />
    <View style={styles.summaryPanel}><SummaryRow label={sw ? "Eneo" : "Topic"} value={sw ? "Ajira" : "Employment"} /><SummaryRow label={sw ? "Unahitaji" : "Support"} value={sw ? "Ushauri wa kisheria" : "Legal guidance"} /><SummaryRow label={sw ? "Mahali" : "Location"} value="Ilala, Dar es Salaam" last /></View>
    <SectionTitle title={sw ? "Historia" : "Activity"} />
    <View style={styles.activityRow}><View style={styles.activityCheck}><Ionicons name="checkmark" size={14} color={colors.surface} /></View><View style={styles.flexCopy}><Text style={styles.rowTitle}>{sw ? "Ombi limepokelewa" : "Request received"}</Text><Text style={styles.rowDetail}>{sw ? "18 Septemba · 09:14" : "18 September · 9:14 AM"}</Text></View></View>
    <View style={styles.activityRow}><View style={styles.activityPending}><Ionicons name="search-outline" size={14} color={colors.burgundy} /></View><View style={styles.flexCopy}><Text style={styles.rowTitle}>{sw ? "Mapitio yameanza" : "Review started"}</Text><Text style={styles.rowDetail}>{sw ? "20 Septemba · 11:06" : "20 September · 11:06 AM"}</Text></View></View>
  </>;
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.summaryRow, last && styles.summaryRowLast]}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>;
}

function MessagesPage({ sw }: { sw: boolean }) {
  return <>
    <View style={styles.messageCaseHeader}><IconBox name="briefcase-outline" tone="pink" /><View style={styles.flexCopy}><Text style={styles.rowTitle}>{sw ? "Kesi ya mshahara" : "Unpaid salary case"}</Text><Text style={styles.rowDetail}>HYG-2048 · {sw ? "Timu ya LSF" : "LSF case team"}</Text></View><View style={styles.onlineDot} /></View>
    <View style={styles.dateDivider}><View style={styles.dateLine} /><Text style={styles.dateText}>{sw ? "LEO · 20 SEPTEMBA" : "TODAY · 20 SEPTEMBER"}</Text><View style={styles.dateLine} /></View>
    <View style={styles.messageReceived}><View style={styles.senderRow}><View style={styles.senderAvatar}><Text style={styles.senderInitial}>L</Text></View><Text style={styles.senderName}>{sw ? "Timu ya kesi ya LSF" : "LSF case team"}</Text><Text style={styles.messageTime}>10:42</Text></View><Text style={styles.messageBody}>{sw ? "Tafadhali hifadhi rekodi zozote za malipo na mkataba wako wa ajira. Tutakujulisha kama tutahitaji nakala." : "Please keep any payment records and your employment agreement. We will let you know if we need a copy."}</Text></View>
    <View style={styles.messageSent}><Text style={styles.messageBodySent}>{sw ? "Nina ujumbe wa malipo kutoka benki." : "I have the payment messages from my bank."}</Text><Text style={styles.messageTimeSent}>{sw ? "Wewe · 10:49 · Imewasilishwa" : "You · 10:49 · Delivered"}</Text></View>
    <View style={styles.messageReceived}><View style={styles.senderRow}><View style={styles.senderAvatar}><Text style={styles.senderInitial}>L</Text></View><Text style={styles.senderName}>{sw ? "Timu ya kesi ya LSF" : "LSF case team"}</Text><Text style={styles.messageTime}>11:03</Text></View><Text style={styles.messageBody}>{sw ? "Asante. Unaweza kuongeza nyaraka hizo kwenye sehemu ya Nyaraka za kesi yako." : "Thank you. You can add those files in the Documents section of your case."}</Text></View>
    <View style={styles.messageNotice}><Ionicons name="lock-closed-outline" size={15} color={colors.teal} /><Text style={styles.noticeText}>{sw ? "Mazungumzo haya yanaonekana kwako na kwa timu ya kesi pekee." : "Only you and your case team can see this conversation."}</Text></View>
  </>;
}

function SavedPage({ sw, view, setView }: { sw: boolean; view: "services" | "guides"; setView: (view: "services" | "guides") => void }) {
  return <>
    <PageTitle eyebrow={sw ? "MAHALI ULIPOHIFADHI" : "YOUR SHORTLIST"} title={sw ? "Huduma nilizohifadhiwa" : "Saved help"} detail={sw ? "Rudi kwenye huduma na miongozo uliyochagua." : "Keep useful services and guides close at hand."} />
    <View style={styles.segment}><Pressable onPress={() => setView("services")} style={[styles.segmentOption, view === "services" && styles.segmentOptionActive]}><Text style={[styles.segmentText, view === "services" && styles.segmentTextActive]}>{sw ? "Huduma 2" : "Services 2"}</Text></Pressable><Pressable onPress={() => setView("guides")} style={[styles.segmentOption, view === "guides" && styles.segmentOptionActive]}><Text style={[styles.segmentText, view === "guides" && styles.segmentTextActive]}>{sw ? "Miongozo 3" : "Guides 3"}</Text></Pressable></View>
    {view === "services" ? <>
      <View style={styles.serviceSaved}><View style={styles.serviceSavedTop}><IconBox name="business-outline" tone="teal" /><Text style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.teal} /> {sw ? "Imethibitishwa" : "Verified"}</Text></View><Text style={styles.serviceName}>{sw ? "Kituo cha msaada wa kisheria" : "Legal aid service"}</Text><Text style={styles.serviceLocation}><Ionicons name="location-outline" size={14} color={colors.inkMuted} /> Ilala · Dar es Salaam</Text><View style={styles.serviceTags}><Text style={styles.serviceTag}>{sw ? "Ajira" : "Employment"}</Text><Text style={styles.serviceTag}>{sw ? "Familia" : "Family"}</Text></View><View style={styles.serviceFooter}><Text style={styles.savedWhen}>{sw ? "Imehifadhiwa 19 Septemba" : "Saved 19 September"}</Text><Ionicons name="bookmark" size={19} color={colors.burgundy} /></View></View>
      <View style={styles.serviceSaved}><View style={styles.serviceSavedTop}><IconBox name="business-outline" tone="gold" /><Text style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.teal} /> {sw ? "Imethibitishwa" : "Verified"}</Text></View><Text style={styles.serviceName}>{sw ? "Huduma ya ushauri wa jamii" : "Community advice service"}</Text><Text style={styles.serviceLocation}><Ionicons name="location-outline" size={14} color={colors.inkMuted} /> Kinondoni · Dar es Salaam</Text><View style={styles.serviceTags}><Text style={styles.serviceTag}>{sw ? "Ardhi" : "Land"}</Text><Text style={styles.serviceTag}>{sw ? "Mikataba" : "Contracts"}</Text></View><View style={styles.serviceFooter}><Text style={styles.savedWhen}>{sw ? "Imehifadhiwa 14 Septemba" : "Saved 14 September"}</Text><Ionicons name="bookmark" size={19} color={colors.burgundy} /></View></View>
    </> : <>
      <GuideRow sw={sw} icon="cash-outline" title={sw ? "Hatua za kufuatilia mshahara" : "Following up unpaid wages"} category={sw ? "AJIRA · DAKIKA 5" : "EMPLOYMENT · 5 MIN"} />
      <GuideRow sw={sw} icon="home-outline" title={sw ? "Kukagua mkataba wa upangaji" : "Check a tenancy agreement"} category={sw ? "ARDHI · DAKIKA 6" : "LAND · 6 MIN"} />
      <GuideRow sw={sw} icon="shield-outline" title={sw ? "Mpango mfupi wa usalama" : "A short safety plan"} category={sw ? "USALAMA · DAKIKA 4" : "SAFETY · 4 MIN"} />
    </>}
    <View style={styles.sampleNote}><Ionicons name="information-circle-outline" size={17} color={colors.inkMuted} /><Text style={styles.sampleNoteText}>{sw ? "Huduma zilizoonyeshwa hapa ni za mfano." : "Services shown here are fictional examples."}</Text></View>
  </>;
}

function GuideRow({ sw, icon, title, category }: { sw: boolean; icon: IconName; title: string; category: string }) {
  return <View style={styles.guideRow}><IconBox name={icon} tone="orange" /><View style={styles.flexCopy}><Text style={styles.guideCategory}>{category}</Text><Text style={styles.guideTitle}>{title}</Text><Text style={styles.guideRead}>{sw ? "Mwongozo mfupi wa vitendo" : "A practical step-by-step guide"}</Text></View><Ionicons name="bookmark" size={18} color={colors.burgundy} /></View>;
}

function DocumentsPage({ sw }: { sw: boolean }) {
  return <>
    <PageTitle eyebrow={sw ? "HIFADHI YA KESI" : "CASE FILES"} title={sw ? "Nyaraka" : "Documents"} detail={sw ? "Faili ulizoshiriki na timu yako ya kesi." : "Files shared with your authorised case team."} />
    <View style={styles.storageCard}><View style={styles.storageIcon}><Ionicons name="folder-open-outline" size={21} color={colors.surface} /></View><View style={styles.flexCopy}><Text style={styles.storageTitle}>{sw ? "Nyaraka za kesi" : "Case documents"}</Text><Text style={styles.storageDetail}>2 {sw ? "faili · HYG-2048" : "files · HYG-2048"}</Text></View><Ionicons name="ellipsis-horizontal" size={19} color={colors.surface} /></View>
    <View style={styles.documentFilter}><Text style={styles.filterActive}>{sw ? "Zote" : "All files"}</Text><Text style={styles.filterInactive}>{sw ? "Inapitiwa" : "In review"}</Text><Text style={styles.filterInactive}>{sw ? "Zimekubaliwa" : "Accepted"}</Text></View>
    <DocumentRow icon="document-text-outline" title="Mkataba_wa_ajira.pdf" meta={sw ? "PDF · 1.2 MB · 18 Septemba" : "PDF · 1.2 MB · 18 September"} status={sw ? "Inapitiwa" : "In review"} tone="pink" />
    <DocumentRow icon="image-outline" title="Rekodi_ya_malipo.jpg" meta={sw ? "Picha · 840 KB · 18 Septemba" : "Image · 840 KB · 18 September"} status={sw ? "Imepokelewa" : "Received"} tone="teal" />
    <View style={styles.uploadHint}><Ionicons name="lock-closed-outline" size={17} color={colors.teal} /><Text style={styles.noticeText}>{sw ? "Faili zako ni za faragha. Skrini hii ya mfano haihifadhi au kufungua faili." : "Your files are private. This preview does not store or open files."}</Text></View>
  </>;
}

function DocumentRow({ icon, title, meta, status, tone }: { icon: IconName; title: string; meta: string; status: string; tone: "pink" | "teal" }) {
  return <View style={styles.documentRow}><IconBox name={icon} tone={tone} /><View style={styles.flexCopy}><Text style={styles.documentName}>{title}</Text><Text style={styles.rowDetail}>{meta}</Text><Text style={styles.documentStatus}><View style={styles.smallStatusDot} /> {status}</Text></View><Ionicons name="ellipsis-vertical" size={18} color={colors.inkMuted} /></View>;
}

function AppointmentsPage({ sw }: { sw: boolean }) {
  return <>
    <PageTitle eyebrow={sw ? "MIPANGO YAKO" : "YOUR SCHEDULE"} title={sw ? "Miadi" : "Appointments"} detail={sw ? "Miadi inayohusiana na kesi zako." : "Meetings connected to your support."} />
    <View style={styles.calendarHeader}><Text style={styles.calendarMonth}>{sw ? "SEPTEMBA 2026" : "SEPTEMBER 2026"}</Text><View style={styles.calendarArrows}><Ionicons name="chevron-back" size={17} color={colors.inkMuted} /><Ionicons name="chevron-forward" size={17} color={colors.inkMuted} /></View></View>
    <View style={styles.weekRow}>{(sw ? ["J", "J", "J", "A", "I", "J", "J"] : ["M", "T", "W", "T", "F", "S", "S"]).map((day, i) => <View key={`${day}-${i}`} style={styles.weekCell}><Text style={styles.weekDay}>{day}</Text><View style={[styles.weekDate, i === 2 && styles.weekDateActive]}><Text style={[styles.weekDateText, i === 2 && styles.weekDateTextActive]}>{18 + i}</Text></View></View>)}</View>
    <SectionTitle title={sw ? "Miadi ijayo" : "Upcoming"} action="1" />
    <View style={styles.appointmentCard}><View style={styles.appointmentDate}><Text style={styles.appointmentMonth}>{sw ? "SEP" : "SEP"}</Text><Text style={styles.appointmentDay}>30</Text><Text style={styles.appointmentWeekday}>{sw ? "Jumatano" : "WED"}</Text></View><View style={styles.appointmentDivider} /><View style={styles.appointmentCopy}><View style={styles.appointmentStatus}><View style={styles.statusDot} /><Text style={styles.statusText}>{sw ? "Imeombwa" : "Requested"}</Text></View><Text style={styles.appointmentTitle}>{sw ? "Ushauri wa msaada wa kisheria" : "Legal aid consultation"}</Text><Text style={styles.appointmentMeta}><Ionicons name="time-outline" size={13} color={colors.inkMuted} /> 10:30 · 45 {sw ? "dakika" : "min"}</Text><Text style={styles.appointmentMeta}><Ionicons name="location-outline" size={13} color={colors.inkMuted} /> Ilala · Dar es Salaam</Text></View></View>
    <View style={styles.appointmentNotice}><Ionicons name="information-circle-outline" size={18} color={colors.warning} /><Text style={styles.appointmentNoticeText}>{sw ? "Muda haujathibitishwa. Subiri ujumbe kutoka kwa timu yako." : "Time is not confirmed. Wait for your case team to reply."}</Text></View>
    <SectionTitle title={sw ? "Zilizopita" : "Past"} /><View style={styles.pastAppointment}><Ionicons name="checkmark-circle-outline" size={20} color={colors.teal} /><View style={styles.flexCopy}><Text style={styles.rowTitle}>{sw ? "Mazungumzo ya awali" : "Initial consultation"}</Text><Text style={styles.rowDetail}>{sw ? "12 Septemba · Imekamilika" : "12 September · Completed"}</Text></View><Ionicons name="chevron-forward" size={17} color={colors.inkMuted} /></View>
  </>;
}

function NotificationsPage({ sw }: { sw: boolean }) {
  return <>
    <PageTitle eyebrow={sw ? "TAARIFA ZA AKAUNTI" : "ACCOUNT UPDATES"} title={sw ? "Arifa" : "Notifications"} detail={sw ? "Taarifa kuhusu kesi, ujumbe na miadi yako." : "Updates about your cases, messages, and appointments."} />
    <View style={styles.notificationSummary}><View><Text style={styles.unreadNumber}>2</Text><Text style={styles.unreadLabel}>{sw ? "hazijasomwa" : "unread"}</Text></View><View style={styles.unreadDivider} /><Text style={styles.summaryHint}>{sw ? "Arifa mpya zinaonekana kwanza." : "Your newest updates appear first."}</Text><Ionicons name="notifications-outline" size={22} color={colors.burgundy} /></View>
    <SectionTitle title={sw ? "Leo" : "Today"} />
    <NotificationRow unread icon="chatbubble-ellipses-outline" title={sw ? "Ujumbe mpya kwenye kesi yako" : "New case message"} detail={sw ? "Timu ya kesi ya LSF imejibu HYG-2048." : "Your LSF case team replied to HYG-2048."} time="11:03" tone="pink" />
    <NotificationRow unread icon="calendar-outline" title={sw ? "Ombi la miadi limepokelewa" : "Appointment request received"} detail={sw ? "Subiri uthibitisho wa muda." : "Waiting for a time confirmation."} time="09:16" tone="gold" />
    <SectionTitle title={sw ? "Jana" : "Yesterday"} />
    <NotificationRow icon="folder-outline" title={sw ? "Nyaraka zimeongezwa" : "Documents added"} detail={sw ? "Faili 2 zimeunganishwa na HYG-2048." : "2 files were attached to HYG-2048."} time={sw ? "Jana" : "Yesterday"} tone="teal" />
    <NotificationRow icon="checkmark-circle-outline" title={sw ? "Ombi limepokelewa" : "Request received"} detail={sw ? "Namba yako ya kumbukumbu ni HYG-2048." : "Your reference number is HYG-2048."} time={sw ? "Jana" : "Yesterday"} tone="orange" />
  </>;
}

function NotificationRow({ unread, icon, title, detail, time, tone }: { unread?: boolean; icon: IconName; title: string; detail: string; time: string; tone: "pink" | "gold" | "teal" | "orange" }) {
  return <View style={[styles.notificationRow, unread && styles.notificationUnread]}><IconBox name={icon} tone={tone} /><View style={styles.flexCopy}><Text style={styles.notificationTitle}>{title}</Text><Text style={styles.notificationDetail}>{detail}</Text><Text style={styles.notificationTime}>{time}</Text></View>{unread ? <View style={styles.unreadDot} /> : null}</View>;
}

function AccountPage({ sw }: { sw: boolean }) {
  return <>
    <View style={styles.accountHero}><View style={styles.accountAvatar}><Text style={styles.accountInitials}>AM</Text></View><View style={styles.flexCopy}><Text style={styles.accountName}>{sw ? "Amina M." : "Amina M."}</Text><Text style={styles.accountType}>{sw ? "Mnufaika · Akaunti ya mfano" : "Beneficiary · Sample account"}</Text></View><Ionicons name="create-outline" size={20} color={colors.surface} /></View>
    <View style={styles.accountSummary}><View style={styles.accountStat}><Text style={styles.accountStatValue}>2</Text><Text style={styles.accountStatLabel}>{sw ? "Maombi" : "Requests"}</Text></View><View style={styles.accountStatDivider} /><View style={styles.accountStat}><Text style={styles.accountStatValue}>3</Text><Text style={styles.accountStatLabel}>{sw ? "Miongozo" : "Saved guides"}</Text></View><View style={styles.accountStatDivider} /><View style={styles.accountStat}><Text style={styles.accountStatValue}>{sw ? "SW" : "EN"}</Text><Text style={styles.accountStatLabel}>{sw ? "Lugha" : "Language"}</Text></View></View>
    <SectionTitle title={sw ? "Mapendeleo" : "Preferences"} />
    <AccountRow icon="language-outline" title={sw ? "Lugha ya programu" : "App language"} detail={sw ? "Kiswahili" : "English"} />
    <AccountRow icon="notifications-outline" title={sw ? "Arifa" : "Notifications"} detail={sw ? "Mipangilio ya taarifa" : "Manage updates"} />
    <AccountRow icon="bookmark-outline" title={sw ? "Vilivyohifadhiwa" : "Saved items"} detail={sw ? "Huduma na miongozo" : "Services and guides"} />
    <SectionTitle title={sw ? "Msaada na usalama" : "Help & security"} />
    <AccountRow icon="shield-checkmark-outline" title={sw ? "Faragha na usalama" : "Privacy & security"} detail={sw ? "Udhibiti wa akaunti yako" : "Control your account"} />
    <AccountRow icon="help-circle-outline" title={sw ? "Msaada" : "Get help"} detail={sw ? "Wasiliana na timu yetu" : "Contact our support team"} />
    <View style={styles.demoAccountNotice}><Ionicons name="information-circle-outline" size={17} color={colors.teal} /><Text style={styles.noticeText}>{sw ? "Wasifu huu ni wa mfano. Maelezo binafsi hayajaonyeshwa." : "This is a sample profile. Personal contact details are not shown."}</Text></View>
  </>;
}

function AccountRow({ icon, title, detail }: { icon: IconName; title: string; detail: string }) {
  return <View style={styles.accountRow}><IconBox name={icon} tone="pink" /><View style={styles.flexCopy}><Text style={styles.accountRowTitle}>{title}</Text><Text style={styles.accountRowDetail}>{detail}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></View>;
}

function SecurityPage({ sw, privateAlerts, setPrivateAlerts, caseUpdates, setCaseUpdates }: { sw: boolean; privateAlerts: boolean; setPrivateAlerts: (value: boolean) => void; caseUpdates: boolean; setCaseUpdates: (value: boolean) => void }) {
  return <>
    <PageTitle eyebrow={sw ? "UDHIBITI WA AKAUNTI" : "ACCOUNT CONTROLS"} title={sw ? "Faragha na usalama" : "Privacy & security"} detail={sw ? "Chagua jinsi akaunti na taarifa zako zinavyolindwa." : "Choose how your account and updates are protected."} />
    <View style={styles.securityShield}><View style={styles.shieldIcon}><Ionicons name="shield-checkmark" size={27} color={colors.teal} /></View><View style={styles.flexCopy}><Text style={styles.shieldTitle}>{sw ? "Akaunti inalindwa" : "Account protected"}</Text><Text style={styles.shieldDetail}>{sw ? "Mipangilio hii ni mfano wa ndani ya kifaa." : "These preview settings stay on this device."}</Text></View><View style={styles.shieldCheck}><Ionicons name="checkmark" size={15} color={colors.surface} /></View></View>
    <SectionTitle title={sw ? "Arifa za faragha" : "Private notifications"} />
    <View style={styles.settingRow}><IconBox name="eye-off-outline" tone="teal" /><View style={styles.flexCopy}><Text style={styles.settingTitle}>{sw ? "Ficha maelezo kwenye arifa" : "Hide details in notifications"}</Text><Text style={styles.settingDetail}>{sw ? "Onyesha kuwa kuna taarifa bila maelezo ya kesi." : "Show an update without exposing case details."}</Text></View><Switch value={privateAlerts} onValueChange={setPrivateAlerts} trackColor={{ false: "#D7D3D5", true: colors.teal }} thumbColor={colors.surface} /></View>
    <View style={styles.settingRow}><IconBox name="chatbubble-ellipses-outline" tone="pink" /><View style={styles.flexCopy}><Text style={styles.settingTitle}>{sw ? "Taarifa za kesi" : "Case updates"}</Text><Text style={styles.settingDetail}>{sw ? "Pata taarifa kuhusu ujumbe na hatua." : "Get updates about messages and progress."}</Text></View><Switch value={caseUpdates} onValueChange={setCaseUpdates} trackColor={{ false: "#D7D3D5", true: colors.teal }} thumbColor={colors.surface} /></View>
    <SectionTitle title={sw ? "Ufikiaji wa akaunti" : "Account access"} />
    <View style={styles.securityRow}><IconBox name="key-outline" tone="gold" /><View style={styles.flexCopy}><Text style={styles.settingTitle}>{sw ? "Njia ya kuingia" : "Sign-in method"}</Text><Text style={styles.settingDetail}>{sw ? "Thibitisho la akaunti" : "Account verification"}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></View>
    <View style={styles.securityRow}><IconBox name="phone-portrait-outline" tone="orange" /><View style={styles.flexCopy}><Text style={styles.settingTitle}>{sw ? "Vifaa vilivyounganishwa" : "Signed-in devices"}</Text><Text style={styles.settingDetail}>{sw ? "Kifaa hiki" : "This device"}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></View>
    <View style={styles.securityFooter}><Ionicons name="lock-closed-outline" size={16} color={colors.inkMuted} /><Text style={styles.securityFooterText}>{sw ? "Skrini ya mfano. Mabadiliko hayatumwi kwenye akaunti halisi." : "Preview only. Changes are not sent to a real account."}</Text></View>
  </>;
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 16, paddingBottom: 8 },
  topBar: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 4, marginBottom: 2 },
  backButton: { width: 40, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  selector: { flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 9, borderRadius: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  selectorIcon: { width: 32, height: 32, borderRadius: 7, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  selectorCopy: { flex: 1 },
  selectorEyebrow: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 9 },
  selectorTitle: { marginTop: 1, fontFamily: type.bold, color: colors.ink, fontSize: 14 },
  sampleStrip: { height: 30, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 9, borderRadius: 5, backgroundColor: colors.tealSoft, marginTop: 8, marginBottom: 3 },
  sampleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  sampleStripText: { flex: 1, fontFamily: type.bold, color: colors.teal, fontSize: 9 },
  pageScroll: { flex: 1 },
  pageContent: { paddingBottom: 30 },
  pageTitleBlock: { paddingTop: 14, paddingBottom: 16 },
  pageEyebrow: { fontFamily: type.bold, color: colors.burgundy, fontSize: 10 },
  pageTitle: { marginTop: 4, fontFamily: type.bold, color: colors.ink, fontSize: 27, lineHeight: 32 },
  pageLead: { marginTop: 5, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  filterRow: { minHeight: 42, flexDirection: "row", alignItems: "center", gap: 18, borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 13 },
  filterActive: { height: 42, paddingTop: 11, borderBottomWidth: 2, borderBottomColor: colors.burgundy, fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  filterInactive: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  filterCount: { marginLeft: "auto", fontFamily: type.bold, color: colors.inkMuted, fontSize: 11 },
  featureCase: { padding: 15, borderRadius: 8, backgroundColor: colors.burgundy },
  featureTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  caseNumber: { fontFamily: type.bold, color: "#F8DDE6", fontSize: 10 },
  statusPill: { minHeight: 25, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, borderRadius: 4, backgroundColor: "#FCE9C8" },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  statusText: { fontFamily: type.bold, color: colors.warning, fontSize: 10 },
  featureTitle: { marginTop: 14, fontFamily: type.bold, color: colors.surface, fontSize: 21 },
  featureDetail: { marginTop: 3, fontFamily: type.regular, color: "#F5D9E2", fontSize: 11 },
  progressTrack: { height: 5, flexDirection: "row", gap: 4, marginTop: 17 },
  progressDone: { flex: 1, borderRadius: 3, backgroundColor: colors.surface },
  progressCurrent: { flex: 1, borderRadius: 3, backgroundColor: colors.gold },
  progressTodo: { flex: 1, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  progressLabel: { fontFamily: type.medium, color: "#F5D9E2", fontSize: 9 },
  featureDivider: { height: 1, marginTop: 14, backgroundColor: "rgba(255,255,255,0.22)" },
  nextStepRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 8 },
  nextStepIcon: { width: 27, height: 27, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  nextStepText: { flex: 1, fontFamily: type.medium, color: colors.surface, fontSize: 11, lineHeight: 16 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 21, marginBottom: 9 },
  sectionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 16 },
  sectionAction: { fontFamily: type.medium, color: colors.burgundy, fontSize: 11 },
  secondaryCase: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: colors.line },
  iconBox: { width: 40, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  tone_pink: { backgroundColor: colors.burgundySoft },
  tone_teal: { backgroundColor: colors.tealSoft },
  tone_gold: { backgroundColor: colors.goldSoft },
  tone_orange: { backgroundColor: colors.orangeSoft },
  flexCopy: { flex: 1 },
  rowTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 13 },
  rowDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  helpBand: { marginTop: 16, padding: 11, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: colors.tealSoft, borderLeftWidth: 3, borderLeftColor: colors.teal },
  helpBandText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 11, lineHeight: 16 },
  detailHero: { marginTop: 7, padding: 16, borderRadius: 8, backgroundColor: colors.burgundy },
  detailHeroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  detailId: { fontFamily: type.bold, color: "#F4D8E0", fontSize: 11 },
  detailStatus: { fontFamily: type.bold, color: colors.surface, fontSize: 11 },
  detailHeroTitle: { marginTop: 17, fontFamily: type.bold, color: colors.surface, fontSize: 23 },
  detailHeroCopy: { marginTop: 3, fontFamily: type.regular, color: "#F4D8E0", fontSize: 12 },
  detailMeta: { marginTop: 18, flexDirection: "row", gap: 7 },
  detailMetaText: { fontFamily: type.medium, color: "#F4D8E0", fontSize: 10 },
  detailTabs: { height: 46, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.line },
  detailTabActive: { height: 46, paddingTop: 14, borderBottomWidth: 2, borderBottomColor: colors.burgundy, color: colors.burgundy, fontFamily: type.bold, fontSize: 12 },
  detailTab: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  timeline: { marginTop: 5 },
  timelineItem: { minHeight: 65, flexDirection: "row", alignItems: "flex-start", gap: 11 },
  timelineRail: { width: 24, alignItems: "center", alignSelf: "stretch" },
  timelineNode: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: "#CBC5C8", backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", zIndex: 1 },
  timelineNodeDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  timelineNodeCurrent: { borderColor: colors.burgundy },
  timelineNodeInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.burgundy },
  timelineLine: { position: "absolute", top: 18, bottom: -2, width: 1, backgroundColor: colors.line },
  timelineCopy: { flex: 1, paddingBottom: 13 },
  timelineTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 13 },
  timelineCurrentText: { color: colors.burgundy },
  timelineDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  liveTag: { fontFamily: type.bold, color: colors.burgundy, fontSize: 9 },
  nextCard: { marginTop: 7, padding: 14, borderRadius: 8, backgroundColor: colors.goldSoft, borderLeftWidth: 3, borderLeftColor: colors.orange },
  nextEyebrow: { fontFamily: type.bold, color: colors.warning, fontSize: 9 },
  nextTitle: { marginTop: 6, fontFamily: type.bold, color: colors.ink, fontSize: 16 },
  nextDetail: { marginTop: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  nextAction: { minHeight: 39, marginTop: 9, flexDirection: "row", alignItems: "center", gap: 7 },
  nextActionText: { flex: 1, fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  requestTop: { minHeight: 75, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  requestGlyph: { width: 44, height: 44, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.orangeSoft },
  requestRef: { fontFamily: type.bold, color: colors.ink, fontSize: 14 },
  requestProgress: { marginTop: 15, padding: 14, borderRadius: 8, backgroundColor: "#F5F8FA" },
  progressTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 13 },
  progressPercent: { position: "absolute", top: 14, right: 14, fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  requestProgressTrack: { height: 5, marginTop: 12, marginBottom: 7, borderRadius: 3, backgroundColor: "#DADFE3", overflow: "hidden" },
  requestProgressFill: { width: "52%", height: 5, backgroundColor: colors.teal },
  summaryPanel: { paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#F7F7F7" },
  summaryRow: { minHeight: 47, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryLabel: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  summaryValue: { fontFamily: type.bold, color: colors.ink, fontSize: 12 },
  activityRow: { minHeight: 53, flexDirection: "row", alignItems: "center", gap: 10 },
  activityCheck: { width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.teal },
  activityPending: { width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  messageCaseHeader: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal },
  dateDivider: { marginTop: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 9 },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dateText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 9 },
  messageReceived: { maxWidth: "88%", alignSelf: "flex-start", marginBottom: 12, padding: 12, borderRadius: 8, borderTopLeftRadius: 2, backgroundColor: "#F3F1F2" },
  senderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 7 },
  senderAvatar: { width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy },
  senderInitial: { fontFamily: type.bold, color: colors.surface, fontSize: 10 },
  senderName: { flex: 1, fontFamily: type.bold, color: colors.ink, fontSize: 10 },
  messageTime: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 9 },
  messageBody: { fontFamily: type.regular, color: colors.ink, fontSize: 12, lineHeight: 18 },
  messageSent: { maxWidth: "85%", alignSelf: "flex-end", marginBottom: 12, padding: 12, borderRadius: 8, borderTopRightRadius: 2, backgroundColor: colors.burgundy },
  messageBodySent: { fontFamily: type.regular, color: colors.surface, fontSize: 12, lineHeight: 18 },
  messageTimeSent: { marginTop: 6, fontFamily: type.medium, color: "#F6DCE5", fontSize: 9, textAlign: "right" },
  messageNotice: { marginTop: 8, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.tealSoft },
  noticeText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  segment: { height: 42, flexDirection: "row", padding: 3, borderRadius: 7, backgroundColor: "#F1EFF0", marginBottom: 14 },
  segmentOption: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 5 },
  segmentOptionActive: { backgroundColor: colors.surface },
  segmentText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 11 },
  segmentTextActive: { fontFamily: type.bold, color: colors.burgundy },
  serviceSaved: { padding: 14, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  serviceSavedTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  verified: { fontFamily: type.bold, color: colors.teal, fontSize: 10 },
  serviceName: { marginTop: 11, fontFamily: type.bold, color: colors.ink, fontSize: 16 },
  serviceLocation: { marginTop: 5, flexDirection: "row", fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 },
  serviceTags: { marginTop: 10, flexDirection: "row", gap: 7 },
  serviceTag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4, backgroundColor: colors.tealSoft, fontFamily: type.medium, color: colors.teal, fontSize: 9 },
  serviceFooter: { minHeight: 37, marginTop: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.line },
  savedWhen: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 10 },
  guideRow: { minHeight: 77, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  guideCategory: { fontFamily: type.bold, color: colors.burgundy, fontSize: 9 },
  guideTitle: { marginTop: 3, fontFamily: type.bold, color: colors.ink, fontSize: 12 },
  guideRead: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10 },
  sampleNote: { marginTop: 18, flexDirection: "row", alignItems: "center", gap: 7 },
  sampleNoteText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10 },
  storageCard: { minHeight: 74, padding: 13, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 8, backgroundColor: "#214F55" },
  storageIcon: { width: 38, height: 38, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" },
  storageTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
  storageDetail: { marginTop: 3, fontFamily: type.regular, color: "#D8E9E8", fontSize: 10 },
  documentFilter: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 17, borderBottomWidth: 1, borderBottomColor: colors.line },
  documentRow: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  documentName: { fontFamily: type.bold, color: colors.ink, fontSize: 12 },
  documentStatus: { marginTop: 4, fontFamily: type.medium, color: colors.teal, fontSize: 10 },
  smallStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  uploadHint: { marginTop: 14, padding: 10, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.tealSoft },
  calendarHeader: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line },
  calendarMonth: { fontFamily: type.bold, color: colors.ink, fontSize: 11 },
  calendarArrows: { flexDirection: "row", gap: 14 },
  weekRow: { flexDirection: "row", justifyContent: "space-around", paddingTop: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  weekCell: { alignItems: "center", gap: 6 },
  weekDay: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 9 },
  weekDate: { width: 31, height: 31, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  weekDateActive: { backgroundColor: colors.burgundy },
  weekDateText: { fontFamily: type.medium, color: colors.ink, fontSize: 11 },
  weekDateTextActive: { color: colors.surface },
  appointmentCard: { minHeight: 137, flexDirection: "row", borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.surface },
  appointmentDate: { width: 66, alignItems: "center", justifyContent: "center", borderRightWidth: 1, borderRightColor: colors.line, backgroundColor: colors.goldSoft },
  appointmentMonth: { fontFamily: type.bold, color: colors.burgundy, fontSize: 10 },
  appointmentDay: { marginTop: 2, fontFamily: type.bold, color: colors.ink, fontSize: 27 },
  appointmentWeekday: { marginTop: 1, fontFamily: type.medium, color: colors.inkMuted, fontSize: 9 },
  appointmentDivider: { width: 3, backgroundColor: colors.orange },
  appointmentCopy: { flex: 1, padding: 11, justifyContent: "center" },
  appointmentStatus: { flexDirection: "row", alignItems: "center", gap: 5 },
  appointmentTitle: { marginTop: 6, fontFamily: type.bold, color: colors.ink, fontSize: 13, lineHeight: 18 },
  appointmentMeta: { marginTop: 5, flexDirection: "row", alignItems: "center", gap: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10 },
  appointmentNotice: { marginTop: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.goldSoft },
  appointmentNoticeText: { flex: 1, fontFamily: type.medium, color: colors.warning, fontSize: 10, lineHeight: 15 },
  pastAppointment: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  notificationSummary: { minHeight: 77, flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 13, borderRadius: 8, backgroundColor: colors.burgundySoft },
  unreadNumber: { fontFamily: type.bold, color: colors.burgundy, fontSize: 23 },
  unreadLabel: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 9 },
  unreadDivider: { width: 1, height: 38, backgroundColor: "#D8B7C2" },
  summaryHint: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  notificationRow: { minHeight: 85, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  notificationUnread: { backgroundColor: "#FFFAF8" },
  notificationTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 12 },
  notificationDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  notificationTime: { marginTop: 4, fontFamily: type.medium, color: colors.burgundy, fontSize: 9 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.orange },
  accountHero: { minHeight: 126, marginTop: 7, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 8, backgroundColor: colors.burgundy },
  accountAvatar: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.55)", backgroundColor: "#F1C9D5" },
  accountInitials: { fontFamily: type.bold, color: colors.burgundy, fontSize: 19 },
  accountName: { fontFamily: type.bold, color: colors.surface, fontSize: 18 },
  accountType: { marginTop: 4, fontFamily: type.medium, color: "#F6DCE5", fontSize: 10 },
  accountSummary: { minHeight: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: colors.line },
  accountStat: { alignItems: "center", gap: 3 },
  accountStatValue: { fontFamily: type.bold, color: colors.ink, fontSize: 16 },
  accountStatLabel: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 9 },
  accountStatDivider: { width: 1, height: 31, backgroundColor: colors.line },
  accountRow: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  accountRowTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 12 },
  accountRowDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10 },
  demoAccountNotice: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 7 },
  securityShield: { minHeight: 75, flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 8, backgroundColor: colors.tealSoft },
  shieldIcon: { width: 42, height: 42, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  shieldTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 13 },
  shieldDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  shieldCheck: { width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.teal },
  settingRow: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.line },
  settingTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 11 },
  settingDetail: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  securityRow: { minHeight: 65, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.line },
  securityFooter: { marginTop: 16, flexDirection: "row", alignItems: "flex-start", gap: 7 },
  securityFooterText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  modalRoot: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: 74 },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(24,16,20,0.38)" },
  menuPanel: { width: "92%", maxWidth: 480, maxHeight: "78%", padding: 12, borderRadius: 10, backgroundColor: colors.surface, shadowColor: "#170B10", shadowOpacity: 0.2, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  menuHeader: { minHeight: 53, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.line },
  menuEyebrow: { fontFamily: type.bold, color: colors.burgundy, fontSize: 9 },
  menuTitle: { marginTop: 2, fontFamily: type.bold, color: colors.ink, fontSize: 17 },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F1F2" },
  menuScroll: { flexGrow: 0, marginTop: 5 },
  menuItem: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F1EDEF", paddingHorizontal: 5 },
  menuItemActive: { backgroundColor: "#FFF8FA" },
  menuItemIcon: { width: 32, height: 32, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F1F2" },
  menuItemIconActive: { backgroundColor: colors.burgundySoft },
  menuItemText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 12 },
  menuItemTextActive: { fontFamily: type.bold, color: colors.burgundy },
  menuNote: { paddingTop: 9, paddingHorizontal: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
});
