// Node-only bounded SSE reader. Decode each delta separately: concatenating padded
// base64 strings would silently truncate audio. Require the final usage receipt.
export async function readSpeechStream(response: Response) {
  if (!response.body) throw new Error('Speech audio is unavailable.');
  const reader = response.body.getReader(); const decoder = new TextDecoder();
  const chunks: Buffer[] = []; let pending = ''; let size = 0; let received = 0;
  let usage: { input_tokens: number; output_tokens: number } | undefined;
  const consume = (block: string) => {
    const data = block.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n');
    if (!data || data === '[DONE]') return;
    const event = JSON.parse(data);
    if (event.type === 'speech.audio.delta') {
      if (usage || typeof event.audio !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(event.audio)) throw new Error('Invalid speech audio.');
      const bytes = Buffer.from(event.audio, 'base64'); size += bytes.length;
      if (size > 1024 * 1024) throw new Error('Spoken answer exceeded the audio limit.');
      chunks.push(bytes);
    } else if (event.type === 'speech.audio.done') {
      if (usage || !Number.isSafeInteger(event.usage?.input_tokens) || event.usage.input_tokens < 0 || !Number.isSafeInteger(event.usage?.output_tokens) || event.usage.output_tokens <= 0) throw new Error('Speech usage receipt is unavailable.');
      usage = event.usage;
    } else throw new Error('Speech could not be completed.');
  };
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (value) { received += value.byteLength; if (received > 2 * 1024 * 1024) throw new Error('Speech response is too large.'); }
      pending += decoder.decode(value, { stream: !done });
      pending = pending.replace(/\r\n/g, '\n');
      let boundary: number;
      while ((boundary = pending.indexOf('\n\n')) !== -1) { consume(pending.slice(0, boundary)); pending = pending.slice(boundary + 2); }
      if (done) break;
    }
    if (pending.trim()) consume(pending);
    if (!usage || !size) throw new Error('Speech did not complete. Please try again.');
    return { audioBase64: Buffer.concat(chunks).toString('base64'), usage };
  } finally { await reader.cancel().catch(() => undefined); }
}
