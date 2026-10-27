import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
// Controlled hook lifecycle, not a browser/device acceptance test. Effects are
// flushed separately so the render before hydration can be checked for leaks.
function storage() {
 const data=new Map();let blocked=false;
 return {data,block(value=true){blocked=value;},get length(){return data.size;},key(i){return [...data.keys()][i]??null;},getItem(k){if(blocked)throw Error('blocked');return data.get(k)??null;},setItem(k,v){if(blocked)throw Error('blocked');data.set(k,v);},removeItem(k){if(blocked)throw Error('blocked');data.delete(k);}};
}
function runtime(stores={localStorage:storage(),sessionStorage:storage()}) {
 const slots=[];let cursor=0,effects=[],dirty=false,args,result;
 const same=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 const react={
  useState(init){const i=cursor++;if(!(i in slots))slots[i]=typeof init==='function'?init():init;return [slots[i],update=>{const next=typeof update==='function'?update(slots[i]):update;if(!Object.is(next,slots[i])){slots[i]=next;dirty=true;}}];},
  useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},
  useCallback(fn,deps){const i=cursor++;if(!same(slots[i]?.deps,deps))slots[i]={deps,fn};return slots[i].fn;},
  useEffect(fn,deps){const i=cursor++;if(!same(slots[i]?.deps,deps)){const old=slots[i];slots[i]={deps};effects.push(()=>{old?.cleanup?.();slots[i].cleanup=fn();});}}
 };
 const module={exports:{}};const source=ts.transpileModule(fs.readFileSync('src/hooks/useFormPersistence.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(`(function(require,module,exports){${source}\n})`,{window:stores,console:{warn(){}},Map,JSON,encodeURIComponent})(name=>{if(name==='react')return react;throw Error(name);},module,module.exports);
 const render=(...next)=>{if(next.length)args=next;cursor=0;dirty=false;result=module.exports.useFormPersistence(...args);return result;};
 const flush=()=>{for(let i=0;i<20;i++){const work=effects;effects=[];work.forEach(fn=>fn());if(dirty)render();if(!effects.length&&!dirty)return result;}throw Error('Render loop');};
 return {render,flush,stores};
}
const empty=()=>({fullName:'',motivation:'',languages:[]});
test('private application never adopts an unowned legacy tab draft',()=>{
 const r=runtime();r.stores.sessionStorage.setItem('form_application',JSON.stringify({...empty(),fullName:'Legacy person'}));
 assert.equal(r.render('application',empty(),null,'session')[0].fullName,'');r.flush();
 assert.equal(r.render('application',empty(),'alice','session')[0].fullName,'');r.flush();
});
test('account changes hide old answers before effects and never copy them to the next owner',()=>{
 const r=runtime();let a=r.render('application',empty(),'alice','session');r.flush();a[1]({...empty(),fullName:'Alice'});r.render();r.flush();const staleSet=a[1];
 assert.equal(r.render('application',empty(),'bob','session')[0].fullName,'');r.flush();
 staleSet({...empty(),fullName:'Late Alice update'});r.render();r.flush();assert.equal(r.render()[0].fullName,'');
 r.render()[1]({...empty(),fullName:'Bob'});r.render();r.flush();
 r.render('application',empty(),'alice','session');assert.equal(r.flush()[0].fullName,'Alice');
 r.render('application',empty(),'bob','session');assert.equal(r.flush()[0].fullName,'Bob');
 assert.equal(r.stores.localStorage.length,0,'session drafts must not be written to persistent local storage');
});
test('sign-out hides answers immediately and stale setters cannot recreate them',()=>{
 const r=runtime();r.render('application',empty(),'alice','session');r.flush();const setter=r.render()[1];setter({...empty(),fullName:'Alice'});r.render();r.flush();
 assert.equal(r.render('application',empty(),null,'session')[0].fullName,'');r.flush();setter({...empty(),fullName:'Late'});r.render();r.flush();assert.equal(r.render()[0].fullName,'');
});
test('clearing a draft resets memory even if browser storage is blocked',()=>{
 const r=runtime();r.render('application',empty(),'alice','session');r.flush();r.render()[1]({...empty(),fullName:'Alice'});r.render();r.flush();r.stores.sessionStorage.block();r.render()[2]();r.render();r.flush();assert.equal(r.render()[0].fullName,'');
});
test('owner metadata rejects copied records and malformed saved values',()=>{
 const stores={localStorage:storage(),sessionStorage:storage()},r=runtime(stores);r.render('application',empty(),'alice','session');r.flush();r.render()[1]({...empty(),fullName:'Alice'});r.render();r.flush();
 const [aliceKey,raw]=[...stores.sessionStorage.data][0];assert.ok(aliceKey);const b=runtime(stores);b.render('application',empty(),'bob','session');b.flush();b.render()[1]({...empty(),fullName:'Bob'});b.render();b.flush();const bobKey=[...stores.sessionStorage.data.keys()].find(k=>k!==aliceKey);assert.ok(bobKey);
 stores.sessionStorage.setItem(bobKey,raw);const copied=runtime(stores);assert.equal(copied.render('application',empty(),'bob','session')[0].fullName,'');
 stores.sessionStorage.setItem(bobKey,'{bad json');const corrupt=runtime(stores);assert.equal(corrupt.render('application',empty(),'bob','session')[0].fullName,'');
 stores.sessionStorage.setItem(bobKey,JSON.stringify({version:2,owner:'bob',value:{fullName:{bad:true},motivation:'',languages:[]}}));const invalid=runtime(stores);assert.equal(invalid.render('application',empty(),'bob','session')[0].fullName,'');
});
test('clear-all only removes the exact owner, including when IDs share a prefix',()=>{
 const stores={localStorage:storage(),sessionStorage:storage()};for(const owner of ['alice','alice-other']){const r=runtime(stores);r.render('application',empty(),owner,'session');r.flush();r.render()[1]({...empty(),fullName:owner});r.render();r.flush();}
 const r=runtime(stores);r.render('application',empty(),'alice','session');r.flush();r.render()[3]();r.render();r.flush();const other=runtime(stores);assert.equal(other.render('application',empty(),'alice-other','session')[0].fullName,'alice-other');assert.equal(r.render()[0].fullName,'');
});

test('an application identity change gets a new component boundary for file and receipt state',()=>{
 let identity={isSignedIn:true,userId:'alice'};const module={exports:{}};
 const source=ts.transpileModule(fs.readFileSync('src/components/ParalegalApplicationForm.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const jsx=(type,props,key)=>({type,props,key});
 vm.runInNewContext(`(function(require,module,exports){${source}\n})`,{console})(name=>name==='@clerk/clerk-react'?{useAuth:()=>identity}:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:{},module,module.exports);
 const component=module.exports.default;const a=component();identity={isSignedIn:true,userId:'bob'};const b=component();identity={isSignedIn:false,userId:null};const guest=component();
 assert.equal(a.type,b.type);assert.notEqual(a.key,b.key);assert.notEqual(a.key,guest.key);assert.notEqual(b.key,guest.key);
});

test('stale clear callbacks cannot clear a newly signed-in owner',()=>{
 const r=runtime();r.render('application',empty(),'alice','session');r.flush();const [,staleSet,staleClear,staleClearAll]=r.render();
 r.render('application',empty(),'bob','session');r.flush();r.render()[1]({...empty(),fullName:'Bob'});r.render();r.flush();
 staleSet({...empty(),fullName:'Alice'});staleClear();staleClearAll();r.render();r.flush();assert.equal(r.render()[0].fullName,'Bob');
 const restored=runtime(r.stores);assert.equal(restored.render('application',empty(),'bob','session')[0].fullName,'Bob');
});

function deferred(){let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};}
function applicationRuntime({urlPromise,uploadResponse,submitPromise,onSubmit}={}) {
 const counts={url:0,fetch:0,submit:0,clear:0,completed:0,receipt:0};let cleanup=()=>{},stateIndex=0;
 const fixture={name:'synthetic.pdf',type:'application/pdf',size:12};
 const values={fullName:'Synthetic applicant',email:'synthetic@example.invalid',phone:'0000000000',region:'Test',district:'Test',ward:'',education:'Certificate',experience:'community_work',motivation:'Synthetic test only',languages:[]};
 const react={useRef:initial=>({current:initial}),useLayoutEffect:fn=>{cleanup=fn();},useState:initial=>{const i=stateIndex++;const value=i===3||i===4?fixture:initial;return[value,next=>{if(i===1&&next===true)counts.receipt++;}];}};
 const api={paralegals:{getMyApplication:'application'},analytics:{logEvent:'analytics'},formSubmissions:{submitParalegalApplication:'submit',generateParalegalDocumentUploadUrl:'upload-url'}};
 const dependencies={react,'react/jsx-runtime':{jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})},'@clerk/clerk-react':{useAuth:()=>({isSignedIn:true,userId:'alice'}),useUser:()=>({user:{primaryEmailAddress:{emailAddress:'synthetic@example.invalid'}}})},'convex/react':{useQuery:()=>undefined,useMutation:ref=>ref==='upload-url'?async()=>{counts.url++;return urlPromise??'https://upload.invalid';}:ref==='submit'?async()=>{counts.submit++;onSubmit?.();return submitPromise??{success:true};}:async()=>{counts.completed++;}},'../../convex/_generated/api':{api},'@/i18n/useCopy':{useCopy:()=>s=>s},'@/i18n/usePlainError':{usePlainError:()=>()=> 'Could not confirm submission.'},'@/providers/LanguageProvider':{useLanguage:()=>({locale:'en'})},'@/hooks/useFormPersistence':{useFormPersistence:()=>[values,()=>{},()=>{counts.clear++;}]},'@/hooks/useOnlineStatus':{useOnlineStatus:()=>true},'@/hooks/useVisitorId':{useVisitorId:()=> 'synthetic-visitor'},'@/components/Honeypot':{useHoneypot:()=>({honeypotValue:'',honeypotProps:{},isBotDetected:()=>false})}};
 const filename='src/components/ParalegalApplicationForm.tsx';const raw=fs.readFileSync(filename,'utf8').replace('    // Render Success State','    return { uploadDocument, handleSubmit };\n    // Render Success State');
 const source=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;const module={exports:{}};
 vm.runInNewContext(`(function(require,module,exports){${source}\n})`,{console:{error(){}},fetch:async()=>{counts.fetch++;return uploadResponse??{ok:true,json:async()=>({storageId:'synthetic-storage'})};}})(name=>dependencies[name]??{},module,module.exports);
 const outer=module.exports.default();const methods=outer.type();return {counts,methods,fixture,unmount:()=>cleanup()};
}

test('an account change during upload URL creation prevents the file transfer',async()=>{
 const wait=deferred(),r=applicationRuntime({urlPromise:wait.promise});const pending=r.methods.uploadDocument(r.fixture);assert.equal(r.counts.url,1);r.unmount();wait.resolve('https://upload.invalid');await assert.rejects(pending,/account changed/);assert.equal(r.counts.fetch,0);assert.equal(r.counts.submit,0);
});
test('a late completed submission cannot clear drafts or show a receipt after an account change',async()=>{
 const started=deferred(),finished=deferred(),r=applicationRuntime({submitPromise:finished.promise,onSubmit:()=>started.resolve()});const pending=r.methods.handleSubmit({preventDefault(){}});await started.promise;assert.equal(r.counts.submit,1);r.unmount();finished.resolve({success:true});await pending;assert.equal(r.counts.clear,0);assert.equal(r.counts.completed,0);assert.equal(r.counts.receipt,0);
});
