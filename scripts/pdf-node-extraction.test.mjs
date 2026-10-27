import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extractPdfText } from '../convex/lib/pdfText.ts';

test('server extractor reads the uploaded 32-page statute without browser globals', async () => {
    assert.equal(typeof globalThis.window, 'undefined');
    const file = await readFile(new URL('../docs/haki-yangu/saada-research-pack-2026-10-05/source-files/proc-limitation.pdf', import.meta.url));
    const text = await extractPdfText(new Uint8Array(file));
    assert.ok(text.length > 60000);
    assert.match(text, /limitation/i);
    assert.match(text, /schedule/i);
});

test('server extractor rejects malformed bytes instead of indexing invented text', async () => {
    await assert.rejects(extractPdfText(new TextEncoder().encode('This is not a PDF.')));
});
