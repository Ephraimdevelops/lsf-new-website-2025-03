import DateTimePicker from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, type } from "../theme";
export function workDayEnd(now = Date.now()) { const day = 86400000; const offset = 10800000; return Math.floor((now + offset) / day) * day + day - offset - 1; }
/** Appointment wall time is explicitly Dar es Salaam, regardless of device timezone. */
export function workTimestamp(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return NaN;
  const timestamp = Date.parse(`${value}:00+03:00`);
  if (!Number.isFinite(timestamp)) return NaN;
  return new Date(timestamp + 3 * 3600000).toISOString().slice(0, 16) === value ? timestamp : NaN;
}
export function WorkDateTime({ value, onChange, sw, label }: { value: string; onChange: (value: string) => void; sw: boolean; label?: string }) {
  const [picker, setPicker] = useState<"date" | "time" | null>(null);
  const parts = value || new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Dar_es_Salaam", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(Date.now() + 86400000)).replace(" ", "T");
  const [day, time] = parts.split("T"); const date = new Date(`${day}T${time}`);
  return <View style={styles.wrap}><Text style={styles.label}>{label ?? (sw ? "Tarehe na muda" : "Date and time")}</Text><Text style={styles.note}>{sw ? "Saa za Tanzania (EAT)" : "Tanzania time (EAT)"}</Text>
    {Platform.OS === "web" ? createElement("input", { type: "datetime-local", "aria-label": label ?? "Date and time, Tanzania time", value, onChange: (event: { currentTarget: { value: string } }) => onChange(event.currentTarget.value), style: { minHeight: 52, padding: 12, borderRadius: 10, border: "1px solid #E8E2E5", font: "inherit", width: "100%", boxSizing: "border-box" } }) : <><View style={styles.row}>{(["date", "time"] as const).map(mode => <Pressable key={mode} accessibilityRole="button" style={styles.control} onPress={() => setPicker(mode)}><Text style={styles.label}>{mode === "date" ? (value ? day : sw ? "Weka tarehe" : "Set date") : (value ? time : sw ? "Weka muda" : "Set time")}</Text></Pressable>)}</View>{picker && <DateTimePicker value={date} mode={picker} display="default" onChange={(event, next) => { setPicker(null); if (event.type === "dismissed" || !next) return; const pad = (n: number) => String(n).padStart(2, "0"); onChange(picker === "date" ? `${next.getFullYear()}-${pad(next.getMonth()+1)}-${pad(next.getDate())}T${time}` : `${day}T${pad(next.getHours())}:${pad(next.getMinutes())}`); }} />}</>}
  </View>;
}
const styles = StyleSheet.create({ wrap: { gap: 8 }, row: { flexDirection: "row", gap: 8 }, control: { flex: 1, minHeight: 52, backgroundColor: colors.surface, padding: 12, borderRadius: 10, justifyContent: "center" }, label: { fontFamily: type.medium, fontSize: 16, color: colors.ink }, note: { fontFamily: type.regular, fontSize: 14, color: colors.inkMuted } });
