"""Follow a single observed official PDF link per selected catalogue record."""
import argparse,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent
if __name__=='__main__':
    register=json.loads((ROOT/'source-register.json').read_text())
    manifest=json.loads((ROOT/'acquisition-manifest.json').read_text())
    parser=argparse.ArgumentParser();parser.add_argument('--ids',nargs='*');args=parser.parse_args()
    ids=set(args.ids or json.loads((ROOT/'continuation-acquisition-ids.json').read_text()))
    acquired={s['sourceId']:s for s in manifest['sources']}
    selected=[];review=json.loads((ROOT/'catalogue-link-review.json').read_text()) if (ROOT/'catalogue-link-review.json').exists() else []
    for s in register['sources']:
        if s['id'] not in ids:continue
        a=acquired.get(s['id'],{})
        if a.get('status')!='page_acquired':continue
        links=[x for x in a.get('downloadCandidates',[]) if re.search(r'/bitstreams/[^/]+/download|\.pdf($|\?)',x['url'],re.I)]
        links=list({x['url']:x for x in links}.values())
        if len(links)==1 and s['kind'] in ['statute','regulation','judgment']:
            s['downloadUrl']=links[0]['url'];selected.append(s['id'])
            review.append(dict(sourceId=s['id'],observedLink=links[0],action='follow_single_observed_link'))
        else:review.append(dict(sourceId=s['id'],action='manual_selection_required',candidates=links))
    (ROOT/'source-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'catalogue-link-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
    print(' '.join(selected))
