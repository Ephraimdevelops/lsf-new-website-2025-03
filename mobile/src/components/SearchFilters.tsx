import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, type ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, type } from "../theme";

/** A single search row; less frequent choices stay in a labelled sheet. */
export function SearchFilters({ value, onChange, placeholder, sw, children, label, title, count = 0, summary, onReset, onSubmit }: {
  value: string; onChange: (value: string) => void; placeholder: string; sw: boolean;
  children?: ReactNode; label?: string; title?: string; count?: number; summary?: string;
  onReset?: () => void; onSubmit?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return <View style={styles.wrap}>
    <View style={styles.bar}>
      {value ? <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Futa utafutaji" : "Clear search"} onPress={() => onChange("")} style={styles.clear}><Ionicons name="close" size={19} color={colors.inkMuted} /></Pressable> : <Ionicons name="search-outline" size={20} color={colors.teal} />}
      <TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.inkMuted} style={styles.input} returnKeyType="search" onSubmitEditing={onSubmit} autoCorrect={false} />
      {children && <Pressable accessibilityRole="button" accessibilityLabel={title || label} aria-expanded={open} accessibilityState={{ expanded: open }} onPress={() => { Keyboard.dismiss(); setOpen(true); }} style={[styles.choose, count > 0 && styles.active]}>
        <Ionicons name="options-outline" size={18} color={colors.burgundy} /><Text style={styles.chooseText}>{label || (sw ? "Eneo na huduma" : "Area & service")}{count ? ` · ${count}` : ""}</Text>
      </Pressable>}
    </View>
    {!!summary && <Text style={styles.summary}>{summary}</Text>}
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modal}>
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} style={styles.scrim} onPress={() => setOpen(false)} />
        <SafeAreaView edges={["top", "bottom"]} style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.heading}><Text style={styles.title}>{title || (sw ? "Unatafuta wapi?" : "Where are you looking?")}</Text><Pressable accessibilityRole="button" accessibilityLabel={sw ? "Funga" : "Close"} style={styles.close} onPress={() => setOpen(false)}><Ionicons name="close" size={24} color={colors.burgundy} /></Pressable></View>
          <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}</ScrollView>
          <View style={styles.actions}><Pressable accessibilityRole="button" style={styles.done} onPress={() => { setOpen(false); onSubmit?.(); }}><Text style={styles.doneText}>{onSubmit ? (sw ? "Tafuta msaada" : "Find help") : (sw ? "Onyesha matokeo" : "Show results")}</Text><Ionicons name="arrow-forward" size={18} color="white" /></Pressable>{onReset && count > 0 ? <Pressable accessibilityRole="button" style={styles.reset} onPress={onReset}><Text style={styles.chooseText}>{sw ? "Ondoa vichujio" : "Reset filters"}</Text></Pressable> : null}</View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12, gap: 7 },
  bar: { flexDirection: "row", alignItems: "center", minHeight: 56, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.warmBackground, paddingLeft: 12, paddingRight: 4, gap: 6 },
  input: { flex: 1, minWidth: 0, minHeight: 52, fontFamily: type.regular, fontSize: 15, color: colors.ink },
  clear: { width: 48, minHeight: 48, alignItems: "center", justifyContent: "center" },
  choose: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, minHeight: 48, borderRadius: 9, backgroundColor: colors.burgundySoft },
  active: { borderWidth: 1, borderColor: colors.burgundy },
  chooseText: { fontFamily: type.medium, fontSize: 14, color: colors.burgundy },
  summary: { fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.inkMuted },
  modal: { flex: 1, justifyContent: "flex-end" }, scrim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(25,23,25,0.35)" },
  sheet: { maxHeight: "78%", backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20 },
  heading: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 12 }, title: { flex: 1, fontFamily: type.semibold, fontSize: 22, lineHeight: 30, color: colors.ink }, close: { width: 48, minHeight: 48, alignItems: "center", justifyContent: "center" },
  content: { paddingVertical: 16, gap: 12 }, actions: { paddingVertical: 12, gap: 8 }, reset: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  done: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: colors.burgundy, borderRadius: 10 }, doneText: { fontFamily: type.semibold, fontSize: 16, color: "white" },
});
