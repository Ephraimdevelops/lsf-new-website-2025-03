import assert from 'node:assert/strict';
import test from 'node:test';
import {loadHandlerModule,harness} from './test-support/convex-handler-harness.mjs';
const {recordingDuration}=loadHandlerModule('convex/lib/audioDuration.ts');
const {canUseSaadaTool,saadaToolsForRoles}=loadHandlerModule('convex/lib/saadaAgent.ts');
const media=loadHandlerModule('convex/saadaMedia.ts');
function wav(seconds=1){const b=Buffer.alloc(44+Math.floor(16000*2*seconds));b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(16000,24);b.writeUInt32LE(32000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(b.length-44,40);return b;}
function box(name,bytes){const b=Buffer.alloc(8+bytes.length);b.writeUInt32BE(b.length);b.write(name,4);bytes.copy(b,8);return b;}
function m4a(seconds){const mdhd=Buffer.alloc(24);mdhd.writeUInt32BE(48000,12);mdhd.writeUInt32BE(seconds*48000,16);return Buffer.concat([box('ftyp',Buffer.from('M4A ')),box('moov',box('trak',box('mdia',box('mdhd',mdhd))))]);}
test('duration comes from actual PCM samples; unsupported and overlong audio fails before spending',()=>{
 assert.equal(recordingDuration(wav(2),'audio/wav'),2);assert.throws(()=>recordingDuration(wav(121),'audio/wav'),/two minutes/);assert.throws(()=>recordingDuration(wav(0.1),'audio/wav'),/one second/);assert.throws(()=>recordingDuration(wav(1),'audio/webm'),/Record a new/);
 const forged=wav();forged.writeUInt32LE(1,28);assert.throws(()=>recordingDuration(forged,'audio/wav'),/byte rate/);assert.throws(()=>recordingDuration(wav().subarray(0,50),'audio/wav'),/Incomplete/);
});
test('native MPEG-4 duration is parsed with bounds and rejects malformed boxes',()=>{
 assert.equal(recordingDuration(m4a(30),'audio/mp4'),30);assert.throws(()=>recordingDuration(m4a(121),'audio/mp4'),/two minutes/);const malformed=m4a(30);malformed.writeUInt32BE(999999,12);assert.throws(()=>recordingDuration(malformed,'audio/mp4'),/Invalid recording/);
});
test('work and reporting tools are filtered by actual role, not by claimed user wording',()=>{
 for(const name of ['my_work','staff_workload','knowledge_readiness','ai_spending','programme_results'])assert.equal(canUseSaadaTool(name,['user']),false);
 assert.equal(canUseSaadaTool('my_work',['provider_staff']),true);assert.equal(canUseSaadaTool('staff_workload',['supervisor']),true);assert.equal(canUseSaadaTool('programme_results',['donor']),true);assert.equal(canUseSaadaTool('ai_spending',['donor']),false);
 assert.ok(!saadaToolsForRoles(['user']).some(tool=>tool.function.name==='staff_workload'));
 assert.ok(saadaToolsForRoles(['user']).some(tool=>tool.function.name==='my_saved_documents'));
});
test('chat transcription checks sign-in, consent, ownership, purpose and scan receipt',async()=>{
 const h=harness(),alice=await h.user(),bob=await h.user();
 const id=await h.db.insert('managed_uploads',{storageId:'audio1',ownerId:alice,purpose:'saada_audio',status:'clean',size:32044,type:'audio/wav'});
 await assert.rejects(h.invoke(media.reserveAudio,{storageId:'audio1',consent:true}),/Unauthorized/);
 await assert.rejects(h.invoke(media.reserveAudio,{storageId:'audio1',consent:false},alice),/consent/);
 await assert.rejects(h.invoke(media.reserveAudio,{storageId:'audio1',consent:true},bob),/ownership/);
 assert.equal((await h.invoke(media.reserveAudio,{storageId:'audio1',consent:true},alice)).type,'audio/wav');
 await h.db.patch(id,{purpose:'case_voice'});await assert.rejects(h.invoke(media.reserveAudio,{storageId:'audio1',consent:true},alice),/purpose/);
 await h.db.patch(id,{purpose:'saada_audio',status:'scanning'});await assert.rejects(h.invoke(media.reserveAudio,{storageId:'audio1',consent:true},alice),/scan/);
});
test('a selected PCM WAV needs no browser audio decoder and keeps its valid sample data',async()=>{
 const {recordingBlobToWav}=loadHandlerModule('shared/voiceAudio.ts');const original=wav(2);const converted=await recordingBlobToWav(new Blob([original],{type:'audio/x-wav'}));assert.equal(converted.type,'audio/wav');assert.equal(recordingDuration(new Uint8Array(await converted.arrayBuffer()),converted.type),2);
});
