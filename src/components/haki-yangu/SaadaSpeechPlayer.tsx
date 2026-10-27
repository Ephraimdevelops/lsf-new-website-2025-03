import { useAction } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Play, Square, X } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

/** Mounted only after a deliberate Listen click; one player per conversation. */
export function SaadaSpeechPlayer({ messageId, sw, onClose }: { messageId: Id<'sara_chats'>; sw: boolean; onClose: () => void }) {
  const speak = useAction(api.saadaMediaActions.speak);
  const [state, setState] = useState<'loading' | 'playing' | 'ready'>('loading');
  const [position, setPosition] = useState({ current: 0, duration: 0 });
  const [error, setError] = useState(''); const [part, setPart] = useState(0); const [count, setCount] = useState(1);
  const alive = useRef(false); const run = useRef(0); const current = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const clips = useRef(new Map<number, { url: string; count: number }>());
  const inFlight = useRef(new Map<number, Promise<{ url: string; count: number }>>());
  const busy = useRef(false);
  const copy = useRef(sw); copy.current = sw;
  function stop() {
    run.current++; busy.current = false;
    if (audio.current) { audio.current.pause(); audio.current.currentTime = 0; audio.current.onended = null; }
    setPosition(value => ({ ...value, current: 0 })); setState('ready');
  }
  async function play(index: number) {
    if (!alive.current || busy.current) return;
    if (document.hidden) { setState('ready'); return; }
    const token = ++run.current; busy.current = true; current.current = index; setPart(index); setError(''); setState('loading');
    if (audio.current) audio.current.pause();
    try {
      let clip = clips.current.get(index);
      if (!clip) {
        let request = inFlight.current.get(index);
        if (!request) {
          request = speak({ messageId, partIndex: index, consent: true }).then(result => {
            if (!alive.current) throw new Error('Player closed.');
            const bytes = Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0));
            const value = { url: URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' })), count: result.partCount };
            clips.current.set(index, value); return value;
          });
          inFlight.current.set(index, request);
          void request.finally(() => inFlight.current.delete(index)).catch(() => undefined);
        }
        clip = await request;
      }
      if (token !== run.current || !alive.current) return;
      setCount(clip.count);
      const player = new Audio(clip.url); audio.current = player; setPosition({ current: 0, duration: 0 });
      const updatePosition = () => { if (token === run.current && alive.current) setPosition({ current: player.currentTime, duration: Number.isFinite(player.duration) ? player.duration : 0 }); };
      player.ontimeupdate = updatePosition; player.onloadedmetadata = updatePosition;
      player.onended = () => {
        if (token !== run.current || !alive.current) return;
        if (index + 1 < clip!.count) void play(index + 1);
        else { current.current = 0; setPart(0); setState('ready'); }
      };
      player.onerror = () => { if (token === run.current && alive.current) { setState('ready'); setError(copy.current ? 'Sauti haijacheza. Jaribu tena.' : 'Audio could not play. Please try again.'); } };
      try { await player.play(); if (token === run.current && alive.current) setState('playing'); }
      catch { if (token === run.current && alive.current) { setState('ready'); setError(copy.current ? 'Gusa Cheza kuanza sauti.' : 'Tap Play to start the audio.'); } }
    } catch (caught) {
      if (token === run.current && alive.current) { setState('ready'); setError(copy.current ? 'Sauti haipatikani sasa. Jaribu tena au soma jibu.' : 'Spoken audio is unavailable. Please try again or read the answer.'); }
    } finally { if (token === run.current) busy.current = false; }
  }
  useEffect(() => {
    alive.current = true;
    // Defer one tick so React's development effect replay cannot issue two paid calls.
    const timer = setTimeout(() => void play(0), 0);
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      alive.current = false; run.current++; clearTimeout(timer); document.removeEventListener('visibilitychange', hide);
      if (audio.current) { audio.current.pause(); audio.current.onended = null; audio.current.src = ''; }
      for (const clip of clips.current.values()) URL.revokeObjectURL(clip.url);
      clips.current.clear();
    };
  }, [messageId]);
  return <div className="mt-3 rounded-xl bg-stone-50 px-3 py-2" aria-label={sw ? 'Sauti ya jibu' : 'Answer audio'}>
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => state === 'ready' ? void play(current.current) : stop()} className="flex min-h-11 items-center gap-2 text-sm font-medium text-primary" aria-label={state === 'ready' ? (sw ? 'Cheza jibu' : 'Play answer') : (sw ? 'Simamisha sauti' : 'Stop audio')}>
        {state === 'loading' ? <Loader2 size={16} className="animate-spin"/> : state === 'playing' ? <Square size={15}/> : <Play size={16}/>}
        {state === 'loading' ? (sw ? 'Inaandaa sauti…' : 'Preparing audio…') : state === 'playing' ? (sw ? 'Simamisha' : 'Stop') : (sw ? 'Cheza' : 'Play')}
      </button>
      {position.duration > 0 && <span className="text-xs text-stone-500">{Math.floor(position.current)}s / {Math.ceil(position.duration)}s</span>}
      {count > 1 && <span className="text-xs text-stone-500">{sw ? 'Sehemu' : 'Part'} {part + 1}/{count}</span>}
      <button type="button" onClick={onClose} className="ml-auto p-3 text-stone-500" aria-label={sw ? 'Funga sauti' : 'Close audio'}><X size={16}/></button>
    </div>
    <p className="text-[11px] text-stone-500">{sw ? 'Sauti ya AI · OpenAI' : 'AI-generated voice · OpenAI'}</p>
    {error && <p role="alert" className="mt-2 text-xs text-primary">{error}</p>}
  </div>;
}
