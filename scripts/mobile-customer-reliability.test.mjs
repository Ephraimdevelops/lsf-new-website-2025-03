import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';

// Controlled component lifecycle and JSX assertions; not native-device acceptance.
const api = { users:{currentAccess:'access'}, caseManagement:{myCases:'cases',myAppointments:'appointments',requestAppointment:'request'}, personalDocuments:{get:'document'}, documentBrief:{summarize:'summary'} };
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function runtime(file,options={}) {
  const slots=[];let cursor=0,cleanups=[],tree;
  const fixture={auth:{isLoaded:true,isSignedIn:true,userId:'alice'},locale:'en',params:{},queries:{access:{user:{_id:'alice'}},cases:[{_id:'case-1',beneficiaryId:'alice',status:'assistance_underway',publicId:'SYNTHETIC-1',summary:'Synthetic case'}],appointments:[]},calls:[],...options};
  const react={useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],next=>{slots[i]=typeof next==='function'?next(slots[i]):next;}];},useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},useLayoutEffect(fn){const i=cursor++;if(!(i in slots)){slots[i]=true;cleanups.push(fn());}}};
  const native={StyleSheet:{create:s=>s},Text:'Text',View:'View',TextInput:'TextInput',Pressable:'Pressable',Platform:{OS:'ios'},Linking:{openURL:async()=>{}},Alert:{alert(){} }};
  const ui=new Proxy({__esModule:true,default:'Icon'},{get:(o,k)=>k in o?o[k]:String(k)});
  const deps={react,'react/jsx-runtime':{jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key}),Fragment:'Fragment'},'react-native':native,'convex/react':{useQuery:ref=>fixture.queries[ref],useMutation:()=>async args=>{fixture.calls.push(args);return fixture.send?.(args);},useAction:()=>async()=>{}},'convex/values':{ConvexError:class extends Error{}},'expo-router':{router:{push(){},back(){}},useLocalSearchParams:()=>fixture.params}};
  function require(name){if(deps[name])return deps[name];if(name.endsWith('/auth'))return{useAuth:()=>fixture.auth};if(name.endsWith('/i18n'))return{useLanguage:()=>({locale:fixture.locale})};if(name.endsWith('/backend/api'))return{api};if(name.endsWith('/theme'))return{colors:{},radius:{},spacing:{},type:{}};if(name.endsWith('/plainLanguage'))return{displayLabel:s=>s,plainError:(_e,_l,f)=>f};if(name.endsWith('/useSensitiveScreenProtection'))return{useSensitiveScreenProtection(){}};return ui;}
  const before=process.env.HAKI_RELIABILITY_BEFORE==='1'?'output/mobile-reliability-2026-10-24/before/':'';
  const code=ts.transpileModule(fs.readFileSync(before+file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const module={exports:{}};vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{console,Date,Math,Map,JSON,window:{confirm:()=>false}})(require,module,module.exports);
  function render(){cursor=0;tree=module.exports.default();while(typeof tree?.type==='function')tree=tree.type(tree.props);return tree;}
  function nodes(n){if(n===null||n===undefined||typeof n==='boolean')return[];if(Array.isArray(n))return n.flatMap(x=>nodes(x));if(typeof n!=='object')return[n];return[n,...nodes(n.props?.children)];}
  const r={fixture,render,nodes:()=>nodes(tree),text:()=>nodes(tree).filter(n=>typeof n==='string').join(' '),unmount(){cleanups.forEach(fn=>fn?.());},key:()=>module.exports.default().key};render();return r;
}
const appointment='mobile/app/appointments.tsx',saved='mobile/app/saved-document/[id].tsx';
function prepare(r,{time='Monday morning',note='Synthetic note'}={}) {
  r.render();const choice=r.nodes().find(n=>n.type==='Pressable'&&n.props?.children?.[0]?.props?.children==='SYNTHETIC-1');assert.ok(choice,'case selector must exist');choice.props.onPress();r.render();const inputs=r.nodes().filter(n=>n.type==='TextInput');inputs[0].props.onChangeText(time);inputs[1].props.onChangeText(note);r.render();
}
function send(r){const button=r.nodes().find(n=>n.type==='Button'&&/Send appointment request|Tuma ombi la miadi/.test(n.props?.label));assert.ok(button,'request button must exist');return button.props.onPress();}
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('case and appointment loading never masquerade as confirmed empty results',()=>{
  const r=runtime(appointment);r.fixture.queries.cases=undefined;r.fixture.queries.appointments=undefined;r.render();assert.doesNotMatch(r.text(),/No open case yet|No scheduled appointments yet/);assert.ok(r.nodes().filter(n=>n.type==='BrandLoading').length>=2);
  r.fixture.queries.cases=[];r.fixture.queries.appointments=[];r.render();assert.match(r.text(),/No open case yet/);assert.match(r.text(),/No scheduled appointments yet/);
  r.fixture.queries.access=undefined;r.render();assert.doesNotMatch(r.text(),/No open case yet/);
});
test('authentication loading does not show a sign-in prompt',()=>{
  const r=runtime(appointment,{auth:{isLoaded:false,isSignedIn:undefined}});assert.ok(r.nodes().some(n=>n.type==='BrandLoading'));assert.doesNotMatch(r.text(),/Sign in to view appointments/);
});
test('same-tick appointment taps send only one request',async()=>{
  const wait=defer(),r=runtime(appointment,{send:()=>wait.promise});prepare(r);send(r);send(r);assert.equal(r.fixture.calls.length,1);assert.ok(r.fixture.calls[0].clientActionId);wait.resolve();await tick();
});
test('retry after a lost response reuses the ID even after editing and returning',async()=>{
  const r=runtime(appointment,{send:async()=>{throw Error('Synthetic lost response');}});prepare(r);send(r);await tick();const first=r.fixture.calls[0];r.render();send(r);await tick();assert.equal(r.fixture.calls[1].clientActionId,first.clientActionId);assert.ok(first.clientActionId);
  prepare(r,{note:'Different synthetic note'});send(r);await tick();assert.notEqual(r.fixture.calls[2].clientActionId,first.clientActionId);
  prepare(r);send(r);await tick();assert.equal(r.fixture.calls[3].clientActionId,first.clientActionId);
});
test('client retry after server commit creates exactly one event and quota charge',async()=>{
  const h=harness(),person=await h.user(),caseId=await h.db.insert('cases',{beneficiaryId:person,status:'assistance_underway',version:1}),cases=loadHandlerModule('convex/caseManagement.ts');let first=true;
  const r=runtime(appointment,{send:async args=>{const result=await h.invoke(cases.requestAppointment,{...args,caseId},person);if(first){first=false;throw Error('Response lost after commit');}return result;}});prepare(r);send(r);await tick();r.render();send(r);await tick();
  assert.equal(r.fixture.calls.length,2);assert.equal((await h.db.query('case_events').collect()).filter(e=>e.type==='appointment_requested').length,1);assert.equal((await h.db.query('rate_limits').collect())[0].count,1);
});
test('a late success preserves newer input edits',async()=>{
  const wait=defer(),r=runtime(appointment,{send:()=>wait.promise});prepare(r);send(r);r.nodes().filter(n=>n.type==='TextInput')[1].props.onChangeText('New draft written during send');wait.resolve();await tick();r.render();const inputs=r.nodes().filter(n=>n.type==='TextInput');assert.equal(inputs[1].props.value,'New draft written during send');assert.equal(inputs[0].props.value,'');
});
test('account remount and unmount suppress stale responses and requests',async()=>{
  const wait=defer(),r=runtime(appointment,{send:()=>wait.promise});prepare(r);const staleSend=r.nodes().find(n=>n.type==='Button'&&n.props?.label==='Send appointment request').props.onPress;send(r);r.unmount();wait.resolve();await tick();r.render();assert.doesNotMatch(r.text(),/Appointment request sent to the case team/);const count=r.fixture.calls.length;staleSend();assert.equal(r.fixture.calls.length,count);
  const a=r.key();r.fixture.auth={isLoaded:true,isSignedIn:true,userId:'bob'};assert.notEqual(r.key(),a);
});
test('saved document distinguishes pending, missing, signed-out and loaded states',()=>{
  const r=runtime(saved,{params:{id:'synthetic-document'}});assert.ok(r.nodes().some(n=>n.type==='BrandLoading'));
  r.fixture.queries.document=null;r.render();assert.doesNotMatch(r.text(),/Saved for you/);assert.match(r.text(),/unavailable in your account/);assert.equal(r.nodes().some(n=>n.type==='BrandLoading'),false);assert.equal(r.nodes().some(n=>n.type==='Button'&&n.props.label==='Get a summary'),false);
  r.fixture.queries.document={_id:'synthetic-document',name:'Synthetic.pdf',size:20,createdAt:0,url:'https://example.invalid'};r.render();assert.match(r.text(),/Synthetic.pdf/);assert.ok(r.nodes().some(n=>n.type==='Button'&&n.props.label==='Get a summary'));
  r.fixture.auth={isLoaded:true,isSignedIn:false};r.render();assert.ok(r.nodes().some(n=>n.type==='Button'&&/Sign in/.test(n.props.label)));
});
test('missing document ID ends loading and unavailable copy respects Kiswahili',()=>{
  const r=runtime(saved,{locale:'sw',params:{}});assert.equal(r.nodes().some(n=>n.type==='BrandLoading'),false);assert.match(r.text(),/Hati hii haipatikani/);assert.doesNotMatch(r.text(),/unavailable in your account/);
});
test('an acknowledged request allows a separate intentional request with a fresh identity',async()=>{
  const r=runtime(appointment);prepare(r);send(r);await tick();const first=r.fixture.calls[0].clientActionId;assert.ok(first);prepare(r);send(r);await tick();assert.notEqual(r.fixture.calls[1].clientActionId,first);
});
