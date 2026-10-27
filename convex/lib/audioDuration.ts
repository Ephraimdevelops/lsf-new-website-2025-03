// Parse the recording bytes on the server; never trust a client-supplied timer.
// Chat recorders emit PCM WAVE (browser) or MPEG-4 AAC (native Expo).
export function recordingDuration(bytes: Uint8Array, mime: string): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const text = (start: number, size: number) => String.fromCharCode(...bytes.slice(start, start + size));
  let seconds = 0;
  if (["audio/wav", "audio/x-wav"].includes(mime)) {
    if (text(0, 4) !== "RIFF" || text(8, 4) !== "WAVE") throw new Error("Invalid WAV recording.");
    if (bytes.length < 44 || view.getUint32(4,true) !== bytes.length - 8) throw new Error("Incomplete WAV recording.");
    let rate = 0, length = 0, formats = 0, dataChunks = 0;
    for (let pos = 12; pos + 8 <= bytes.length;) {
      const size = view.getUint32(pos + 4, true), end = pos + 8 + size;
      if (end > bytes.length) throw new Error("Incomplete recording.");
      if (text(pos, 4) === "fmt ") {
        if (++formats > 1) throw new Error("Invalid duplicate audio format.");
        if (size < 16 || view.getUint16(pos + 8, true) !== 1) throw new Error("Use a PCM WAV recording.");
        const channels = view.getUint16(pos + 10, true), sampleRate = view.getUint32(pos + 12, true), bits = view.getUint16(pos + 22, true);
        if (![1, 2].includes(channels) || sampleRate < 8000 || sampleRate > 96000 || ![8, 16, 24, 32].includes(bits)) throw new Error("Unsupported recording format.");
        rate = sampleRate * channels * bits / 8;
        if (view.getUint32(pos + 16, true) !== rate) throw new Error("Invalid WAV byte rate.");
      }
      if (text(pos, 4) === "data") { if (++dataChunks > 1) throw new Error("Invalid duplicate audio samples."); length += size; }
      pos = end + (size % 2);
    }
    seconds = length / rate;
  } else if (["audio/mp4", "audio/m4a"].includes(mime)) {
    if (text(4, 4) !== "ftyp") throw new Error("Invalid MPEG-4 recording.");
    const durations: number[] = [];
    const walk = (start: number, end: number, depth = 0) => {
      if (depth > 6) throw new Error("Invalid recording structure.");
      for (let pos = start; pos + 8 <= end;) {
        let size = view.getUint32(pos), header = 8;
        if (size === 1) { if (pos + 16 > end) throw new Error("Incomplete recording."); const high = view.getUint32(pos + 8); if (high !== 0) throw new Error("Recording too large."); size = view.getUint32(pos + 12); header = 16; }
        if (size === 0) size = end - pos;
        if (size < header || pos + size > end) throw new Error("Invalid recording box.");
        const kind = text(pos + 4, 4), content = pos + header;
        if (["moov", "trak", "mdia"].includes(kind)) walk(content, pos + size, depth + 1);
        if (kind === "mdhd") {
          const version = bytes[content], scaleOffset = content + (version === 1 ? 20 : 12), durationOffset = scaleOffset + 4;
          if (![0, 1].includes(version) || durationOffset + (version === 1 ? 8 : 4) > pos + size) throw new Error("Invalid recording duration.");
          const scale = view.getUint32(scaleOffset);
          const duration = version === 1 ? view.getUint32(durationOffset) * 4294967296 + view.getUint32(durationOffset + 4) : view.getUint32(durationOffset);
          if (!scale || !Number.isSafeInteger(duration)) throw new Error("Invalid recording duration.");
          durations.push(duration / scale);
        }
        pos += size;
      }
    };
    walk(0, bytes.length);
    seconds = Math.max(0, ...durations);
  } else throw new Error("Record a new voice question, or use a WAV or M4A recording.");
  if (!Number.isFinite(seconds) || seconds < 0.5 || seconds > 120) throw new Error("Record between one second and two minutes.");
  return seconds;
}
