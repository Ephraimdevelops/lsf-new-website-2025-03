"""Read-only targeted discovery in the OSG public catalogue; no legal approval."""
import concurrent.futures,json,urllib.parse,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parent
QUERIES=[
 'Penal Code','Mediation and Arbitration','Commission Mediation fees 2025',
 'Labour Court Rules','Employment Labour General Regulations','District Land Housing Tribunal Regulations',
 'Primary Courts Administration Estates','Court Appeal Amendment 2024','Judicial Review Rules',
 'Whistleblower Witness Protection','Arbitration Act','Arbitration Rules Procedure',
 'National Social Security Fund','Public Service Social Security Fund','Social Security benefits 2025',
 'Local Customary Law Declaration','Rent Restriction','Human Rights Good Governance',
 'Civil Procedure Amendment 2025','Primary Courts Approved Forms 2025',
 'Written Laws Miscellaneous Amendments 2026','Written Laws Miscellaneous Amendments 2025',
 'Workers Compensation Regulations','Persons Disabilities Regulations','Civil Procedure Appeal Primary Courts',
 'Legal Aid Code Conduct','Legal Aid Remuneration Advocates',
]
def query(term):
    url='https://elibrary.osg.go.tz/server/api/discover/search/objects?'+urllib.parse.urlencode({'query':term,'size':12})
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 HakiYanguPrivateResearch/1.0'})
        with urllib.request.urlopen(req,timeout=25) as response: raw=json.load(response)
        (ROOT/'catalogue-discovery').mkdir(exist_ok=True)
        slug='-'.join(term.lower().split())
        (ROOT/'catalogue-discovery'/f'{slug}.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2)+'\n')
        results=[]
        hits=raw.get('_embedded',{}).get('searchResult',{}).get('_embedded',{}).get('objects',[])
        for hit in hits:
            item=hit.get('_embedded',{}).get('indexableObject',{})
            if not item.get('uuid'):continue
            results.append(dict(title=item.get('name'),uuid=item['uuid'],recordUrl='https://elibrary.osg.go.tz/items/'+item['uuid'],metadata=item.get('metadata',{})))
        return dict(query=term,url=url,retrievedOn='2026-10-05',results=results)
    except Exception as e:return dict(query=term,url=url,error=str(e),results=[])
if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(query,QUERIES))
    (ROOT/'official-catalogue-discovery.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    for r in results:
        print('\nQUERY:',r['query'],r.get('error',''))
        for x in r['results'][:7]:print(x['uuid'],x['title'])
