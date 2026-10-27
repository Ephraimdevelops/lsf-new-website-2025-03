// Invokes the repository's registered handlers with an in-memory DB adapter.
// This tests application authorization/lifecycle logic, not hosted Convex or browser authentication.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(path.join(root,'package.json'));
const cache=new Map();
export function loadHandlerModule(relative){
 const filename=path.resolve(root,relative);
 if(cache.has(filename))return cache.get(filename).exports;
 const module={exports:{}};cache.set(filename,module);
 const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const localRequire=name=>{
  if(!name.startsWith('.'))return require(name);
  const base=path.resolve(path.dirname(filename),name);
  const target=[base,base+'.ts',base+'.js',base.replace(/\.js$/,'.ts')].find(file=>fs.existsSync(file)&&fs.statSync(file).isFile());
  if(!target)throw new Error(`Missing test module: ${name}`);
  return loadHandlerModule(target);
 };
 vm.runInThisContext(`(function(require,module,exports){${source}\n})`,{filename})(localRequire,module,module.exports);
 return module.exports;
}
export function harness(){
 let counter=0;const records=new Map();
 const field=name=>({field:name});const value=(x,row)=>x&&typeof x==='object'&&'field'in x?row[x.field]:x;
 const filterBuilder={field,eq:(a,b)=>row=>value(a,row)===value(b,row),lte:(a,b)=>row=>value(a,row)<=value(b,row),or:(...terms)=>row=>terms.some(term=>term(row)),and:(...terms)=>row=>terms.every(term=>term(row))};
 const db={
  async get(id){return records.get(id)??null;},
  async delete(id){records.delete(id);},
  async insert(table,fields){const id=`${table}:${++counter}`;records.set(id,{...fields,_id:id,_creationTime:counter});return id;},
  async patch(id,fields){const row=records.get(id);if(!row)throw new Error('Missing test record');const next={...row};for(const [key,val]of Object.entries(fields)){if(val===undefined)delete next[key];else next[key]=val;}records.set(id,next);},
  query(table){
   let rows=[...records.values()].filter(row=>row._id.startsWith(table+':'));let direction='asc';
   const select={
    withIndex(_name,callback){const range={eq(key,val){rows=rows.filter(row=>row[key]===val);return range;},lte(key,val){rows=rows.filter(row=>row[key]<=val);return range;},lt(key,val){rows=rows.filter(row=>row[key]<val);return range;}};if(callback)callback(range);return select;},
    withSearchIndex(_name,callback){const range={search(key,term){rows=rows.filter(row=>row[key].toLowerCase().includes(term.toLowerCase()));return range;},eq(key,val){rows=rows.filter(row=>row[key]===val);return range;}};callback(range);return select;},
    filter(callback){rows=rows.filter(callback(filterBuilder));return select;},
    order(order){direction=order;return select;},
    async collect(){return [...rows].sort((a,b)=>direction==='desc'?b._creationTime-a._creationTime:a._creationTime-b._creationTime);},
    async first(){return (await select.collect())[0]??null;},
    async unique(){if(rows.length>1)throw new Error('Nonunique test query');return rows[0]??null;},
    async take(n){return (await select.collect()).slice(0,n);},
    async paginate(opts){const all=await select.collect(),start=Number(opts.cursor??0),end=start+opts.numItems;return {page:all.slice(start,end),isDone:end>=all.length,continueCursor:String(end)};},
   };return select;
  },
 };
 return {
  db, records,
  async user(role='user',assignments=[],deleted=false){const id=await db.insert('users',{name:role,email:`${counter}@test.invalid`,clerkId:`test:${counter}`,role,isDeleted:deleted});for(const role of assignments)await db.insert('role_assignments',{userId:id,role,status:'active'});return id;},
  async invoke(fn,args={},actorId=null){const user=actorId?await db.get(actorId):null;const snapshot=structuredClone(records);try{return await fn._handler({db,scheduler:{runAfter:async()=>"test-scheduled-job"},auth:{getUserIdentity:async()=>user?{subject:user.clerkId}:null}},args);}catch(error){records.clear();for(const [id,row]of snapshot)records.set(id,row);throw error;}},
 };
}
