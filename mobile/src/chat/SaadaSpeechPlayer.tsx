import Ionicons from '@expo/vector-icons/Ionicons';
import { useAction } from 'convex/react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../backend/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { colors, type } from '../theme';

export function SaadaSpeechPlayer({ messageId, sw, onClose }: { messageId: Id<'sara_chats'>; sw: boolean; onClose: () => void }) {
  const speak = useAction(api.saadaMediaActions.speak);
  const player = useAudioPlayer(null); const status = useAudioPlayerStatus(player);
  const [state, setState] = useState<'loading' | 'playing' | 'ready'>('loading');
  const [error, setError] = useState(''); const [part, setPart] = useState(0); const [count, setCount] = useState(1);
  const alive = useRef(false); const run = useRef(0); const current = useRef(0); const total = useRef(1); const busy = useRef(false); const wanted = useRef(false); const focused = useRef(true);
  const inFlight = useRef(new Map<number, Promise<{ uri: string; count: number }>>());
  const clips = useRef(new Map<number, { uri: string; count: number }>());
  const copy = useRef(sw); copy.current = sw;
  function stop() { run.current++; busy.current = false; wanted.current = false; player.pause(); void player.seekTo(0).catch(() => undefined); setState('ready'); }
  async function play(index: number) {
    if (!alive.current || busy.current) return;
    if (!focused.current || (AppState.currentState && AppState.currentState !== 'active')) { setState('ready'); return; }
    const token = ++run.current; busy.current = true; wanted.current = false; player.pause();
    current.current = index; setPart(index); setError(''); setState('loading');
    try {
      let clip = clips.current.get(index);
      if (!clip) {
        let request = inFlight.current.get(index);
        if (!request) {
          request = (async () => {
            const result = await speak({ messageId, partIndex: index, consent: true });
            if (!alive.current) throw new Error('Player closed.');
            let uri: string;
            if (Platform.OS === 'web') {
              const bytes = Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0));
              uri = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
            } else {
              if (!FileSystem.cacheDirectory) throw new Error('Audio cache is unavailable.');
              uri = `${FileSystem.cacheDirectory}saada-speech-${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`;
              await FileSystem.writeAsStringAsync(uri, result.audioBase64, { encoding: FileSystem.EncodingType.Base64 });
            }
            if (!alive.current) { if (Platform.OS === 'web') URL.revokeObjectURL(uri); else await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined); throw new Error('Player closed.'); }
            const value = { uri, count: result.partCount }; clips.current.set(index, value); return value;
          })();
          inFlight.current.set(index, request);
          void request.finally(() => inFlight.current.delete(index)).catch(() => undefined);
        }
        clip = await request;
      }
      if (token !== run.current || !alive.current) return;
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true, shouldPlayInBackground: false });
      if (token !== run.current || !alive.current) return;
      total.current = clip.count; setCount(clip.count); player.replace({ uri: clip.uri }); player.play(); wanted.current = true; setState('playing');
    } catch {
      if (token === run.current && alive.current) { wanted.current = false; setState('ready'); setError(copy.current ? 'Sauti haijacheza. Gusa Cheza kujaribu tena au soma jibu.' : 'Audio could not play. Tap Play to retry or read the answer.'); }
    } finally { if (token === run.current) busy.current = false; }
  }
  useEffect(() => {
    if (status.didJustFinish && wanted.current && !busy.current) {
      wanted.current = false;
      if (current.current + 1 < total.current) void play(current.current + 1);
      else { current.current = 0; setPart(0); setState('ready'); }
    }
  }, [status.didJustFinish]);
  useEffect(() => {
    if (state === 'playing' && status.isLoaded && !status.playing && !status.isBuffering && !status.didJustFinish) { wanted.current = false; setState('ready'); }
  }, [status.playing, status.isLoaded, status.isBuffering]);
  useFocusEffect(useCallback(() => { focused.current = true; return () => {
    focused.current = false;
    run.current++; wanted.current = false; busy.current = false;
    try { player.pause(); } catch { /* The hook may already have released the player. */ }
    if (alive.current) setState('ready');
  }; }, [player]));
  useEffect(() => {
    alive.current = true;
    const timer = setTimeout(() => void play(0), 0);
    const subscription = AppState.addEventListener('change', next => { if (next !== 'active') stop(); });
    return () => {
      alive.current = false; wanted.current = false; run.current++; clearTimeout(timer); subscription.remove();
      // useAudioPlayer disposes playback on unmount; release our private cache too.
      for (const clip of clips.current.values()) {
        if (Platform.OS === 'web') URL.revokeObjectURL(clip.uri);
        else void FileSystem.deleteAsync(clip.uri, { idempotent: true }).catch(() => undefined);
      }
      clips.current.clear();
    };
  }, [messageId]);
  return <View style={styles.panel} accessibilityLabel={sw ? 'Sauti ya jibu' : 'Answer audio'}>
    <View style={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel={state === 'ready' ? (sw ? 'Cheza jibu' : 'Play answer') : (sw ? 'Simamisha sauti' : 'Stop audio')} onPress={() => state === 'ready' ? void play(current.current) : stop()} style={styles.button}>
        <Ionicons name={state === 'playing' ? 'stop' : state === 'loading' ? 'hourglass-outline' : 'play'} size={18} color={colors.burgundy}/>
        <Text style={styles.label}>{state === 'loading' ? (sw ? 'Inaandaa sauti…' : 'Preparing audio…') : state === 'playing' ? (sw ? 'Simamisha' : 'Stop') : (sw ? 'Cheza' : 'Play')}</Text>
      </Pressable>
      {status.isLoaded && status.duration > 0 && <Text style={styles.caption}>{Math.floor(status.currentTime)}s / {Math.ceil(status.duration)}s</Text>}
      {count > 1 && <Text style={styles.caption}>{sw ? 'Sehemu' : 'Part'} {part + 1}/{count}</Text>}
      <Pressable style={styles.close} accessibilityRole="button" accessibilityLabel={sw ? 'Funga sauti' : 'Close audio'} onPress={onClose}><Ionicons name="close" size={18} color={colors.inkMuted}/></Pressable>
    </View>
    <Text style={styles.caption}>{sw ? 'Sauti ya AI · OpenAI' : 'AI-generated voice · OpenAI'}</Text>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
  </View>;
}
const styles = StyleSheet.create({ panel: { marginTop: 8, padding: 12, borderRadius: 12, backgroundColor: '#F7F5F3' }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 }, button: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8 }, label: { fontFamily: type.medium, fontSize: 14, color: colors.burgundy }, caption: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted }, close: { marginLeft: 'auto', padding: 14 }, error: { marginTop: 8, fontFamily: type.regular, fontSize: 13, color: colors.burgundy } });
