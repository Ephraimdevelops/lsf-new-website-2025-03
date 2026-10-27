import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, type } from "../theme";
import { Button } from "../components/Button";

export function IntakeSelect({ label, value, options, onChange, sw, allowCustom = false, placeholder, disabled = false }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; sw: boolean; allowCustom?: boolean; placeholder?: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const chosen = options.find(item => item.value === value)?.label || value;
  const matches = options.filter(item => item.label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const searchable = options.length > 8 || allowCustom;
  const select = (next: string) => { onChange(next); setOpen(false); };
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Pressable disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, expanded: open }} accessibilityValue={{ text: chosen }} style={[styles.control, disabled && styles.disabled]} onPress={() => { setSearch(""); setOpen(true); }}>
      <Text style={[styles.value, !chosen && styles.muted]}>{chosen || placeholder || label}</Text><Ionicons name="chevron-down" size={18} color={colors.inkMuted} />
    </Pressable>
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modal}>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} style={styles.scrim} onPress={() => setOpen(false)} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.heading}><Text style={styles.title}>{label}</Text><Pressable style={styles.close} accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} onPress={() => setOpen(false)}><Ionicons name="close" size={22} color={colors.burgundy} /></Pressable></View>
          {searchable ? <TextInput accessibilityLabel={label} value={search} onChangeText={setSearch} placeholder={allowCustom && !options.some(item => item.value) ? (sw ? "Andika jina hapa" : "Enter the name here") : (sw ? "Tafuta kwa jina" : "Search by name")} placeholderTextColor={colors.inkMuted} style={styles.search} autoCorrect={false} /> : null}
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.options}>
            {matches.map(item => <Pressable key={item.value} accessibilityRole="radio" accessibilityState={{ checked: item.value === value }} onPress={() => select(item.value)} style={styles.option}><Text style={[styles.value, item.value === value && styles.selected]}>{item.label}</Text>{item.value === value ? <Ionicons name="checkmark" size={21} color={colors.burgundy} /> : null}</Pressable>)}
            {!matches.length && !allowCustom ? <Text style={styles.empty}>{sw ? "Hakuna jina linalolingana" : "No matching names"}</Text> : null}
            {allowCustom && search.trim() && !options.some(item => item.label.toLowerCase() === search.trim().toLowerCase()) ? <Button label={(sw ? "Weka: " : "Use: ") + search.trim()} onPress={() => select(search.trim().slice(0, 100))} /> : null}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  </View>;
}

function localDate(value: string) {
  const date = new Date(value + "T12:00:00");
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function dateValue(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function IntakeDate({ value, onChange, sw }: { value: string; onChange: (value: string) => void; sw: boolean }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(new Date());
  const today = dateValue(new Date());
  const valid = dateValue(pending) <= today;
  const save = () => { if (valid) { onChange(dateValue(pending)); setOpen(false); } };
  return <View style={styles.field}>
    <Text style={styles.label}>{sw ? "Tatizo lilitokea lini? (si lazima)" : "When did the problem happen? (optional)"}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Tarehe ya tukio" : "Event date"} style={styles.control} onPress={() => { setPending(value ? localDate(value) : new Date()); setOpen(true); }}>
      <Ionicons name="calendar-outline" size={20} color={colors.teal} /><Text style={styles.value}>{value ? localDate(value).toLocaleDateString(sw ? "sw-TZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : (sw ? "Weka tarehe" : "Add a date")}</Text>
    </Pressable>
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <View style={styles.modal}>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} style={styles.scrim} onPress={() => setOpen(false)} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.heading}><Text style={styles.title}>{sw ? "Tarehe ya tukio" : "Event date"}</Text><Pressable accessibilityRole="button" style={styles.close} onPress={() => setOpen(false)} accessibilityLabel={sw ? "Funga" : "Close"}><Ionicons name="close" size={22} color={colors.burgundy} /></Pressable></View>
          {Platform.OS === "web" ? createElement("input", { type: "date", "aria-label": sw ? "Tarehe ya tukio" : "Event date", value: dateValue(pending), max: today, onInput: (event: { currentTarget: { value: string } }) => { if (event.currentTarget.value) setPending(localDate(event.currentTarget.value)); }, style: { padding: 16, fontSize: 16, width: "100%", boxSizing: "border-box" } }) : <DateTimePicker value={pending} mode="date" display={Platform.OS === "ios" ? "inline" : "default"} maximumDate={new Date()} themeVariant="light" accentColor={colors.burgundy} onChange={(event, date) => {
            if (event.type === "dismissed") { setOpen(false); return; }
            if (date) { setPending(date); if (Platform.OS === "android") { onChange(dateValue(date)); setOpen(false); } }
          }} />}
          {Platform.OS !== "android" ? <Button label={sw ? "Weka tarehe hii" : "Use this date"} disabled={!valid} onPress={save} /> : null}
          <Pressable accessibilityRole="button" style={styles.option} onPress={() => { onChange(""); setOpen(false); }}><Text style={[styles.value, styles.muted]}>{sw ? "Sikumbuki tarehe" : "I don't remember the date"}</Text></Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  field: { gap: 8, marginBottom: 12 }, label: { fontFamily: type.medium, fontSize: 14, color: colors.charcoal },
  control: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, padding: 16, borderRadius: 8, backgroundColor: "#F3F5F4" },
  disabled: { opacity: 0.5 }, value: { flex: 1, fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.charcoal }, muted: { color: colors.inkMuted, fontFamily: type.regular },
  modal: { flex: 1, justifyContent: "flex-end" }, scrim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(25,23,25,0.3)" },
  sheet: { maxHeight: "78%", backgroundColor: "white", paddingHorizontal: 20, paddingBottom: 12, borderTopLeftRadius: 20, borderTopRightRadius: 20, gap: 12 },
  heading: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 10 },
  title: { flex: 1, fontFamily: type.semibold, fontSize: 19, lineHeight: 26, color: colors.charcoal }, close: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  search: { minHeight: 52, backgroundColor: "#F3F5F4", paddingHorizontal: 16, borderRadius: 8, fontFamily: type.regular, fontSize: 15 },
  options: { paddingBottom: 12 }, option: { flexDirection: "row", gap: 12, alignItems: "center", minHeight: 56, paddingVertical: 14 },
  selected: { color: colors.burgundy, fontFamily: type.medium }, empty: { paddingVertical: 20, fontFamily: type.regular, color: colors.inkMuted },
});
