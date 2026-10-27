import { plainError } from "../../../shared/plainLanguage";
import { BrandLoadingMark } from '../components/BrandLoading';
import Ionicons from "@expo/vector-icons/Ionicons";
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Alert, AppState, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, type } from "../theme";

class VoiceFeedbackError extends Error {}

export function IntakeVoice({ sw, onTranscribe, onText, disabled, consentMessage }: { sw: boolean; onTranscribe: (uri: string) => Promise<string>; onText: (text: string) => void; disabled: boolean; consentMessage?: string }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 250);
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const operation = useRef(false);
  const player = useAudioPlayer(uri);
  const playerRef = useRef(player);
  playerRef.current = player;
  const active = useRef(true);
  const unavailable = useRef(disabled);
  unavailable.current = disabled;
  const wasRecording = useRef(false);
  const epoch = useRef(0);
  function isCurrent(generation: number) { return active.current && epoch.current === generation; }
  useFocusEffect(useCallback(() => {
    function suspend() {
      active.current = false;
      epoch.current++;
      wasRecording.current = false;
      try { playerRef.current.pause(); } catch {}
      try { if (recorder.getStatus().isRecording) void recorder.stop().catch(() => {}); } catch {}
      void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    }
    function resume() { active.current = true; operation.current = false; setBusy(false); }
    if (AppState.currentState === "background") suspend(); else resume();
    const listener = AppState.addEventListener("change", next => {
      if (next === "background") suspend();
      else if (next === "active" && !active.current) resume();
    });
    return () => { listener.remove(); suspend(); };
  }, [recorder]));
  function feedback(caught: unknown, transcription = false) {
    if (caught instanceof VoiceFeedbackError) return caught.message;
    const known: Array<[string, string, string]> = [
      ["Sign in to use transcription. You can type without signing in.", "Ingia ili kubadili sauti kuwa maandishi. Unaweza kuandika bila kuingia.", "Sign in to transcribe. You can type without signing in."],
      ["Ingia kutumia unukuzi wa sauti. Unaweza kuandika bila kuingia.", "Ingia ili kubadili sauti kuwa maandishi. Unaweza kuandika bila kuingia.", "Sign in to transcribe. You can type without signing in."],
      ["Recording is unavailable or exceeds 10 MB", "Rekodi haipatikani au inazidi MB 10. Rekodi tena au andika jibu lako.", "The recording is unavailable or exceeds 10 MB. Record again or type your answer."],
    ];
    const message = caught && typeof caught === "object" && "message" in caught ? caught.message : undefined;
    const match = known.find(([key]) => message === key);
    if (match) return match[sw ? 1 : 2];
    return plainError(caught, sw ? "sw" : "en", transcription
      ? (sw ? "Imeshindikana kubadili sauti kuwa maandishi. Jaribu tena au andika jibu lako." : "Could not transcribe this recording. Try again or type your answer.")
      : (sw ? "Rekodi haijafanikiwa. Jaribu tena au andika jibu lako." : "Recording failed. Try again or type your answer."));
  }
  useEffect(() => {
    if (!active.current || operation.current) return;
    if (state.isRecording) { wasRecording.current = true; return; }
    if (wasRecording.current) {
      wasRecording.current = false;
      if (recorder.uri && recorder.getStatus().durationMillis >= 500) setUri(recorder.uri);
      else setError(sw ? "Rekodi kwa muda mrefu kidogo." : "Please record a little longer.");
      void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    }
  }, [state.isRecording, state.durationMillis, recorder, sw]);
  async function toggle() {
    if (!active.current || unavailable.current || operation.current) return;
    const generation = epoch.current;
    operation.current = true; setError(""); setBusy(true);
    let starting = false;
    try {
      const current = recorder.getStatus();
      if (current.isRecording) {
        wasRecording.current = false;
        await recorder.stop();
        if (!isCurrent(generation)) return;
        await setAudioModeAsync({ allowsRecording: false });
        if (!isCurrent(generation)) return;
        if (!recorder.uri || current.durationMillis < 500) throw new VoiceFeedbackError(sw ? "Rekodi kwa muda mrefu kidogo." : "Please record a little longer.");
        setUri(recorder.uri);
      } else {
        const permission = await requestRecordingPermissionsAsync();
        if (!isCurrent(generation) || unavailable.current) return;
        if (!permission.granted) throw new VoiceFeedbackError(sw ? "Ruhusu kipaza sauti kwenye mipangilio au andika jibu." : "Allow microphone access in settings, or type your answer.");
        player.pause();
        starting = true;
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        if (!isCurrent(generation)) return;
        if (unavailable.current) { await setAudioModeAsync({ allowsRecording: false }); return; }
        await recorder.prepareToRecordAsync();
        if (!isCurrent(generation)) return;
        if (unavailable.current) { await setAudioModeAsync({ allowsRecording: false }); return; }
        recorder.record({ forDuration: 120 });
        wasRecording.current = true;
        setUri(null); setText("");
      }
    } catch (caught) {
      if (isCurrent(generation)) {
        if (starting) await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
        if (isCurrent(generation)) setError(feedback(caught));
      }
    } finally { if (isCurrent(generation)) { operation.current = false; setBusy(false); } }
  }
  function transcribe() {
    if (!active.current || unavailable.current || operation.current || !uri) return;
    const generation = epoch.current;
    const title = sw ? "Badili sauti kuwa maandishi?" : "Turn recording into text?";
    const message = consentMessage ?? (sw ? "Rekodi hii itahifadhiwa kwenye rasimu yako na kutumwa kwa OpenAI ibadilishwe kuwa maandishi. Kagua maandishi kabla ya kuyatumia." : "This recording will be uploaded to your draft and sent to OpenAI for transcription. Review the text before using it.");
    const run = async () => {
      if (!isCurrent(generation) || unavailable.current || !uri || operation.current) return;
      operation.current = true; setBusy(true); setError("");
      try {
        player.pause();
        const result = await onTranscribe(uri);
        if (!isCurrent(generation)) return;
        if (!result.trim()) throw new VoiceFeedbackError(sw ? "Hakuna maneno yaliyopatikana. Jaribu tena au andika jibu lako." : "No words were detected. Try again or type your answer.");
        setText(result);
      } catch (caught) { if (isCurrent(generation)) setError(feedback(caught, true)); }
      finally { if (isCurrent(generation)) { operation.current = false; setBusy(false); } }
    };
    if (Platform.OS === "web") { if (window.confirm(title + "\n\n" + message)) void run(); }
    else Alert.alert(title,message,[{text:sw?"Ghairi":"Cancel",style:"cancel"},{text:sw?"Nimekubali, badili":"I agree, transcribe",onPress:()=>void run()}]);
  }
  async function playRecording() {
    if (!active.current || unavailable.current || operation.current) return;
    const generation = epoch.current;
    operation.current = true;
    try { await player.seekTo(0); if (isCurrent(generation) && !unavailable.current) player.play(); }
    catch (caught) { if (isCurrent(generation)) setError(plainError(caught, sw ? "sw" : "en", sw ? "Rekodi haijafunguka. Jaribu tena au andika jibu lako." : "Could not play the recording. Try again or type your answer.")); }
    finally { if (isCurrent(generation)) operation.current = false; }
  }

  return <View style={styles.container}>
    <View style={styles.row}><Pressable disabled={busy || disabled} accessibilityRole="button" accessibilityLabel={state.isRecording ? (sw ? "Simamisha rekodi" : "Stop recording") : (sw ? "Rekodi jibu" : "Record answer")} style={styles.button} onPress={() => void toggle()}><Ionicons name={state.isRecording ? "stop-circle" : "mic-outline"} size={22} color={colors.burgundy} /><Text style={styles.label}>{state.isRecording ? `${sw ? "Simamisha" : "Stop"} · ${Math.floor(state.durationMillis / 1000)}s` : (sw ? "Eleza kwa sauti" : "Describe by voice")}</Text></Pressable>{uri ? <Pressable disabled={busy} style={styles.button} accessibilityLabel={sw ? "Sikiliza rekodi" : "Listen to recording"} onPress={() => void playRecording()}><Ionicons name="play" size={20} color={colors.teal} /></Pressable> : null}</View>
    {uri && !text ? <Pressable disabled={busy || disabled} style={styles.button} onPress={transcribe}>{busy ? <BrandLoadingMark small/> : <Ionicons name="text-outline" size={22} color={colors.teal} />}<Text style={styles.label}>{busy ? (sw ? "Inabadilisha kuwa maandishi..." : "Transcribing...") : (sw ? "Badili kuwa maandishi" : "Transcribe recording")}</Text></Pressable> : null}
    {text ? <View style={styles.preview}><Text style={styles.body}>{text}</Text><Pressable style={styles.button} onPress={() => { if (!active.current || unavailable.current || operation.current) return; onText(text); if (active.current) { setText(""); setUri(null); } }}><Ionicons name="checkmark" size={20} color={colors.teal} /><Text style={styles.label}>{sw ? "Tumia maandishi haya" : "Use this text"}</Text></Pressable><Pressable style={styles.button} onPress={() => { if (active.current && !unavailable.current && !operation.current) setText(""); }}><Text style={styles.body}>{sw ? "Jaribu tena" : "Retry transcription"}</Text></Pressable></View> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({ container: { gap: 8 }, row: { flexDirection: "row", gap: 8 }, button: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 48, paddingHorizontal: 8 }, label: { fontFamily: type.medium, fontSize: 14, color: colors.charcoal }, body: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.inkMuted }, preview: { backgroundColor: "#F3F5F4", padding: 16, borderRadius: 8, gap: 8 }, error: { fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.burgundy } });
