import { BrandLoading } from '../src/components/BrandLoading';
import { directoryLabel } from "../src/directoryLabels";
import { displayLabel } from "../../shared/plainLanguage";
import { plainError } from "../../shared/plainLanguage";
import { SearchFilters } from '../src/components/SearchFilters';
import { useSensitiveScreenProtection } from '../src/useSensitiveScreenProtection';
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { CivicPageHeader as AppHeader } from "../src/components/CivicPageHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

import { ProviderInviteManager } from "../src/components/ProviderInvitations";

const statusLabels: Record<string, { sw: string; en: string }> = {
  none: { sw: "Hakuna", en: "None" },
  verified: { sw: "Imethibitishwa", en: "Verified" },
  draft: { sw: "Rasimu", en: "Draft" },
  expired: { sw: "Muda wa ukaguzi umepita", en: "Review expired" },
  suspended: { sw: "Imesimamishwa", en: "Suspended" },
  inactive: { sw: "Haifanyi kazi", en: "Inactive" },
  active: { sw: "Inafanya kazi", en: "Active" },
  open: { sw: "Inapokea maombi", en: "Taking new requests" },
  limited: { sw: "Ina nafasi chache", en: "Limited" },
  closed: { sw: "Imefungwa", en: "Closed" },
  emergency_only: { sw: "Dharura pekee", en: "Emergency only" },
};

export default function MyOrganisationScreen() {
  useSensitiveScreenProtection("provider-organisation");
  const [search, setSearch] = useState("");
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const approved = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const memberships = useQuery(api.justiceServices.myOrganizations, approved ? {} : "skip");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<Id<"justice_service_organizations"> | null>(null);
  const selectedMembership = memberships?.find((item) => item._id === selectedOrganizationId) ?? memberships?.[0];
  const record = useQuery(api.justiceServices.myOrganization, approved && memberships !== undefined ? { organizationId: selectedMembership?._id } : "skip");
  const updateIntake = useMutation(api.justiceServices.updateOwnIntake);
  const submitCorrection = useMutation(api.justiceServices.submitServiceCorrection);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [reason, setReason] = useState(""); const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const canManageIntake = selectedMembership?.roles.includes("provider_staff") ?? false;
  const members = useQuery(api.justiceServices.myOrganizationMembers, canManageIntake && selectedMembership ? { organizationId: selectedMembership._id } : "skip");
  async function setIntake(serviceId: Id<"justice_services">, state: "open" | "limited" | "closed" | "emergency_only", capacity: number | undefined) {
    setBusy(true); setError(""); setNotice("");
    try { await updateIntake({ serviceId, state, capacity }); setNotice(locale === "sw" ? "Hali ya huduma na nafasi zimehifadhiwa." : "Service availability and places saved."); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function requestCorrection(serviceId: Id<"justice_services">) {
    setBusy(true); setError("");
    try { await submitCorrection({ serviceId, reason: reason.trim(), proposedDetails: details.trim() }); setSelectedService(null); setReason(""); setDetails(""); setNotice(locale === "sw" ? "Ombi la marekebisho limepelekwa LSF." : "Correction request sent to LSF."); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  if (!isSignedIn) return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}><AppHeader compact back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} /><ParalegalIntro pose="location" title={locale === "sw" ? "Huduma na timu yako" : "Your services and team"} body={locale === "sw" ? "Angalia taarifa za taasisi, huduma na usalama." : "View organisation details, services and safety status."} /><Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Taarifa za ndani zinalindwa" : "Internal details are protected"}</Text><Text style={styles.body}>{locale === "sw" ? "Ingia kwa akaunti ya taasisi kuona taarifa zake." : "Sign in with a linked organisation account to view its details."}</Text><Button label={locale === "sw" ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} /></Surface></Screen>;
  if (access === undefined) return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}><BrandLoading compact text={locale === "sw" ? "Inaangalia ruhusa zako…" : "Checking your access…"}/></Screen>;
  if (!approved) return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}><AppHeader compact back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} /><Surface tone="orange"><Text style={styles.title}>{locale === "sw" ? "Idhini ya mtoa huduma inahitajika" : "Provider approval required"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF lazima iidhinishe jukumu lako kabla ya taarifa za taasisi kuonekana." : "LSF must approve your provider role before organisation details are available."}</Text><Button label={locale === "sw" ? "Angalia hatua za kujiunga" : "View joining steps"} onPress={() => router.push("/paralegal-onboarding")} /></Surface></Screen>;
  if (memberships === undefined || record === undefined) return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}><BrandLoading compact text={locale === "sw" ? "Inafungua taarifa za taasisi…" : "Loading organisation details…"}/></Screen>;
  if (!record) return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}><AppHeader compact back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} /><Surface tone="orange"><Text style={styles.title}>{locale === "sw" ? "Hakuna taasisi iliyounganishwa" : "No organisation linked"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF lazima iunganishe akaunti yako na taasisi iliyothibitishwa kabla ya huduma zake kuonekana hapa." : "LSF must link your account to a verified organisation before its services appear here."}</Text><Button label={locale === "sw" ? "Rudi kwenye kazi" : "Back to work"} onPress={() => router.back()} /></Surface></Screen>;
  const { organization, services } = record;
  return <Screen footer={approved ? <ParalegalNavigation current="profile" /> : undefined}>
    <AppHeader compact back title={locale === "sw" ? "Taasisi yangu" : "My organisation"} />
    {memberships.length > 1 ? <View style={styles.organisationSwitch}><Text style={styles.noteTitle}>{locale === "sw" ? "Chagua taasisi yenye idhini" : "Choose an approved organisation"}</Text><View style={styles.stateOptions}>{memberships.map((item) => <Pressable key={item._id} accessibilityRole="button" accessibilityState={{ selected: item._id === organization._id }} onPress={() => { setSelectedOrganizationId(item._id); setSelectedService(null); setError(""); setNotice(""); }} style={[styles.stateOption, item._id === organization._id && styles.stateOn]}><Text style={[styles.stateText, item._id === organization._id && styles.stateTextOn]}>{item.name}</Text></Pressable>)}</View></View> : null}
    <ParalegalIntro pose="location" title={organization.name} body={directoryLabel(organization.organizationType, locale === "sw")} />

    <Surface tone="teal"><Text style={styles.body}>{locale === "sw" ? "Taasisi" : "Organisation"}: {statusLabels[organization.verificationStatus]?.[locale] ?? organization.verificationStatus} · {locale === "sw" ? "Makubaliano" : "Referral agreement"}: {statusLabels[organization.referralAgreementStatus]?.[locale] ?? organization.referralAgreementStatus}</Text><Text style={styles.body}>{locale === "sw" ? "Ulinzi" : "Safeguarding"}: {organization.safeguardingReady ? (locale === "sw" ? "Uko tayari" : "Ready") : (locale === "sw" ? "Inahitaji mapitio ya LSF" : "Needs LSF review")}{organization.slaHours ? ` · ${organization.slaHours} ${locale === "sw" ? "saa za kujibu" : "hours to respond"}` : ''}</Text></Surface>
    <SectionHeading title={locale === "sw" ? "Huduma zilizounganishwa" : "Linked services"} />
    {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.body}>{error}</Text></Surface> : null}
    {notice ? <Surface tone="teal"><Text style={styles.body}>{notice}</Text></Surface> : null}
    <SearchFilters sw={locale === "sw"} value={search} onChange={setSearch} placeholder={locale === "sw" ? "Tafuta huduma au eneo" : "Find a service or place"} />
    {services.length ? services.filter(service => [service.name,service.region,service.district].join(" ").toLowerCase().includes(search.trim().toLowerCase())).map((service) => <View key={service._id}><Pressable style={styles.service} onPress={() => router.push({ pathname: "/service/[id]", params: { id: service._id } })}><View style={styles.serviceIcon}><Ionicons name="medical-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.serviceName}>{service.name}</Text><Text style={styles.meta}>{[service.district, service.region].filter(Boolean).join(", ")} · {directoryLabel(service.servicePointType, locale === "sw")}</Text><Text style={styles.meta}>{statusLabels[service.verificationStatus]?.[locale] ?? service.verificationStatus} · {statusLabels[service.currentIntakeState]?.[locale] ?? service.currentIntakeState}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>{canManageIntake ? <Surface>{organization.verificationStatus === "verified" && service.verificationStatus === "verified" && service.active ? <IntakeControls serviceId={service._id} currentState={service.currentIntakeState} currentCapacity={service.capacity} busy={busy} sw={locale === "sw"} onSave={setIntake} /> : <Text style={styles.body}>{locale === "sw" ? "Kupokea maombi hakuwezi kubadilishwa hadi LSF ithibitishe tena taasisi na huduma hii." : "Intake cannot be changed until LSF verifies this organisation and service again."}</Text>}<Button label={selectedService === service._id ? (locale === "sw" ? "Ficha ombi" : "Hide request") : (locale === "sw" ? "Omba marekebisho" : "Request a correction")} variant="quiet" onPress={() => { setSelectedService(selectedService === service._id ? null : service._id); setReason(""); setDetails(""); }} />{selectedService === service._id ? <><TextInput value={reason} onChangeText={setReason} multiline maxLength={1000} accessibilityLabel={locale === "sw" ? "Sababu ya marekebisho" : "Correction reason"} style={styles.input} placeholder={locale === "sw" ? "Nini si sahihi?" : "What is incorrect?"} placeholderTextColor={colors.inkMuted} /><TextInput value={details} onChangeText={setDetails} multiline maxLength={2000} accessibilityLabel={locale === "sw" ? "Taarifa sahihi" : "Correct details"} style={styles.input} placeholder={locale === "sw" ? "Taarifa sahihi unazopendekeza" : "Proposed correct details"} placeholderTextColor={colors.inkMuted} /><Text style={styles.body}>{locale === "sw" ? "LSF itakagua kabla ya kubadili taarifa za umma." : "LSF will review before changing public details."}</Text><Button label={locale === "sw" ? "Tuma ombi kwa LSF" : "Send request to LSF"} disabled={busy || reason.trim().length < 10 || details.trim().length < 10} onPress={() => void requestCorrection(service._id)} /></> : null}</Surface> : null}</View>) : <Surface><Text style={styles.body}>{locale === "sw" ? "Hakuna huduma iliyounganishwa bado." : "No service points are linked yet."}</Text></Surface>}
    {services.length > 0 && !services.some(service => [service.name, service.region, service.district].join(" ").toLowerCase().includes(search.trim().toLowerCase())) && <Text style={styles.body}>{locale === "sw" ? "Hakuna huduma inayolingana." : "No matching services."}</Text>}
    <SectionHeading title={locale === "sw" ? "Maombi yangu ya marekebisho" : "My correction requests"} />
    <Text style={styles.body}>{locale === "sw" ? "Maombi yako 50 ya karibuni. LSF hukagua kabla ya kubadili taarifa za umma." : "Your latest 50 requests. LSF reviews changes before public details change."}</Text>
    {record.corrections.length ? record.corrections.map(item => <Surface key={item._id}><Text style={styles.noteTitle}>{services.find(service => service._id === item.serviceId)?.name ?? (locale === "sw" ? "Rekodi ya huduma" : "Service record")}</Text><Text style={styles.body}>{item.status === "pending" ? (locale === "sw" ? "Inasubiri mapitio ya LSF" : "Waiting for LSF review") : item.status === "applied" ? (locale === "sw" ? "Marekebisho yamefanywa" : "Correction applied") : (locale === "sw" ? "Haijaidhinishwa" : "Not approved")}</Text><Text style={styles.body}>{item.proposedDetails}</Text></Surface>) : <Text style={styles.body}>{locale === "sw" ? "Hakuna ombi bado." : "No correction requests yet."}</Text>}
    {canManageIntake && selectedMembership && record.organization.verificationStatus === "verified" && record.organization.referralAgreementStatus === "active" && <ProviderInviteManager key={selectedMembership._id} organizationId={selectedMembership._id} />}
    {canManageIntake ? <><SectionHeading title={locale === "sw" ? "Watu wenye ruhusa" : "People with access"} />{members === undefined ? <Surface><BrandLoading compact text={locale === "sw" ? "Inafungua orodha ya timu…" : "Loading team members…"}/></Surface> : members.length === 0 ? <Surface><Text style={styles.body}>{locale === "sw" ? "Hakuna jukumu lililounganishwa." : "No linked professional roles."}</Text></Surface> : members.map((member) => <Surface key={member.id}><Text style={styles.noteTitle}>{member.name}</Text><Text style={styles.body}>{displayLabel(member.role, locale)} · {displayLabel(member.status, locale)}</Text></Surface>)}<Surface tone="orange"><Text style={styles.noteTitle}>{locale === "sw" ? "Ruhusa zinahitaji idhini ya LSF" : "Access needs LSF approval"}</Text><Text style={styles.body}>{locale === "sw" ? "Wanachama wapya huomba ruhusa wanapojiunga. LSF hukagua maombi na inaweza kuondoa ruhusa." : "New members request work access when joining. LSF reviews requests and can remove access."}</Text></Surface></> : null}
    <Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Mabadiliko ya taarifa za umma" : "Changes to public records"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF pekee ndiyo inaweza kuthibitisha, kusimamisha au kubadilisha taarifa za taasisi na huduma za umma." : "Only LSF can verify, suspend, or change organisation and public service records."}</Text></Surface>
  </Screen>;
}

function IntakeControls({ serviceId, currentState, currentCapacity, busy, sw, onSave }: { serviceId: Id<"justice_services">; currentState: "open" | "limited" | "closed" | "emergency_only"; currentCapacity?: number; busy: boolean; sw: boolean; onSave: (serviceId: Id<"justice_services">, state: "open" | "limited" | "closed" | "emergency_only", capacity: number | undefined) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState(currentState);
  const [capacityText, setCapacityText] = useState(currentCapacity === undefined ? "" : String(currentCapacity));
  useEffect(() => { setState(currentState); setCapacityText(currentCapacity === undefined ? "" : String(currentCapacity)); }, [currentState, currentCapacity]);
  const capacity = capacityText.trim() === "" ? undefined : Number(capacityText);
  const valid = (capacity === undefined || (Number.isInteger(capacity) && capacity >= 0 && capacity <= 100000)) && ((capacity ?? currentCapacity) !== 0 || state === "closed");
  const changed = state !== currentState || (capacity !== undefined && capacity !== currentCapacity);
  return <View><Text style={styles.body}>{statusLabels[currentState]?.[sw ? "sw" : "en"] ?? currentState}{currentCapacity !== undefined ? ` · ${currentCapacity} ${sw ? "nafasi" : "places"}` : ""}</Text><Button variant="secondary" label={expanded ? (sw ? "Ficha mabadiliko" : "Hide changes") : (sw ? "Badili upatikanaji" : "Change availability")} onPress={() => setExpanded(!expanded)} />{expanded && <><Text style={styles.noteTitle}>{sw ? "Kupokea maombi" : "Taking new requests"}</Text><Text style={styles.body}>{sw ? "Weka hali ya huduma na nafasi zilizopo. Timu ya uratibu itaona mabadiliko." : "Set service availability and places. Coordinators will see your changes."}</Text><View style={styles.stateOptions}>{(["open", "limited", "closed", "emergency_only"] as const).map((option) => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: state === option }} aria-checked={state === option} disabled={busy} onPress={() => setState(option)} style={[styles.stateOption, state === option && styles.stateOn]}><Text style={[styles.stateText, state === option && styles.stateTextOn]}>{statusLabels[option]?.[sw ? "sw" : "en"] ?? option}</Text></Pressable>)}</View><Text style={styles.noteTitle}>{sw ? "Nafasi zinazopatikana (hiari)" : "Available places (optional)"}</Text><TextInput accessibilityLabel={sw ? "Idadi ya nafasi zinazopatikana" : "Number of available places"} keyboardType="number-pad" value={capacityText} onChangeText={setCapacityText} maxLength={6} style={styles.capacityInput} placeholder={currentCapacity === undefined ? (sw ? "Haijabainishwa" : "Not specified") : String(currentCapacity)} placeholderTextColor={colors.inkMuted} /><Text style={styles.body}>{capacity === undefined ? (sw ? "Acha wazi ikiwa hujui. Idadi iliyohifadhiwa itabaki." : "Leave blank if unknown. The saved number will remain.") : capacity === 0 && state !== "closed" ? (sw ? "Nafasi zikiisha, chagua Imefungwa." : "When no places remain, select Closed.") : valid ? (sw ? `Nafasi ${capacity}` : `${capacity} places`) : (sw ? "Weka namba kamili kati ya 0 na 100000." : "Enter a whole number from 0 to 100000.")}</Text><Button label={sw ? "Hifadhi upatikanaji" : "Save availability"} disabled={busy || !valid || !changed} onPress={() => void onSave(serviceId, state, capacity)} /></>}</View>;
}

function Badge({ label, tone }: { label: string; tone: "teal" | "pink" }) { return <Text style={[styles.badge, tone === "teal" ? styles.badgeTeal : styles.badgePink]}>{label}</Text>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.meta}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  organisationSwitch: { marginTop: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.md },
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, marginTop: spacing.lg }, icon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 24 }, heroBody: { color: "#D8D2D5", fontFamily: type.regular, fontSize: 14, textTransform: "capitalize" }, badges: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }, badge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6, fontFamily: type.bold, fontWeight: "700", fontSize: 12 }, badgeTeal: { backgroundColor: "#DDF4EB", color: colors.teal }, badgePink: { backgroundColor: colors.softPink, color: colors.burgundy }, info: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 3 }, infoValue: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14, textTransform: "capitalize" }, service: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, marginBottom: spacing.sm }, serviceIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1, gap: 3 }, serviceName: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, textTransform: "capitalize" }, title: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 18 }, body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 23, marginTop: spacing.sm }, noteTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 },
  capacityInput: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, color: colors.ink, fontSize: 16, marginTop: spacing.sm }, stateOptions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginVertical: spacing.md }, stateOption: { minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, justifyContent: "center" }, stateOn: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, stateText: { color: colors.ink, fontFamily: type.medium, fontSize: 12 }, stateTextOn: { color: colors.surface }, input: { minHeight: 90, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, color: colors.ink, textAlignVertical: "top", marginBottom: spacing.sm },
});
