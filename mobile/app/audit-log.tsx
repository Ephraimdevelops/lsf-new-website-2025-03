import { BrandLoading } from '../src/components/BrandLoading';
import { AdminIntro } from "../src/admin/AdminIntro";
import { SearchFilters } from "../src/components/SearchFilters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

const filters = ["", "access.", "directory.", "saada.", "paralegal.", "case."] as const;

export default function AuditLogScreen() {
  useSensitiveScreenProtection("platform-audit-log");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "supervisor"].includes(role));
  const [prefix, setPrefix] = useState<(typeof filters)[number]>(""); const [search, setSearch] = useState("");
  const rows = useQuery(api.admin.listPlatformAudit, allowed ? { actionPrefix: prefix || undefined, limit: 150 } : "skip");
  const visible = useMemo(() => { const needle = search.trim().toLowerCase(); return needle ? (rows ?? []).filter((row) => [row.action, row.entityType, row.actor?.name, row.actor?.email].some((value) => value?.toLowerCase().includes(needle))) : rows ?? []; }, [rows, search]);
  if (access === undefined) return <Screen><BrandLoading compact text={sw ? "Inapakia..." : "Loading..."}/></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Historia ya mabadiliko" : "Audit log"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface></Screen>;
  return <Screen>
    <AppHeader back title={sw ? "Historia ya mabadiliko" : "Platform audit log"} eyebrow="LSF · ACCOUNTABILITY" />
    <AdminIntro icon="shield-checkmark-outline" eyebrow="LSF" title={sw ? "Uamuzi muhimu unaacha rekodi." : "Every important decision leaves a record."} description={sw ? "Kagua mabadiliko ya ufikiaji, huduma, Haki Yangu AI, msaidizi wa kisheria na kesi bila kuonyesha maudhui nyeti." : "Review access, directory, Haki Yangu AI, paralegal, and case changes without exposing sensitive content."} />
    <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta kitendo au jina" : "Find an action or name"} label={sw ? "Aina" : "Type"} title={sw ? "Aina ya uamuzi" : "Type of decision"} count={Number(!!prefix)} onReset={() => setPrefix("")}><View style={styles.filters}>{filters.map((item) => <Pressable key={item || "all"} accessibilityRole="radio" accessibilityState={{ checked: prefix === item }} onPress={() => setPrefix(item)} style={[styles.filter, prefix === item && styles.filterActive]}><Text style={[styles.filterText, prefix === item && styles.filterTextActive]}>{item ? item.replace(".", "") : (sw ? "Zote" : "All")}</Text></Pressable>)}</View></SearchFilters>
    <Text style={styles.muted}>{sw ? "Utafutaji unatumia matukio 150 yaliyoonyeshwa. Aina inatafutwa kwenye matukio 1,000 mapya." : "Search uses the 150 events shown. Type checks the latest 1,000 events."}</Text>
    <Text style={styles.count}>{visible.length} {sw ? "matukio" : "events"}</Text>
    {visible.map((row) => <Surface key={row._id}><View style={styles.row}><View style={styles.icon}><Ionicons name="shield-checkmark-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{row.action.replaceAll("_", " ")}</Text><Text style={styles.muted}>{new Date(row.timestamp).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></View></View><Text style={styles.copy}>{row.entityType} · {row.entityId}</Text><Text style={styles.copy}>{sw ? "Mtendaji" : "Actor"}: {row.actor?.name || row.actor?.email || (sw ? "mfumo" : "system")}</Text>{row.changedFieldNames.length ? <Text style={styles.fields}>{sw ? "Sehemu" : "Fields"}: {row.changedFieldNames.join(", ")}</Text> : null}</Surface>)}
    {rows !== undefined && visible.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna tukio linalolingana." : "No matching audit event."}</Text></Surface> : null}
  </Screen>;
}

const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, search: { minHeight: 50, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink }, filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }, filter: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface }, filterActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy }, filterText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 12, textTransform: "capitalize" }, filterTextActive: { color: colors.surface }, count: { marginTop: spacing.lg, color: colors.burgundy, fontFamily: type.bold, fontSize: 13 }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 14 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, copy: { marginTop: spacing.sm, color: colors.charcoal, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, fields: { marginTop: spacing.sm, color: colors.burgundy, fontFamily: type.medium, fontSize: 12 } });
