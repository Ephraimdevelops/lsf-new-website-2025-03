import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = await mkdtemp(join(tmpdir(), 'haki-location-'));
await build({ stdin: { contents: 'export * as currentLocation from "./convex/paralegalLocation.ts"; export * as geography from "./convex/lib/geography.ts"; export * as states from "./convex/lib/presence.ts"; export * as presence from "./convex/presence.ts"; export * as directory from "./convex/justiceServices.ts"; export * as paralegals from "./convex/paralegals.ts";', resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'handlers.mjs') });
const { currentLocation, geography, states, presence, directory, paralegals } = await import(pathToFileURL(join(dir, 'handlers.mjs')).href);
await rm(dir, { recursive: true });
function fixture() {
 const records = new Map(); let counter = 0;
 const put = (table, id, values) => records.set(id, { _id: id, _table: table, _creationTime: Date.now(), ...values });
 for (const [id, role] of [['beneficiary','user'],['paralegal','paralegal'],['outsider','user']]) put('users',id,{clerkId:id,email:id+'@example.test',name:id,role});
 const office = { active:true,visibility:'public',verificationStatus:'verified',servicePointType:'legal_aid_provider',nextReviewAt:Date.now()+86400000,latitude:-6.8,longitude:39.2,name:'Synthetic public office',region:'Dar es Salaam',district:'Ilala',issueCategories:['land'],serviceTypes:[],serviceCoverageRegions:['Dar es Salaam'],currentIntakeState:'open',languages:[],referralCapability:true };
 put('justice_services','office',office);
 put('justice_services','secret',{...office,servicePointType:'safe_house',visibility:'confidential',latitude:-6.8001});
 put('justice_services','unknown',{...office,latitude:undefined,longitude:undefined});
 put('justice_services','far',{...office,latitude:-3.3,longitude:36.6});
 put('paralegal_applications','profile',{email:'paralegal@example.test',fullName:'Synthetic test paralegal',region:'Dar es Salaam',district:'Ilala',status:'approved',isVerified:true,reviewedBy:'reviewer',idDocumentStorageId:'id',certificateStorageId:'certificate',onboardingCompleted:true,ethicsAcceptedAt:1,codeOfConductAcceptedAt:1,safeguardingTrainingCompletedAt:1,availabilityStatus:'paused'});
 put('cases','case',{beneficiaryId:'beneficiary'});
 put('case_participants','participant',{caseId:'case',userId:'paralegal',role:'paralegal',status:'active',scopeReviewDecision:'independent'});
 const db = {get:async id=>records.get(id)??null, insert:async(table,values)=>{const id=table+'-'+(++counter);put(table,id,values);return id;},patch:async(id,values)=>{for(const [k,v] of Object.entries(values)){if(v===undefined)delete records.get(id)[k];else records.get(id)[k]=v;}},delete:async id=>records.delete(id),query(table){const filters=[];let descending=false;const q={withIndex(_name,cb){const chain={eq(k,v){filters.push([k,v]);return chain;}};cb(chain);return q;},order(d){descending=d==='desc';return q;},async collect(){const values=[...records.values()].filter(r=>r._table===table&&filters.every(([k,v])=>r[k]===v));return descending?values.sort((a,b)=>(b.updatedAt??0)-(a.updatedAt??0)):values;},async first(){return(await q.collect())[0]??null;},async unique(){const r=await q.collect();assert.ok(r.length<=1);return r[0]??null;},async take(n){return(await q.collect()).slice(0,n);}};return q;}};
 const ctx=id=>({db,auth:{getUserIdentity:async()=>id?{subject:id,email:id+'@example.test',emailVerified:true}:null}});
 return {records,ctx};
}
test('distance and radius validation handle zero coordinates and reject invalid requests',()=>{
 assert.equal(geography.distanceKm({latitude:0,longitude:0},{latitude:0,longitude:0}),0);
 assert.ok(Math.abs(geography.distanceKm({latitude:0,longitude:0},{latitude:0,longitude:1})-111.195)<0.01);
 assert.throws(()=>geography.requireNearbyInput({latitude:NaN,longitude:0},25));
 assert.throws(()=>geography.requireNearbyInput(undefined,25));
 assert.throws(()=>geography.requireNearbyInput({latitude:0,longitude:0},201));
});
test('radius directory excludes restricted, missing-coordinate and distant offices without persisting GPS',async()=>{
 const {records,ctx}=fixture(), origin={latitude:-6.8,longitude:39.2}; const size=records.size;
 const results=await directory.listPublicServices._handler(ctx(null),{origin,radiusKm:5});
 assert.deepEqual(results.map(r=>r._id),['office']);assert.equal(results[0].distanceKm,0);assert.equal(records.size,size);
 const area=await directory.listPublicServices._handler(ctx(null),{});assert.ok(area.some(r=>r._id==='unknown'&&r.distanceKm===null));
});
test('presence expires, aggregates sessions, is opt-in and cannot expose exact last-seen',async()=>{
 assert.equal(states.presenceState([{updatedAt:0,foreground:true}],300000),'unavailable');
 assert.equal(states.presenceState([{updatedAt:100000,foreground:false},{updatedAt:110000,foreground:true}],120000),'online');
 assert.equal(states.presenceState([{updatedAt:100000,foreground:false}],120000),'away');
 const {records,ctx}=fixture();const args={sessionId:'session-test-123',surface:'web',foreground:true};
 await assert.rejects(()=>presence.heartbeat._handler(ctx(null),args));
 await presence.heartbeat._handler(ctx('beneficiary'),args);assert.equal([...records.values()].filter(r=>r._table==='presence_sessions').length,0);
 await presence.setSharing._handler(ctx('beneficiary'),{enabled:true});
 await presence.heartbeat._handler(ctx('beneficiary'),args);
 await presence.heartbeat._handler(ctx('beneficiary'),{...args,sessionId:'another-session-123',surface:'mobile',foreground:false});
 assert.equal(await states.visiblePresence(ctx('beneficiary'),records.get('beneficiary')),'online');
 await presence.setSharing._handler(ctx('beneficiary'),{enabled:false});assert.equal(await states.visiblePresence(ctx('beneficiary'),records.get('beneficiary')),'unavailable');assert.equal([...records.values()].filter(r=>r._table==='presence_sessions').length,0);
});
test('case presence is access-scoped and excludes inactive or revoked participants',async()=>{
 const {records,ctx}=fixture();
 await assert.rejects(()=>presence.forCase._handler(ctx('outsider'),{caseId:'case'}));
 await presence.setSharing._handler(ctx('paralegal'),{enabled:true});await presence.heartbeat._handler(ctx('paralegal'),{sessionId:'paralegal-session-123',surface:'mobile',foreground:true});
 let results=await presence.forCase._handler(ctx('beneficiary'),{caseId:'case'});assert.equal(results[0].state,'online');assert.equal('updatedAt' in results[0],false);
 records.get('participant').status='inactive';assert.deepEqual(await presence.forCase._handler(ctx('beneficiary'),{caseId:'case'}),[]);
 records.get('participant').status='active';records.get('paralegal').role='user';assert.deepEqual(await presence.forCase._handler(ctx('beneficiary'),{caseId:'case'}),[]);
});
test('paralegal proximity uses chosen public offices and never implies availability from presence',async()=>{
 const {records,ctx}=fixture();
 await assert.rejects(()=>paralegals.setMeetingPoint._handler(ctx('outsider'),{serviceId:'office'}));
 await assert.rejects(()=>paralegals.setMeetingPoint._handler(ctx('paralegal'),{serviceId:'secret'}));
 await assert.rejects(()=>paralegals.setMeetingPoint._handler(ctx('paralegal'),{serviceId:'unknown'}));
 await paralegals.setMeetingPoint._handler(ctx('paralegal'),{serviceId:'office'});
 await presence.setSharing._handler(ctx('paralegal'),{enabled:true});await presence.heartbeat._handler(ctx('paralegal'),{sessionId:'paralegal-session-123',surface:'web',foreground:true});
 let results=await paralegals.listApprovedParalegals._handler(ctx(null),{origin:{latitude:-6.8,longitude:39.2},radiusKm:5});
 assert.equal(results[0].distanceKm,0);assert.equal(results[0].presence,'online');assert.equal(results[0].availabilityStatus,'paused');assert.equal('email' in results[0],false);
 records.get('office').visibility='restricted';results=await paralegals.listApprovedParalegals._handler(ctx(null),{});assert.equal(results[0].meetingPoint,null);assert.equal(results[0].distanceKm,null);
});
test('late foreground heartbeat cannot overwrite a newer background state',async()=>{
 const {records,ctx}=fixture();await presence.setSharing._handler(ctx('paralegal'),{enabled:true});
 const args={sessionId:'ordered-session-123',surface:'web'};
 await presence.heartbeat._handler(ctx('paralegal'),{...args,sequence:1,foreground:true});
 await presence.heartbeat._handler(ctx('paralegal'),{...args,sequence:3,foreground:false});
 await presence.heartbeat._handler(ctx('paralegal'),{...args,sequence:2,foreground:true});
 assert.equal(await states.visiblePresence(ctx('paralegal'),records.get('paralegal')),'away');
});
test('distance matching preserves the immediate-safety gate and never saves search coordinates',async()=>{
 const {records,ctx}=fixture();const size=records.size;
 const args={source:'directory',issueCategory:'land',origin:{latitude:-6.8,longitude:39.2},radiusKm:5};
 const result=await directory.matchServices._handler(ctx(null),args);
 assert.deepEqual(result.recommendations.map(r=>r.service._id),['office']);assert.equal(result.recommendations[0].distanceKm,0);assert.equal(records.size,size);
 const restricted=await directory.matchServices._handler(ctx(null),{...args,urgency:'immediate_safety'});
 assert.equal(restricted.reviewStatus,'restricted');assert.deepEqual(restricted.recommendations,[]);
});
test('removing inaccurate office coordinates withdraws a verified record for renewed review',async()=>{
 const {records,ctx}=fixture();records.get('outsider').role='admin';
 await directory.updateService._handler(ctx('outsider'),{id:'office',clearCoordinates:true,decisionReason:'Remove inaccurate coordinates pending office verification.',updates:{}});
 assert.equal(records.get('office').latitude,undefined);assert.equal(records.get('office').longitude,undefined);
 assert.equal(records.get('office').active,false);assert.equal(records.get('office').verificationStatus,'expired');
});

test('current paralegal location takes priority, stays private and expires to office fallback', async () => {
 const { records, ctx } = fixture();
 await paralegals.setMeetingPoint._handler(ctx('paralegal'), {serviceId:'far'});
 const args = {latitude:-6.81234,longitude:39.21234,accuracy:25,capturedAt:Date.now()};
 await assert.rejects(() => currentLocation.share._handler(ctx('outsider'), args));
 await assert.rejects(() => currentLocation.share._handler(ctx('paralegal'), {...args,accuracy:2001}));
 await assert.rejects(() => currentLocation.share._handler(ctx('paralegal'), {...args,capturedAt:Date.now()-120000}));
 await currentLocation.share._handler(ctx('paralegal'), args);
 const stored = [...records.values()].find(r => r._table === 'paralegal_locations');
 assert.equal(stored.latitude,-6.81); assert.equal(stored.longitude,39.21);
 let result = await paralegals.listApprovedParalegals._handler(ctx(null), {origin:{latitude:-6.81,longitude:39.21},radiusKm:5});
 assert.equal(result.length,1); assert.equal(result[0].distanceSource,'current_location'); assert.equal(result[0].distanceKm,0);
 assert.equal('latitude' in result[0],false); assert.equal('longitude' in result[0],false); assert.equal(result[0].meetingPoint.id,'far');
 records.get('paralegal').role='user';
 result = await paralegals.listApprovedParalegals._handler(ctx(null), {origin:{latitude:-6.81,longitude:39.21},radiusKm:5}); assert.equal(result.length,0);
 records.get('paralegal').role='paralegal'; stored.expiresAt=Date.now()-1;
 result = await paralegals.listApprovedParalegals._handler(ctx(null), {}); assert.equal(result[0].distanceSource,'office');
 await currentLocation.stop._handler(ctx('paralegal'), {}); assert.equal(records.has(stored._id),false);
});
