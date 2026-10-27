// Browser recordings vary by codec. Convert locally to bounded mono PCM WAV so
// the backend can calculate duration from actual samples before any paid call.
export async function recordingBlobToWav(blob: Blob): Promise<Blob> {
  if (!blob.size || blob.size > 10 * 1024 * 1024) throw new Error("Choose a recording under 10 MB.");
  const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  const signature = (start: number, size: number) => String.fromCharCode(...header.slice(start, start + size));
  // PCM files need no browser audio decoder. The server validates their sample
  // count and format before spending, including recordings chosen on the web.
  if (signature(0, 4) === "RIFF" && signature(8, 4) === "WAVE") return new Blob([blob], {type:"audio/wav"});
  if (typeof AudioContext === "undefined") throw new Error("This browser cannot decode the recording. Choose a WAV file or use the mobile app.");
  const context = new AudioContext();
  try {
    const audio = await context.decodeAudioData(await blob.arrayBuffer());
    if (audio.duration < 0.5 || audio.duration > 120) throw new Error("Record between one second and two minutes.");
    const samples = audio.getChannelData(0), rate = 16000;
    const count = Math.floor(audio.duration * rate);
    const buffer = new ArrayBuffer(44 + count * 2), view = new DataView(buffer);
    const word = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
    word(0,"RIFF"); view.setUint32(4,36+count*2,true); word(8,"WAVE"); word(12,"fmt "); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,rate,true); view.setUint32(28,rate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); word(36,"data"); view.setUint32(40,count*2,true);
    for(let i=0;i<count;i++) { const sample=Math.max(-1,Math.min(1,samples[Math.min(samples.length-1,Math.floor(i*audio.sampleRate/rate))])); view.setInt16(44+i*2,sample<0?sample*32768:sample*32767,true); }
    return new Blob([buffer],{type:"audio/wav"});
  } finally { await context.close(); }
}
