import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const file={uri:'file:///synthetic.pdf',name:'synthetic.pdf',mimeType:'application/pdf',size:10};
function runtime(options={}) {
 const state=[],refs=[];let sc=0,rc=0,lc=0,disposed=false;const cleanups=[];
 const fixture={locale:'sw',signedIn:true,draft:{clientRequestId:'synthetic',description:'Synthetic situation',issueCategory:'family',region:'Test',district:'Test',occurredOn:'',involvedParties:'',desiredHelp:'Synthetic help',safeContactMethod:'in_app',preferredLanguage:'sw',urgency:'standard',hasDocuments:true,evidence:[{...file}]},calls:[],updates:[],lateWrites:0,reset:0,clear:0,navigations:0,...options};
 const react={useRef(initial){const i=rc++;return refs[i]??(refs[i]={current:initial});},useState(initial){const i=sc++;if(!(i in state))state[i]=initial;return[state[i],next=>{if(disposed)fixture.lateWrites++;state[i]=typeof next==='function'?next(state[i]):next;}];},useLayoutEffect(fn){const i=lc++;if(!cleanups[i])cleanups[i]=fn()??(()=>{});},useEffect(){}};
 const names=['saveDraft','saveAnswer','generateAttachmentUploadUrl','attachToDraft','submit'];const api={legalHelp:Object.fromEntries([...names,'getDraft'].map(n=>[n,n])),journeyAnalytics:{record:'journey'},intakeAudio:{transcribe:'transcribe'},justiceServices:{listPublicServices:'services'}};
 const call=async(name,args)=>{fixture.calls.push({name,args});if(fixture.onCall)return fixture.onCall(name,args,defaultResult);return defaultResult(name);};
 function defaultResult(name){return name==='saveDraft'?{requestId:'request-1',publicId:'HYR-SYNTHETIC',status:'draft',version:1}:name==='generateAttachmentUploadUrl'?'https://example.invalid/upload':name==='attachToDraft'?{attachmentId:'attachment-1',version:2}:name==='transcribe'?'Synthetic words':undefined;}
 const intake={useIntakeDraft:()=>({draft:fixture.draft,hasSavedDraft:false,hasGuestDraft:false,updateDraft(update){fixture.updates.push(update);fixture.draft={...fixture.draft,...update};},resetDraft(){fixture.reset++;},clearSavedDraft:async()=>{fixture.clear++;},saveDraftForLater:async()=>call('local-save'),restoreSavedDraft:async()=>true,restoreGuestDraft:async()=>true})};
 const dependencies={'react':react,'react-native':{Platform:{OS:'ios'},StyleSheet:{create:s=>s},Alert:{alert(){}},Text:'Text'},'convex/react':{useMutation:name=>args=>call(name,args),useAction:name=>args=>call(name,args),useQuery:name=>name==='services'?[]:undefined},'expo-router':{router:{push(){fixture.navigations++;}}},'expo-document-picker':{getDocumentAsync:()=>call('picker')},'expo-file-system/legacy':{getInfoAsync:async()=>({exists:true,size:10})}};
 function require(name){if(dependencies[name])return dependencies[name];if(name.endsWith('/theme'))return{colors:{},spacing:{},radius:{},type:{}};if(name.endsWith('/plainLanguage'))return{plainError:(_e,_l,f)=>f};if(name.endsWith('/voiceAudio'))return{recordingBlobToWav:async x=>x};if(name.endsWith('/auth'))return{useAuth:()=>({isSignedIn:fixture.signedIn})};if(name.endsWith('/i18n'))return{useLanguage:()=>({locale:fixture.locale,t:key=>key})};if(name.endsWith('/IntakeDraftContext'))return intake;if(name.endsWith('/backend/api'))return{api};if(name.endsWith('/helpIssues'))return{helpIssues:[{key:'family',en:'Family'}]};if(name.endsWith('/useSensitiveScreenProtection'))return{useSensitiveScreenProtection(){}};if(name.endsWith('/uploadEvidence'))return{uploadEvidence:async(...args)=>{fixture.calls.push({name:'binary',args});return fixture.onBinary?fixture.onBinary(...args):'storage-1';}};return{};}
 const filename=(process.env.HAKI_INTAKE_BEFORE==='1'?'output/intake-reliability-2026-10-26/before/':'')+'mobile/app/intake.tsx';let raw=fs.readFileSync(filename,'utf8');raw=raw.replace('  if (submittedRequestId) {','  return { saveRemoteDraft, uploadFile, uploadSelected, transcribeRecording, finish, chooseEvidence, saveForLater, restoreDraft, setConsentAccepted, error, submittedRequestId };\n  if (submittedRequestId) {');
 const code=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;const module={exports:{}};vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{Date,Map,URL,console})(require,module,module.exports);
 function render(){sc=rc=lc=0;return module.exports.default();}const r={fixture,render,unmount(){disposed=true;cleanups.forEach(f=>f());},count:n=>fixture.calls.filter(c=>c.name===n).length};render();return r;
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('leaving intake during remote save prevents the follow-up answer write',async()=>{
 const wait=deferred(),r=runtime({onCall:(name,_args,f)=>name==='saveDraft'?wait.promise:f(name)});const p=r.render().saveRemoteDraft();r.unmount();wait.resolve({requestId:'request-1',status:'draft',version:1});await assert.rejects(p,/no longer active/);assert.equal(r.count('saveAnswer'),0);
});
test('leaving intake before upload URL returns prevents binary transfer',async()=>{
 const wait=deferred(),r=runtime({onCall:(name,_args,f)=>name==='generateAttachmentUploadUrl'?wait.promise:f(name)});const p=r.render().uploadFile(file,'request-1');r.unmount();wait.resolve('https://example.invalid/upload');await assert.rejects(p,/no longer active/);assert.equal(r.count('binary'),0);assert.equal(r.count('attachToDraft'),0);assert.equal(r.fixture.lateWrites,0);
});
test('an already-dispatched binary upload cannot attach to a request after unmount',async()=>{
 const wait=deferred(),r=runtime({onBinary:()=>wait.promise});const p=r.render().uploadFile(file,'request-1');await tick();assert.equal(r.count('binary'),1);r.unmount();wait.resolve('storage-1');await assert.rejects(p,/no longer active/);assert.equal(r.count('attachToDraft'),0);assert.equal(r.fixture.updates.length,0);assert.equal(r.fixture.lateWrites,0);
});
test('late attachment confirmation cannot update a different screen draft',async()=>{
 const wait=deferred(),r=runtime({onCall:(name,_args,f)=>name==='attachToDraft'?wait.promise:f(name)});const p=r.render().uploadFile(file,'request-1');await tick();const updates=r.fixture.updates.length;r.unmount();wait.resolve({attachmentId:'attachment-1',version:2});await assert.rejects(p,/no longer active/);assert.equal(r.fixture.updates.length,updates);assert.equal(r.fixture.lateWrites,0);
});
test('a late submitted request cannot clear a saved draft or show a receipt after unmount',async()=>{
 const wait=deferred(),r=runtime({onCall:(name,_args,f)=>name==='submit'?wait.promise:f(name)});r.render().setConsentAccepted(true);const p=r.render().finish();await tick();assert.equal(r.count('submit'),1);r.unmount();wait.resolve();await p;assert.equal(r.fixture.reset,0);assert.equal(r.fixture.clear,0);assert.equal(r.fixture.lateWrites,0);assert.equal(r.render().submittedRequestId,'');
});
test('serial submission stops before the next file when the first attachment completes late',async()=>{
 const wait=deferred(),r=runtime({onCall:(name,_args,f)=>name==='attachToDraft'?wait.promise:f(name)});r.fixture.draft.evidence.push({...file,uri:'file:///second.pdf'});r.render().setConsentAccepted(true);const p=r.render().finish();await tick();r.unmount();wait.resolve({attachmentId:'attachment-1',version:2});await p;assert.equal(r.count('binary'),1);assert.equal(r.count('submit'),0);
});
test('guest draft save failures are caught and explained in Kiswahili before navigation',async()=>{
 const r=runtime({signedIn:false,onCall:async name=>{if(name==='local-save')throw Error('Synthetic storage diagnostic');}});await r.render().uploadSelected();assert.equal(r.fixture.navigations,0);assert.match(r.render().error,/Hatukuweza kuthibitisha upakiaji/);assert.doesNotMatch(r.render().error,/Synthetic|Upload failed/);
});
test('file picker results are ignored after intake leaves the account subtree',async()=>{
 const wait=deferred(),r=runtime({onCall:()=>wait.promise});const p=r.render().chooseEvidence();r.unmount();wait.resolve({canceled:false,assets:[{...file}]});await p;assert.equal(r.fixture.updates.length,0);assert.equal(r.fixture.lateWrites,0);
});
test('unknown submission diagnostics are replaced with localised uncertain-outcome guidance',async()=>{
 const r=runtime({onCall:async()=>{throw Error('Private synthetic stack and query');}});r.render().setConsentAccepted(true);await r.render().finish();assert.match(r.render().error,/Angalia maombi yako/);assert.doesNotMatch(r.render().error,/Private|Unable to submit/);
});
test('known file validation tells the person the size limit without exposing unknown diagnostics',async()=>{
 const r=runtime({onCall:async()=>({canceled:false,assets:[{uri:'file:///large.pdf',name:'large.pdf',size:11*1024*1024}]})});await r.render().chooseEvidence();assert.match(r.render().error,/MB 10/);assert.equal(r.fixture.updates.length,0);
});
test('a failed attach keeps its binary receipt so a retry does not upload the file twice',async()=>{
 let first=true;const r=runtime({onCall:(name,_args,f)=>{if(name==='attachToDraft'&&first){first=false;throw Error('Synthetic uncertain attach');}return f(name);}});await assert.rejects(r.render().uploadFile(file,'request-1'));const receipt=r.fixture.draft.evidence[0];assert.equal(receipt.storageId,'storage-1');await r.render().uploadFile(receipt,'request-1');assert.equal(r.count('binary'),1);assert.equal(r.count('attachToDraft'),2);
});
