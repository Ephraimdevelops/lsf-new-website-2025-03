"""Validate staged artifacts and optionally build an external private-review archive."""
import argparse,csv,hashlib,json,re,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def load(name):return json.loads((ROOT/name).read_text())
def save(name,data):(ROOT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--archive',action='store_true');args=parser.parse_args()
    register=load('source-register.json')['sources'];ids={s['id'] for s in register};assert len(ids)==len(register)
    acquired=load('acquisition-manifest.json')['sources'];byid={a['sourceId']:a for a in acquired};assert len(byid)==len(acquired)
    pdfs={}
    for a in acquired:
        assert a['sourceId'] in ids and a['productionEligible'] is False
        if a.get('file'):assert digest(ROOT/a['file'])==a['sha256'],a['sourceId']
        if a.get('pages'):
            pdfs[a['sourceId']]=a
            text=(ROOT/a['textFile']).read_text();markers=re.findall(r'\[PDF PAGE (\d+)\]',text)
            assert markers==[str(i) for i in range(1,a['pages']+1)],a['sourceId']
        if a.get('ocrTextFile'):assert digest(ROOT/a['ocrTextFile'])==a['ocrTextSha256']
    for s in register:assert s['productionEligible'] is False and s['approvalStatus']=='not_submitted'
    for file,key,refs in [('legal-pathways.json','pathways','sourceIds'),('bilingual-preparation-review.json','drafts','sourceIds'),('provider-candidates-review.json','candidates','sourceIds'),('pathway-approval-workbook.json','pathways','sourceIds')]:
        rows=load(file)[key]
        for row in rows:assert set(row[refs])<=ids and row['productionEligible'] is False
    paths=load('legal-pathways.json')['pathways'];pathids={p['id'] for p in paths};assert len(pathids)==34
    for p in paths:assert p['exactDeadline'] is None and p['exactFee'] is None and p['approvedForum'] is None
    pmap={p['id']:p for p in paths}
    assert 'ZNZ-CRIMINAL-PROCEDURE' in pmap['P19']['sourceIds']
    assert 'ZNZ-CRIMINAL-PROCEDURE' not in pmap['P15']['sourceIds']
    assert 'CASE-LAND-MABULA-2024' in pmap['P03']['sourceIds']
    for row in load('form-locators-review.json')['locators']:
        assert row['sourceId'] in pdfs and 1<=row['pdfPage']<=pdfs[row['sourceId']]['pages']
        assert row['productionEligible'] is False and row['completeBlankFormVerified'] is False
    for row in load('amendment-lineage-review.json')['relations']:
        assert row['amendingOrLaterSourceId'] in ids
        assert row['principalSourceId'] is None or row['principalSourceId'] in ids
        assert row['incorporationVerified'] is False
    candidates=load('upload-candidates-review.json')['candidates'];assert len({c['sha256'] for c in candidates})==len(candidates)
    for c in candidates:
        assert c['researchSourceId'] in ids and digest(ROOT/c['localPDF'])==c['sha256']
        assert c['uploadReady'] is False and c['productionEligible'] is False and c['bindingReasonsEligible'] is False
    summaryids={s['id'] for s in register if s['kind']=='official_case_summary'}
    for row in load('case-law-review.json')['cases']:
        assert row['sourceId'] in ids and row['productionEligible'] is False
        if row['documentTypeObserved']=='official_summary_only':assert row['sourceId'] in summaryids
    geo=load('structured-data/geography-acquisition.json');assert digest(ROOT/geo['file'])==geo['sha256']
    attrs=load('structured-data/nbs-2022-ward-attributes-review.json');assert digest(ROOT/attrs['sourceAttributeFile'])==attrs['sourceSha256']
    rows=attrs['records'];assert len(rows)==4344 and len({r['researchRecordId'] for r in rows})==4344
    assert attrs['coordinatesDerived'] is False and attrs['productionEligible'] is False
    for r in rows:assert all(isinstance(r[k],str) for k in ['reg_code','dist_code','counc_code','ward_code'])
    for file,key in [('review-queue.csv','sourceId'),('requirements-matrix.csv','id')]:
        data=list(csv.DictReader((ROOT/file).open()));assert len({r[key] for r in data})==len(data)
        assert len(data)==(len(register) if key=='sourceId' else 28)
    assert len(load('evaluation-cases.json')['cases'])==49
    report=dict(checkedOn='2026-10-05',status='passed',checks=['All source files and OCR outputs match recorded hashes','PDF-page markers complete and in order','34 pathway and bilingual source bundles resolve; criminal/family topic mappings checked','Form candidate pages within actual source bounds','Amendment relationships resolve and remain uncertified','Upload candidates deduplicated and unapproved; summaries excluded from binding reasons','4344 geography row IDs unique; original code strings and source hashes preserved','Review queue and28 requirements unique;49 evaluations present'],notValidated=['Legal currency/completeness, holdings or applicability','Kiswahili correctness and accessibility','Provider registration, contact, hours or capacity','Reuse permission','Current geographic boundaries or GIS topology','Live backend, retrieval, bookings or referral integrations'])
    save('continuation-validation.json',report)
    stats=load('pack-statistics.json')
    save('completion-audit.json',dict(researchPreparationStatus='completed_private_review_bundle',productionReadiness=False,statistics=stats,deliverables=[dict(requirement='Public source acquisition and missing-authority record',evidence=['source-register.json','acquisition-manifest.json','authoritative-source-gap-register.json'],result='Registered candidates, actual acquired copies and individual failures retained; no exhaustive/current-law certification'),dict(requirement='Mainland/Zanzibar topic and amendment coverage',evidence=['LEGAL-PATHWAYS.md','amendment-lineage-review.json','conflicts-and-cautions.json'],result='34 linked review drafts, documented counterpart gaps and conflicting editions'),dict(requirement='Bilingual and document-preparation content',evidence=['BILINGUAL-PREPARATION-REVIEW.md','PREPARATION-TEMPLATES.md','GLOSSARY-REVIEW.md','FORM-LOCATORS-REVIEW.md'],result='Original preparation and terminology drafts; prescribed-form source candidates identified'),dict(requirement='Service/geography and owner inputs',evidence=['provider-candidates-review.json','structured-data/earlier-provider-and-faq-review.json','structured-data/geography-validation-review.json','LSF-AND-PARTNER-INFORMATION-REQUEST.md'],result='Public leads and historical geography staged;21 explicit owner requests'),dict(requirement='Upload-readiness and verification',evidence=['upload-candidates-review.json','pathway-approval-workbook.json','UPLOAD-AND-APP-READINESS.md','continuation-validation.json'],result='Review candidates, unresolved metadata, app gates,49 unexecuted evaluation cases and passed integrity validation')],remainingForProduction=['Authenticated unavailable source copies and topic-specific procedural gaps listed in AUTHORITATIVE-SOURCE-GAPS.md','Qualified legal currency, applicability and case-law review','Independent language/accessibility review','LSF policies, roles, eligibility, safeguarding and privacy decisions','Provider confirmation and real referral/booking integrations','Source permissions, current place-code validation and app evaluation'],actionsNotTaken=['No source or provider approval','No backend upload or app change','No provider contact or case submission','No live client data collected']))
    save('continuation-status.json',dict(researchPreparationStatus='completed',publicPreparationStatus='Private review bundle prepared and integrity validated; remaining legal coverage/owner dependencies explicitly recorded.',externalDecisionsRequired=load('completion-audit.json')['remainingForProduction'],noPublicUploadOrContact=True))
    if args.archive:
        # Retain the acquired NBS ZIP as source evidence; exclude only review bundles.
        files=sorted(p for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name not in ['.DS_Store','bundle-file-hashes.json'] and not p.name.endswith('-private-review.zip'))
        save('bundle-file-hashes.json',dict(algorithm='SHA256',files=[dict(file=str(p.relative_to(ROOT)),sha256=digest(p),bytes=p.stat().st_size) for p in files]))
        files.append(ROOT/'bundle-file-hashes.json')
        archive=ROOT.parent/(ROOT.name+'-private-review.zip');assert archive.parent!=ROOT
        with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
            for p in files:z.write(p,arcname=str(Path(ROOT.name)/p.relative_to(ROOT)))
        with zipfile.ZipFile(archive) as z:
            assert z.testzip() is None
            for p in files:assert hashlib.sha256(z.read(str(Path(ROOT.name)/p.relative_to(ROOT)))).hexdigest()==digest(p)
        # External report avoids a self-referential hash or stale report inside ZIP.
        audit=dict(status='passed',archive=str(archive),sha256=digest(archive),bytes=archive.stat().st_size,fileCount=len(files),allMemberHashesVerified=True,archiveSelfIncluded=False)
        (ROOT.parent/(ROOT.name+'-archive-validation.json')).write_text(json.dumps(audit,indent=2)+'\n')
        print(json.dumps(audit,indent=2))
    else:print(json.dumps(report,indent=2))
if __name__=='__main__':main()
