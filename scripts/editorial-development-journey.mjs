// Fictional QA guides only on joyous-spaniel-5. Every published test version is retired.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {runDevelopment as run} from './test-support/named-development.mjs';
const root=path.resolve(import.meta.dirname,'..'),report={deployment:'joyous-spaniel-5',checkedAt:new Date().toISOString(),checks:{}};
const tag=Date.now();const fields={titleSw:`TEST ONLY — jaribio ${tag}`,titleEn:`TEST ONLY — editorial rehearsal ${tag}`,summarySw:'Huu ni mfano wa kiolesura tu; si mwongozo wa kisheria.',summaryEn:'Fictional interface rehearsal only. This is not legal guidance.',stepsSw:['Kagua kiolesura cha majaribio tu.'],stepsEn:['Check this fictional test interface only.'],category:'TEST ONLY',jurisdiction:'national',sourceTitle:'Expo documentation for this interface rehearsal',sourceUrl:'https://docs.expo.dev/versions/v57.0.0/',publisher:'Expo',reviewDueAt:Date.now()+90*86400000};
function check(name,value){assert.ok(value,name);report.checks[name]=true;console.log(`PASS: ${name}`);}
const id=run('publications:submitLegalGuide',fields,'content_editor');report.originalId=id;
const original=run('publications:getLegalGuideForReview',{id},'content_editor').guide;check('editor submitted pending guide',original.status==='pending');
check('pending guide stays out of public list',!run('publications:listPublicLegalGuides',{}).some(row=>row._id===id));
assert.throws(()=>run('publications:reviewLegalGuide',{id,decision:'approved',note:'TEST ONLY — editor self approval.'},'content_editor'),/Forbidden/);check('editor cannot approve publication',true);
assert.throws(()=>run('publications:getLegalGuideForReview',{id},'staff'),/Forbidden/);check('staff cannot read editorial drafts',true);
run('publications:updatePendingLegalGuide',{id,...fields,titleEn:fields.titleEn+' updated',expectedEditVersion:original.editVersion},'content_editor');
assert.throws(()=>run('publications:updatePendingLegalGuide',{id,...fields,expectedEditVersion:original.editVersion},'content_editor'),/changed/);check('stale draft save rejected',true);
assert.throws(()=>run('publications:reviewLegalGuide',{id,decision:'approved',note:'TEST ONLY — stale publication attempt.',expectedEditVersion:original.editVersion},'admin'),/changed/);check('stale review rejected',true);
run('publications:reviewLegalGuide',{id,decision:'rejected',note:'TEST ONLY — fictional wording correction rehearsal.',expectedEditVersion:2},'admin');check('rejection reason retained',run('publications:getLegalGuideForReview',{id},'content_editor').guide.status==='rejected');
const corrected=run('publications:submitLegalGuide',{...fields,resubmitsGuideId:id},'content_editor');report.correctedId=corrected;
check('correction retains rejected history',run('publications:getLegalGuideForReview',{id:corrected},'content_editor').rejectedDraft._id===id);
assert.throws(()=>run('publications:submitLegalGuide',{...fields,resubmitsGuideId:id},'content_editor'),/already/);check('duplicate correction prevented',true);
run('publications:reviewLegalGuide',{id:corrected,decision:'approved',note:'TEST ONLY — fictional interface publication check; not legal advice.',expectedEditVersion:1},'admin');
check('independent approval enables public visibility',run('publications:listPublicLegalGuides',{}).some(row=>row._id===corrected));
const replacement=run('publications:submitLegalGuide',{...fields,replacesGuideId:corrected},'content_editor');report.replacementId=replacement;
check('published version stays visible while replacement pending',run('publications:listPublicLegalGuides',{}).some(row=>row._id===corrected));
run('publications:reviewLegalGuide',{id:replacement,decision:'approved',note:'TEST ONLY — replacement interface check; not legal advice.',expectedEditVersion:1},'admin');
check('replacement retires earlier version',run('publications:getLegalGuideForReview',{id:corrected},'content_editor').guide.status==='retired');
assert.throws(()=>run('publications:archiveLegalGuide',{id:replacement,reason:'TEST ONLY — removal attempt.'},'content_editor'),/administrator/);check('editor cannot remove published guide',true);
run('publications:retireLegalGuide',{id:replacement,reason:'TEST ONLY — fictional publication check complete. Remove from public use.',expectedEditVersion:2},'admin');check('test publication removed from public results',!run('publications:listPublicLegalGuides',{}).some(row=>[id,corrected,replacement].includes(row._id)));
const pending=run('publications:submitLegalGuide',{...fields,titleEn:`TEST ONLY — browser draft ${tag}`,titleSw:`TEST ONLY — rasimu ${tag}`},'content_editor');report.browserDraftId=pending;
const imported=run('publications:importPreparedLegalGuide',{...fields,titleEn:`TEST ONLY — pack ${tag}`,titleSw:`TEST ONLY — faili ${tag}`},'content_editor');check('prepared import deduplicates',run('publications:importPreparedLegalGuide',{...fields,titleEn:`TEST ONLY — pack ${tag}`,titleSw:`TEST ONLY — faili ${tag}`},'content_editor').created===false);run('publications:archiveLegalGuide',{id:imported.id,reason:'TEST ONLY — guide pack check complete.',expectedEditVersion:1},'content_editor');
fs.writeFileSync(path.join(root,'output/editorial-revamp/development-journey.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({deployment:report.deployment,checks:Object.keys(report.checks).length}));
