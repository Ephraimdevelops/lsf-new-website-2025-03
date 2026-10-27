// Verify the archived original before passing it through the existing secure gateway.
export async function prepareResearchPdf(blob: Blob, expected: {filename:string;sha256:string;byteSize:number}) {
  if (blob.size !== expected.byteSize || blob.size <= 0 || blob.size > 15*1024*1024) throw new Error('The stored PDF size changed or exceeds the 15 MiB indexing limit.');
  const bytes=await blob.arrayBuffer();
  if (!new TextDecoder().decode(bytes.slice(0,1024)).includes('%PDF-')) throw new Error('The stored file is not a PDF.');
  const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
  if(sha256!==expected.sha256)throw new Error('The stored PDF checksum changed. Do not index this copy.');
  return new File([bytes],expected.filename,{type:'application/pdf'});
}
