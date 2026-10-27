import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
// Controlled React-hook and audio-module model, not a native hardware test.
function runtime(options={}) {
 const slots=[];let cursor=0,effects=[],disposed=false,tree,focusCallback,focusCleanup;const appListeners=new Set();const same=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>x===b[i]);
 const f={sw:true,disabled:false,permission:async()=>({granted:true}),prepare:async()=>{},mode:async()=>{},seek:async()=>{},transcribe:async()=> 'Synthetic words',onText(){},calls:[],lateWrites:0,status:{isRecording:false,durationMillis:0},poll:{isRecording:false,durationMillis:0},uri:null,alerts:[],...options};
 const react={useCallback:fn=>fn,useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{if(disposed)f.lateWrites++;slots[i]=typeof v==='function'?v(slots[i]):v;}];},useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},useEffect(fn,deps){const i=cursor++;if(!same(slots[i]?.deps,deps)){const old=slots[i];slots[i]={deps};effects.push(()=>{old?.cleanup?.();slots[i].cleanup=fn();});}},useLayoutEffect(fn,deps){return react.useEffect(fn,deps);}};
 const recorder={get uri(){return f.uri;},getStatus:()=>({...f.status}),stop:async()=>{f.calls.push('stop');f.status.isRecording=false;await f.stop?.();},prepareToRecordAsync:async()=>{f.calls.push('prepare');return f.prepare();},record:args=>{f.calls.push(['record',args]);f.status.isRecording=true;}};
 const player={pause(){f.calls.push('pause');},seekTo:async()=>{f.calls.push('seek');return f.seek();},play(){f.calls.push('play');}};
 const audio={RecordingPresets:{HIGH_QUALITY:{}},requestRecordingPermissionsAsync:async()=>{f.calls.push('permission');return f.permission();},setAudioModeAsync:async v=>{f.calls.push(['mode',v]);return f.mode(v);},useAudioRecorder:()=>recorder,useAudioRecorderState:()=>f.poll,useAudioPlayer:()=>player};
 const dependencies={react,'expo-router':{useFocusEffect:fn=>{focusCallback=fn;react.useEffect(()=>{focusCleanup=fn();return()=>focusCleanup?.();},[]);}},'react/jsx-runtime':{jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})},'expo-audio':audio,'react-native':{AppState:{currentState:'active',addEventListener:(_name,fn)=>{appListeners.add(fn);return{remove:()=>appListeners.delete(fn)};}},StyleSheet:{create:s=>s},View:'View',Text:'Text',Pressable:'Pressable',Platform:{OS:'ios'},Alert:{alert:(...args)=>f.alerts.push(args)}}};
 const stub=new Proxy({__esModule:true,default:'Icon'},{get:(o,k)=>k in o?o[k]:String(k)});
 function require(name){if(dependencies[name])return dependencies[name];if(name.endsWith('/theme'))return{colors:{},type:{}};if(name.endsWith('/plainLanguage'))return{plainError:(_e,_l,fallback)=>fallback};return stub;}
 const filename=(process.env.HAKI_VOICE_BEFORE==='1'?'output/voice-reliability-2026-10-26/before/':'')+'mobile/src/intake/IntakeVoice.tsx';const raw=fs.readFileSync(filename,'utf8');const source=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;const module={exports:{}};vm.runInNewContext(`(function(require,module,exports){${source}\n})`,{console})(require,module,module.exports);
 function render(){cursor=0;tree=module.exports.IntakeVoice({sw:f.sw,disabled:f.disabled,onTranscribe:uri=>{f.calls.push(['transcribe',uri]);return f.transcribe(uri);},onText:text=>f.onText(text)});for(let i=0;effects.length&&i<10;i++){const e=effects;effects=[];e.forEach(fn=>fn());}return tree;}
 function nodes(n){if(n===null||n===undefined||typeof n==='boolean')return[];if(Array.isArray(n))return n.flatMap(nodes);if(typeof n!=='object')return[n];return[n,...nodes(n.props?.children)];}
 const r={f,render,blur(){focusCleanup?.();},focus(){focusCleanup=focusCallback?.();},appState(next){for(const fn of appListeners)fn(next);},nodes:()=>nodes(tree),text:()=>nodes(tree).filter(n=>typeof n==='string').join(' '),press(label){const n=nodes(tree).find(n=>n.type==='Pressable'&&(n.props.accessibilityLabel===label||nodes(n.props.children).includes(label)));assert.ok(n,'button '+label);n.props.onPress();},unmount(){disposed=true;for(const slot of slots)slot?.cleanup?.();},count:name=>f.calls.filter(x=>x===name||Array.isArray(x)&&x[0]===name).length};render();return r;
}
async function recorded(r){r.press(r.f.sw?'Rekodi jibu':'Record answer');await tick();r.f.status={isRecording:true,durationMillis:1200};r.f.poll={isRecording:true,durationMillis:1200};r.f.uri='file:///synthetic.m4a';r.render();r.press(r.f.sw?'Simamisha rekodi':'Stop recording');await tick();r.f.poll={isRecording:false,durationMillis:1200};r.render();}
function approve(r){const dialog=r.f.alerts.at(-1);assert.ok(dialog);dialog[2][1].onPress();}
test('late microphone permission cannot prepare or start recording after unmount',async()=>{
 const wait=deferred(),r=runtime({permission:()=>wait.promise});r.press('Rekodi jibu');r.unmount();wait.resolve({granted:true});await tick();assert.equal(r.count('prepare'),0);assert.equal(r.count('record'),0);assert.equal(r.f.lateWrites,0);
});
test('a late recorder preparation cannot start the microphone after unmount',async()=>{
 const wait=deferred(),r=runtime({prepare:()=>wait.promise});r.press('Rekodi jibu');await tick();assert.equal(r.count('prepare'),1);r.unmount();wait.resolve();await tick();assert.equal(r.count('record'),0);assert.equal(r.f.lateWrites,0);
});
test('permission denial gives localised guidance and does not start recording',async()=>{
 const r=runtime({permission:async()=>({granted:false})});r.press('Rekodi jibu');await tick();r.render();assert.match(r.text(),/Ruhusu kipaza sauti/);assert.equal(r.count('prepare'),0);
});
test('same-tick record taps only request permission once and respect newly disabled state',async()=>{
 const wait=deferred(),r=runtime({permission:()=>wait.promise});r.press('Rekodi jibu');r.press('Rekodi jibu');assert.equal(r.count('permission'),1);r.f.disabled=true;r.render();wait.resolve({granted:true});await tick();assert.equal(r.count('record'),0);
});
test('manual stop reads the current recorder duration rather than the last UI poll',async()=>{
 const r=runtime();r.press('Rekodi jibu');await tick();r.f.status={isRecording:true,durationMillis:1400};r.f.poll={isRecording:true,durationMillis:0};r.f.uri='file:///synthetic.m4a';r.render();r.press('Simamisha rekodi');await tick();r.render();assert.ok(r.nodes().some(n=>n.props?.accessibilityLabel==='Sikiliza rekodi'));assert.doesNotMatch(r.text(),/Rekodi kwa muda mrefu/);
});
test('short automatic interruption retains an available recording for review',async()=>{
 const r=runtime();r.press('Rekodi jibu');await tick();r.f.poll={isRecording:true,durationMillis:2000};r.render();r.f.status={isRecording:false,durationMillis:2500};r.f.poll={...r.f.status};r.f.uri='file:///interrupted.m4a';r.render();r.render();assert.ok(r.nodes().some(n=>n.props?.accessibilityLabel==='Sikiliza rekodi'));
});
test('unmount stops an active recorder and pauses playback',async()=>{
 const r=runtime();r.f.status={isRecording:true,durationMillis:2000};r.unmount();await tick();assert.equal(r.count('stop'),1);assert.ok(r.count('pause')>=1);
});
test('transcription requires the existing explicit OpenAI consent and deduplicates confirmation taps',async()=>{
 const wait=deferred(),r=runtime({transcribe:()=>wait.promise});await recorded(r);r.press('Badili kuwa maandishi');assert.equal(r.count('transcribe'),0);assert.match(r.f.alerts.at(-1)[1],/OpenAI/);approve(r);approve(r);assert.equal(r.count('transcribe'),1);wait.resolve('Synthetic words');await tick();r.render();assert.match(r.text(),/Synthetic words/);
});
test('late confirmation and transcription results are ignored after unmount',async()=>{
 const r=runtime();await recorded(r);r.press('Badili kuwa maandishi');r.unmount();approve(r);await tick();assert.equal(r.count('transcribe'),0);
 const wait=deferred(),p=runtime({transcribe:()=>wait.promise});await recorded(p);p.press('Badili kuwa maandishi');approve(p);p.unmount();wait.resolve('Private synthetic words');await tick();assert.equal(p.f.lateWrites,0);
});
test('unknown transcription diagnostics are hidden and whitespace results are explained',async()=>{
 const r=runtime({transcribe:async()=>{throw Error('Synthetic server trace secret');}});await recorded(r);r.press('Badili kuwa maandishi');approve(r);await tick();r.render();assert.match(r.text(),/andika jibu lako/);assert.doesNotMatch(r.text(),/Synthetic server trace secret/);
 const p=runtime({transcribe:async()=> '   '});await recorded(p);p.press('Badili kuwa maandishi');approve(p);await tick();p.render();assert.match(p.text(),/Hakuna maneno/);
});
test('audio playback waits for seek and cannot start after the screen leaves',async()=>{
 const wait=deferred(),r=runtime({seek:()=>wait.promise});await recorded(r);r.press('Sikiliza rekodi');assert.equal(r.count('play'),0);r.unmount();wait.resolve();await tick();assert.equal(r.count('play'),0);
});
test('transcribed words only enter the answer after the person chooses Use this text',async()=>{
 const texts=[],r=runtime({onText:text=>texts.push(text)});await recorded(r);r.press('Badili kuwa maandishi');approve(r);await tick();r.render();assert.deepEqual(texts,[]);r.press('Tumia maandishi haya');assert.deepEqual(texts,['Synthetic words']);
});
test('a blurred recording stops and an old permission cannot start it on return',async()=>{
 const wait=deferred(),r=runtime({permission:()=>wait.promise});r.press('Rekodi jibu');r.blur();r.focus();wait.resolve({granted:true});await tick();assert.equal(r.count('record'),0);
 const p=runtime();p.press('Rekodi jibu');await tick();p.blur();await tick();assert.equal(p.count('stop'),1);
});
test('backgrounding stops capture and ignores an old transcription after foreground return',async()=>{
 const r=runtime();r.press('Rekodi jibu');await tick();r.appState('background');await tick();assert.equal(r.count('stop'),1);
 const wait=deferred(),p=runtime({transcribe:()=>wait.promise});await recorded(p);p.press('Badili kuwa maandishi');approve(p);p.appState('background');p.appState('active');wait.resolve('Late private words');await tick();p.render();assert.doesNotMatch(p.text(),/Late private words/);
});
test('a dismissed consent dialog cannot authorise a transcription after route blur and return',async()=>{
 const r=runtime();await recorded(r);r.press('Badili kuwa maandishi');r.blur();r.focus();approve(r);await tick();assert.equal(r.count('transcribe'),0);
});
test('English feedback never exposes recorder diagnostics',async()=>{
 const r=runtime({sw:false,prepare:async()=>{throw Error('Synthetic native stack secret');}});r.press('Record answer');await tick();r.render();assert.match(r.text(),/Recording failed/);assert.doesNotMatch(r.text(),/Synthetic native stack secret|Rekodi haijafanikiwa/);
});
test('a stale permission response cannot unlock a newer pending recording attempt',async()=>{
 const old=deferred(),next=deferred();let count=0;const r=runtime({permission:()=>++count===1?old.promise:next.promise});r.press('Rekodi jibu');r.blur();r.focus();r.render();r.press('Rekodi jibu');assert.equal(r.count('permission'),2);old.resolve({granted:true});await tick();r.render();r.press('Rekodi jibu');assert.equal(r.count('permission'),2);next.resolve({granted:true});await tick();assert.equal(r.count('record'),1);
});
test('safe sign-in guidance stays actionable in the selected language',async()=>{
 const r=runtime({transcribe:async()=>{throw Error('Sign in to use transcription. You can type without signing in.');}});await recorded(r);r.press('Badili kuwa maandishi');approve(r);await tick();r.render();assert.match(r.text(),/Ingia ili kubadili sauti/);assert.doesNotMatch(r.text(),/Sign in to use transcription/);
});
