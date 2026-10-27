import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
test('every statically referenced native raster asset has the format required by its extension',()=>{
 const seen=new Set();
 for(const source of [...walk('mobile/app'),...walk('mobile/src')].filter(p=>/\.[jt]sx?$/.test(p))){
  const text=fs.readFileSync(source,'utf8');for(const match of text.matchAll(/require\(["'](\.[^"']+\.(?:png|jpe?g|webp))["']\)/g)){
   const file=path.resolve(path.dirname(source),match[1]);if(seen.has(file))continue;seen.add(file);const b=fs.readFileSync(file),ext=path.extname(file);
   if(ext==='.png')assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file);
   else if(ext==='.webp'){assert.equal(b.subarray(0,4).toString(),'RIFF',file);assert.equal(b.subarray(8,12).toString(),'WEBP',file);}
   else assert.equal(b.subarray(0,3).toString('hex'),'ffd8ff',file);
  }
 }
 assert.ok(seen.size>0);
});
