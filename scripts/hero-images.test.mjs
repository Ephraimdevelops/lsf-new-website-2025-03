import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const hero=loadHandlerModule('convex/hero.ts');
const raw='kg244n3r67rncn6zj9m4d0s17d82sx0e';
const url='https://example.convex.cloud/api/storage/public-image';

test('public hero resolves storage IDs, preserves static paths and does not leak deleted references as page URLs',async()=>{
 const h=harness();
 for(const imageUrl of [raw,'/lovable-uploads/photo.jpg','deleted-image'])await h.db.insert('hero_slides',{title:'Hero',imageUrl,order:1,isActive:true});
 const rows=await hero.get._handler({db:h.db,storage:{getUrl:async id=>id===raw?url:null}},{});
 assert.deepEqual(rows.map(s=>s.imageUrl),[url,'/lovable-uploads/photo.jpg','']);
});

test('editing legacy slide text preserves the same public image without requiring a new upload',async()=>{
 const h=harness();const userId=await h.user('admin'),user=await h.db.get(userId);
 const id=await h.db.insert('hero_slides',{title:'Before',description:'Before',imageUrl:raw,order:1,isActive:true});
 const ctx={db:h.db,auth:{getUserIdentity:async()=>({subject:user.clerkId})},storage:{getUrl:async id=>id===raw?url:null}};
 await hero.update._handler(ctx,{id,title:'After',description:'After',imageUrl:url,order:2,isActive:true,ctaText:'Find help',ctaLink:'/legal-help'});
 const saved=await h.db.get(id);assert.equal(saved.imageUrl,raw);assert.equal(saved.title,'After');assert.equal(saved.ctaLink,'/legal-help');
 await assert.rejects(hero.update._handler(ctx,{id,title:'After',description:'After',imageUrl:'another-private-file',order:2,isActive:true}),/security-checked public media/);
});

test('slide controls reject unsafe button destinations and invalid display order',async()=>{
 const h=harness();const userId=await h.user('admin'),user=await h.db.get(userId);
 const ctx={db:h.db,auth:{getUserIdentity:async()=>({subject:user.clerkId})}};
 const base={title:'Hero',description:'Description',imageUrl:'/photo.jpg',order:1,isActive:true};
 for(const args of [{ctaLink:'//outside.example'},{ctaLink:'javascript:alert(1)'},{order:0},{order:1.2}])await assert.rejects(hero.create._handler(ctx,{...base,...args}),/website path|display order/);
});

test('hero renders a bundled photo instead of requesting a raw storage ID as a website page',async()=>{
 const {build}=await import('esbuild');const {createRequire}=await import('node:module');const {runInThisContext}=await import('node:vm');
 const {renderToStaticMarkup}=await import('react-dom/server');const {createElement}=await import('react');
 const result=await build({entryPoints:['src/components/home/hero/HeroImage.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime']});
 const module={exports:{}};runInThisContext('(function(require,module,exports){'+result.outputFiles[0].text+'})')(createRequire(import.meta.url),module,module.exports);
 const {default:Image,HERO_IMAGE_FALLBACK}=module.exports;
 for(const src of [raw,'',undefined,'javascript:alert(1)']){const html=renderToStaticMarkup(createElement(Image,{src,alt:'Hero'}));assert.ok(html.includes('src="'+HERO_IMAGE_FALLBACK+'"'));assert.ok(!html.includes(raw));}
 assert.ok(renderToStaticMarkup(createElement(Image,{src:url,alt:'Hero'})).includes(url));
});
