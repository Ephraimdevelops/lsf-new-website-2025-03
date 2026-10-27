import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { prepareResearchPdf } from '../src/lib/prepareResearchPdf.ts';
const bytes=Buffer.from('%PDF-1.4\nsynthetic public research file');
const expected={filename:'research.pdf',byteSize:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
test('archive migration verifies original bytes before creating the security-upload file',async()=>{
 const file=await prepareResearchPdf(new Blob([bytes]),expected);assert.equal(file.type,'application/pdf');assert.equal(file.name,'research.pdf');assert.equal(file.size,expected.byteSize);
});
test('archive migration rejects altered, missing, non-PDF and oversized data',async()=>{
 await assert.rejects(prepareResearchPdf(new Blob([bytes]),{...expected,sha256:'0'.repeat(64)}),/checksum/);
 await assert.rejects(prepareResearchPdf(new Blob([]),expected),/size/);
 await assert.rejects(prepareResearchPdf(new Blob(['X'.repeat(bytes.length)]),expected),/not a PDF/);
 await assert.rejects(prepareResearchPdf(new Blob([new Uint8Array(16*1024*1024)]),{...expected,byteSize:16*1024*1024}),/size/);
});
