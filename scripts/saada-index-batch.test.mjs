import test from 'node:test';import assert from 'node:assert/strict';import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {indexSaadaChunks}=loadHandlerModule('convex/lib/saadaIndexBatch.ts');
test('source batching preserves every chunk in order while bounding provider requests and vector writes',async()=>{
 const input=Array.from({length:237},(_,i)=>'source passage '+i),requests=[],writes=[];
 await indexSaadaChunks(input,async batch=>{requests.push(batch.length);return batch.map((text,index)=>({index,embedding:[input.indexOf(text),1]})).reverse();},async rows=>writes.push(rows));
 assert.deepEqual(requests,[100,100,37]);assert.ok(writes.every(rows=>rows.length<=20));
 assert.deepEqual(writes.flat().map(r=>r.text),input);assert.deepEqual(writes.flat().map(r=>r.index),input.map((_,i)=>i));assert.deepEqual(writes.flat().map(r=>r.embedding[0]),input.map((_,i)=>i));
});
test('incomplete, duplicate or nonfinite embeddings cannot be written or marked as complete',async()=>{
 for(const response of [[],[{index:0,embedding:[1]},{index:0,embedding:[2]}],[{index:0,embedding:[NaN]},{index:1,embedding:[2]}],[{index:0,embedding:[1]},{index:2,embedding:[2]}]]){
  let writes=0;await assert.rejects(indexSaadaChunks(['one','two'],async()=>response,async()=>{writes++;}),/invalid source embeddings/);assert.equal(writes,0);
 }
});
test('a failed write stops later requests and propagates to the source recovery lifecycle',async()=>{
 let calls=0,writes=0;await assert.rejects(indexSaadaChunks(Array(250).fill('text'),async batch=>{calls++;return batch.map((_,index)=>({index,embedding:[1]}));},async()=>{if(++writes===2)throw Error('Synthetic transaction failure');}),/transaction failure/);assert.equal(calls,1);assert.equal(writes,2);
});
