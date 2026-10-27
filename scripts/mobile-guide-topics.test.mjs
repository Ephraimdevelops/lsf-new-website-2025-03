import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { guideTopic, availableGuideTopics } from '../mobile/src/guideTopics.ts';
const guides=JSON.parse(readFileSync(new URL('../docs/haki-yangu/know-your-rights-expanded-2026-10-07/guide-drafts.json',import.meta.url),'utf8')).guides.map(g=>g.appFieldsDraft);
test('mobile topic filters reach all 108 questions, including the four previously missing topics',()=>{
 const topics=availableGuideTopics(guides);assert.equal(topics.length,9);
 for(const topic of topics)assert.equal(guides.filter(g=>guideTopic(g.category).key===topic.key).length,12);
 assert.ok(['inheritance','documents','access_justice','zanzibar'].every(key=>topics.some(t=>t.key===key)));
});
test('future editor categories remain discoverable without a hardcoded mobile list update',()=>{
 const topic=guideTopic('New public topic');assert.equal(topic.key,'New public topic');
 assert.equal(availableGuideTopics([{category:'New public topic'},{category:'New public topic'}]).length,1);
});
