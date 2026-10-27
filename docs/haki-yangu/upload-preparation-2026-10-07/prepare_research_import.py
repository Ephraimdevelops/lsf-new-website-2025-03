"""Build private staff research inputs, with unknowns and original provenance retained."""
import json
from pathlib import Path
OUT=Path(__file__).resolve().parent
inventory=json.loads((OUT/'organisation-research-inventory.json').read_text())
pack=OUT.parent/'saada-research-pack-2026-10-05'
register={r['id']:r for r in json.loads((pack/'source-register.json').read_text())['sources']}
entries=[]
for group in ['earlierOfficeAndProgrammeRows','recentPublicCandidateRows','zanzibarRegistryRows']:
 for index,row in enumerate(inventory[group]):
  urls=[row.get('sourceUrl') or row.get('sourceURL')] if row.get('sourceUrl') or row.get('sourceURL') else [inventory['earlierSources'][k] for k in row.get('sources',[])]
  title=row.get('name') or ' '.join(filter(None,[row.get('organisation'),row.get('officeDraft')])) or row.get('extractedRecordVerbatim','').split('\n')[0]
  entry={'externalKey':f"research-20261007:{group}:{row.get('id',index+1)}",'kind':'organisation' if group=='zanzibarRegistryRows' else 'centre','title':title,'notes':'Unverified research lead. Confirm organisation identity, location, contacts, service coverage, eligibility, hours and intake before creating a verified public service. Overlapping source rows are intentionally retained.','sourceUrls':list(dict.fromkeys(urls)),'originalRecord':json.dumps(row,ensure_ascii=False)}
  for field,values in {'address':['address','addressObserved'],'phone':['phone'],'email':['email','emailObserved'],'region':['region'],'district':['district']}.items():
   value=next((row[k] for k in values if row.get(k)),None)
   if value:entry[field]=value
  if row.get('phonesObserved'):entry['phone']=' / '.join(row['phonesObserved'])
  entries.append(entry)
for row in json.loads((pack/'legal-pathways.json').read_text())['pathways']:
 urls=[register[k].get('recordUrl') or register[k].get('downloadUrl') for k in row['sourceIds']]
 entries.append({'externalKey':f"research-20261007:pathway:{row['id']}",'kind':'pathway','title':row['titleEn'],'notes':'Draft pathway for independent legal and practical service review. '+row['applicability']+' Open items: '+'; '.join(row['unresolvedReviewItems']),'sourceUrls':list(dict.fromkeys(urls)),'originalRecord':json.dumps(row,ensure_ascii=False)})
assert len(entries)==71
assert len({e['externalKey'] for e in entries})==71
assert all(e['sourceUrls'] and all(u.startswith('https://') for u in e['sourceUrls']) for e in entries)
(OUT/'directory-research-import.json').write_text(json.dumps({'entries':entries,'productionEligible':False,'uploaded':0},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'researchRecords':len(entries),'sourceRows':37,'pathwayDrafts':34,'uploaded':0}))
