// Provider requests and database writes have separate bounds. Keep large vectors
// out of a single database mutation while avoiding a paid API round trip per write.
type EmbeddingRow = { index: number; embedding: number[] };
type IndexedChunk = { text: string; embedding: number[]; index: number };
export async function indexSaadaChunks(
  chunks: string[],
  embed: (input: string[]) => Promise<EmbeddingRow[]>,
  write: (chunks: IndexedChunk[]) => Promise<unknown>,
) {
  for (let start = 0; start < chunks.length; start += 100) {
    const batch = chunks.slice(start, start + 100);
    const response = await embed(batch);
    if (response.length !== batch.length || new Set(response.map(row=>row.index)).size !== batch.length || response.some(row=>!Number.isSafeInteger(row.index)||row.index<0||row.index>=batch.length||!Array.isArray(row.embedding)||!row.embedding.length||row.embedding.some(value=>!Number.isFinite(value)))) throw new Error('Incomplete or invalid source embeddings.');
    const ordered = [...response].sort((a,b)=>a.index-b.index);
    for (let offset = 0; offset < batch.length; offset += 20) {
      await write(batch.slice(offset,offset+20).map((text,index)=>({text,embedding:ordered[offset+index].embedding,index:start+offset+index})));
    }
  }
}
