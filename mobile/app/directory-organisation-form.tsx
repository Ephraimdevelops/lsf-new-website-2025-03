import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";
import { directoryLabel } from "../src/directoryLabels";

const kinds = ["lsf", "legal_aid_provider", "government", "cso", "community_paralegal_network", "private_provider", "donor_partner", "other"] as const;
type Kind = typeof kinds[number];

export default function OrganisationForm() {
  useSensitiveScreenProtection("directory-organisation-form");
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles?.some((role: string) => ["admin", "staff"].includes(role)) ?? false;
  const existing = useQuery(api.justiceServices.staffGetOrganization, allowed && id ? { id: id as Id<"justice_service_organizations"> } : "skip");
  const create = useMutation(api.justiceServices.createOrganization);
  const update = useMutation(api.justiceServices.updateOrganization);
  const [name, setName] = useState(""); const [kind, setKind] = useState<Kind>("legal_aid_provider");
  const [focalName, setFocalName] = useState(""); const [focalEmail, setFocalEmail] = useState(""); const [focalPhone, setFocalPhone] = useState(""); const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useEffect(() => { if (!existing) return; setName(existing.name); setKind(existing.organizationType); setFocalName(existing.focalPersonName ?? ""); setFocalEmail(existing.focalPersonEmail ?? ""); setFocalPhone(existing.focalPersonPhone ?? ""); setNotes(existing.notes ?? ""); }, [existing?._id]);
  async function save() {
    if (busy) return;
    if (name.trim().length < 2) { setError(sw ? "Weka jina la taasisi." : "Enter the organisation name."); return; }
    if (focalEmail.trim() && !/^\S+@\S+\.\S+$/.test(focalEmail.trim())) { setError(sw ? "Barua pepe si sahihi." : "Enter a valid email address."); return; }
    setBusy(true); setError("");
    try {
      const fields = { name: name.trim(), organizationType: kind, focalPersonName: focalName.trim() || undefined, focalPersonEmail: focalEmail.trim() || undefined, focalPersonPhone: focalPhone.trim() || undefined, notes: notes.trim() || undefined };
      if (existing) { await update({ id: existing._id as Id<"justice_service_organizations">, updates: fields }); router.back(); }
      else { const result = await create({ ...fields, verificationStatus: "draft", referralAgreementStatus: "none", safeguardingReady: false }); router.replace({ pathname: "/directory-organisation/[id]", params: { id: result.id } }); }
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  return <Screen>
    <AppHeader back title={existing ? (sw ? "Hariri taasisi" : "Edit organisation") : (sw ? "Ongeza taasisi" : "Add organisation")} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <Surface><Text style={styles.copy}>{sw ? "Inapakia..." : "Loading..."}</Text></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."}</Text></Surface> : id && existing === undefined ? <Surface><Text style={styles.copy}>{sw ? "Inapakia rekodi..." : "Loading record..."}</Text></Surface> : id && !existing ? <Surface><Text style={styles.copy}>{sw ? "Taasisi haipatikani." : "Organisation not found."}</Text></Surface> : <>
      <View style={styles.hero}><Text style={styles.heroTitle}>{existing ? (sw ? "Sahihisha taarifa za taasisi." : "Keep organisation details accurate.") : (sw ? "Anza na rekodi ya rasimu." : "Start with a draft record.")}</Text><Text style={styles.heroCopy}>{sw ? "Mawasiliano ya mhusika ni ya ndani. Rekodi mpya inahitaji ukaguzi kabla ya kuthibitishwa." : "Focal-person contacts stay internal. New records need review before verification."}</Text></View>
      {existing?.verificationStatus === "verified" ? <Surface tone="orange"><Text style={styles.copy}>{sw ? "Kubadili jina au aina ya taasisi kutaondoa uthibitisho wake na kuzima huduma zake mpaka zikaguliwe tena." : "Changing a verified organisation's name or type removes its verification and pauses linked services until they are reviewed again."}</Text></Surface> : null}
      <Surface><Text style={styles.title}>{sw ? "Utambulisho" : "Identity"}</Text><Field label={sw ? "Jina la taasisi *" : "Organisation name *"} value={name} onChange={setName} /><Text style={styles.label}>{sw ? "Aina ya taasisi" : "Organisation type"}</Text><View style={styles.options}>{kinds.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: kind === item }} aria-checked={kind === item} onPress={() => setKind(item)} style={[styles.option, kind === item && styles.optionOn]}><Text style={[styles.optionText, kind === item && styles.optionTextOn]}>{directoryLabel(item, sw)}</Text></Pressable>)}</View></Surface>
      <Surface><Text style={styles.title}>{sw ? "Mhusika wa ndani" : "Internal focal person"}</Text><Field label={sw ? "Jina" : "Name"} value={focalName} onChange={setFocalName} /><Field label="Email" value={focalEmail} onChange={setFocalEmail} keyboardType="email-address" /><Field label={sw ? "Simu" : "Phone"} value={focalPhone} onChange={setFocalPhone} keyboardType="phone-pad" /><Text style={styles.copy}>{sw ? "Mawasiliano haya hayaonyeshwi kwenye orodha ya umma." : "These contact details are not shown in the public directory."}</Text></Surface>
      <Surface><Text style={styles.title}>{sw ? "Maelezo ya ukaguzi" : "Review notes"}</Text><TextInput value={notes} onChangeText={setNotes} multiline style={[styles.input, styles.multiline]} placeholder={sw ? "Chanzo, marekebisho au mambo ya kufuatilia" : "Source, corrections or follow-up needed"} placeholderTextColor={colors.inkMuted} /></Surface>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={existing ? (sw ? "Hifadhi mabadiliko" : "Save changes") : (sw ? "Hifadhi rasimu ya taasisi" : "Save organisation draft")} loading={busy} onPress={() => void save()} />
    </>}
  </Screen>;
}
function Field({ label, value, onChange, keyboardType }: { label: string; value: string; onChange: (value: string) => void; keyboardType?: "email-address" | "phone-pad" }) { return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChange} keyboardType={keyboardType} autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"} style={styles.input} accessibilityLabel={label} /></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 25, lineHeight: 31 }, heroCopy: { color: colors.peach, fontFamily: type.regular, fontSize: 14, lineHeight: 20 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, copy: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, label: { color: colors.charcoal, fontFamily: type.medium, fontSize: 13, marginTop: spacing.md, marginBottom: spacing.xs }, input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink, fontFamily: type.regular }, multiline: { minHeight: 96, paddingTop: spacing.md, textAlignVertical: "top" }, options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, option: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md }, optionOn: { borderColor: colors.burgundy, backgroundColor: colors.burgundy }, optionText: { color: colors.ink, fontFamily: type.medium, fontSize: 12, textTransform: "capitalize" }, optionTextOn: { color: colors.surface }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 } });
