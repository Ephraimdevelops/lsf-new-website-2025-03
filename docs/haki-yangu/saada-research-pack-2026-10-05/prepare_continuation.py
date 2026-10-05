"""Reconcile continuation evidence; create review aids without approval or backend writes."""
import csv, hashlib, json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent
def load(name): return json.loads((ROOT/name).read_text())
def save(name, value): (ROOT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def quality():
    manifest=load('acquisition-manifest.json'); records={r['sourceId']:r for r in manifest['sources']}
    counterparts={'ZNZ-EMPLOYMENT':'ZNZ-EMPLOYMENT-GAZETTE','LABOUR-COURT-RULES':'LABOUR-COURT-READABLE','EMPLOYMENT-GENERAL-FORMS':'EMPLOYMENT-FORMS-READABLE'}
    report=[]
    for sid,a in records.items():
        if not a.get('pages'): continue
        a['searchableTextStatus']='unverified_native_extraction' if a.get('extractedCharacters',0)>0 else 'image_scan_no_native_text'
        a['extractionQuality']='not_manually_verified'
        if sid in counterparts:
            a['readableCounterpartCandidate']=counterparts[sid]
            a['counterpartIdentityReconciled']=False
        name=sid.lower(); ocr=ROOT/'ocr-review'/f'{name}.json'
        if ocr.exists():
            data=json.loads(ocr.read_text()); assert data['sourcePDFPageCount']==a['pages']; assert len(data['pages'])==a['pages']
            output=ROOT/'extracted-text'/f'{name}.ocr-unverified.txt'
            output.write_text('\n\n'.join(f"[PDF PAGE {p['page']}]\n{p.get('text','')}" for p in data['pages']))
            a['ocrReviewFile']=str(ocr.relative_to(ROOT));a['ocrTextFile']=str(output.relative_to(ROOT))
            a['ocrStatus']='machine_ocr_unverified';a['ocrEngine']=data['engine'];a['ocrReviewedPageCount']=0
            a['ocrTextSha256']=hashlib.sha256(output.read_bytes()).hexdigest()
            a['searchableTextStatus']='machine_ocr_requires_visual_transcription_review'
        report.append(dict(sourceId=sid,nativeCharacters=a.get('extractedCharacters'),pages=a['pages'],lowTextPages=a.get('pagesWithVeryLittleText',[]),searchableTextStatus=a['searchableTextStatus'],readableCounterpartCandidate=a.get('readableCounterpartCandidate'),ocrStatus=a.get('ocrStatus'),productionEligible=False))
    save('acquisition-manifest.json',manifest); save('extraction-review.json',dict(status='review_required',documents=report))

def lineage():
    rows=[
      ('ZNZ-KADHIS-2024',None,'Kadhi’s Court Act9/2017','PDF p4 section1; p21 section44','Act8/2023; assent1February2024; Gazette23February2024','Appointed commencement notice missing. Repeal and pending-proceeding savings must be reviewed;2021 rules not presumed current.'),
      ('ZNZ-CRIMINAL-AMENDMENT-2021','ZNZ-CRIMINAL-PROCEDURE','Criminal Procedure Act7/2018','PDF p4 sections3–5','Act1/2021','Amends interpretation and replaces section151 bail provisions. Principal Act alone is unsafe for current bail advice; later amendments search remains open.'),
      ('FCC-AMENDMENT-2024','CONSUMER-FAIR-COMPETITION','Fair Competition Act','Cover and operative amendments','2024','Compare all amendments with FCC-CURRENT-ACT; do not apply amendment twice to consolidated text.'),
      ('EMPLOYMENT-AMENDMENTS-2025','BASE-ELRA','Labour laws','Whole instrument','Act4/2025','Track each amended Act and commencement provision separately.'),
      ('ESTATES-PRIMARY-AMENDMENT-2025',None,'Primary Courts Administration of Estates Rules GN49/1971','PDF p2 rule3; prescribed schedules','GN428/2025','New FOMU MIRATHI-1 and related requirements; principal1971 copy still missing. Do not reuse old FormI without amendment review.'),
      ('LAND-TRIBUNAL-2023','LAND-TRIBUNAL-PRINCIPAL','District Land and Housing Tribunal Regulations GN174/2003','Original and amendment instruments','GN171/2023','Reconcile amended procedures/forms/fees and later instruments. Original heading2003 and citation2002 need preservation.'),
      ('LEGAL-AID-SUPPLEMENT-2025','BASE-LEGAL-AID','Legal Aid Act chapter21','Edition cover and section annotations','Supplement through31July2025','Later consolidated candidate; inspect incorporation of Act11/2023 and search subsequent changes.'),
      ('PROC-APPEAL-AMENDMENT-2024','PROC-APPEAL-PRINCIPAL','Court of Appeal Rules','GN188/2024','2024','Read with principal2009 rules, previous amendments and later amendments; not a replacement full ruleset.'),
      ('AMENDMENTS-MISC-2-2025','RIGHTS-ENFORCEMENT','Basic Rights and Duties Enforcement Act','PDF pp5–6 PartIII','Act2/2025','Identify effects on rights litigation before approving constitutional pathway.'),
      ('AMENDMENTS-LEGAL-SECTOR-2023',None,'Multiple justice-sector Acts','PartsIII–VI,XII,XIV,XV,XIX,XX','Act11/2023','Appellate jurisdiction, arbitration, CHRAGG, criminal procedure, land disputes, legal aid, magistrates courts, Penal Code and probate need individual incorporation review.'),
      ('WCF-REGULATIONS-VERSION','WCF-REGULATIONS-2016','Workers Compensation Regulations GN185/2016','Repository edition notes and rule2','Version cutoff unverified','Different repository files display different validity periods; acquire2021 and later amendments. Scope includes a conditional Zanzibar branch; do not route by island alone.')]
    ids={s['id'] for s in load('source-register.json')['sources']}
    for amendment,principal,*_ in rows: assert amendment in ids and (principal is None or principal in ids)
    save('amendment-lineage-review.json',dict(status='candidate_relationships_not_certified_current',relations=[dict(amendingOrLaterSourceId=a,principalSourceId=p,principalTitle=t,locator=l,observedVersion=v,reviewAction=r,incorporationVerified=False,productionEligible=False) for a,p,t,l,v,r in rows]))

def upload_candidates():
    sources=load('source-register.json')['sources'];acquired={r['sourceId']:r for r in load('acquisition-manifest.json')['sources']}
    candidates=[]
    seen=set()
    for s in sources:
        a=acquired.get(s['id'],{})
        if not a.get('pages') or a['sha256'] in seen: continue
        seen.add(a['sha256'])
        candidates.append(dict(researchSourceId=s['id'],localPDF=a['file'],sha256=a['sha256'],titleDraft=s['title'],sourceUrl=s.get('downloadUrl') or s['recordUrl'],versionLabelDraft=s['versionLabel'],observedJurisdiction=s['jurisdictionObserved'],observedLanguage=s['languageObserved'],topicDraft=s['topic'],publisher=None,approvedJurisdiction=None,approvedLanguage=None,effectiveDate=None,reviewDueAt=None,legalReviewer=None,reusePermission=s['reusePermission'],uploadReady=False,blockers=['Verify document identity and version','Confirm applicability, amendments and commencement','Review extraction and schedules','Determine publisher, supported jurisdiction/language/category fields','Confirm storage/indexing permissions','Assign independent reviewer and review date'],approvalStatus='not_submitted',productionEligible=False))
    save('upload-candidates-review.json',dict(directBackendImport=False,uploadPerformed=False,candidates=candidates))

def page_locators():
    candidates=[]
    for sid in ['AMENDMENTS-MISC-1-2025','AMENDMENTS-MISC-2-2025','AMENDMENTS-MISC-2024','AMENDMENTS-LEGAL-SECTOR-2023']:
        content=(ROOT/'extracted-text'/f'{sid.lower()}.txt').read_text()
        parts=re.split(r'\[PDF PAGE (\d+)\]',content)
        for i in range(1,len(parts),2):
            text=parts[i+1]
            for m in re.finditer(r'AMENDMENT OF[^\n]*(?:\n[^\n]+){0,2}',text):
                candidates.append(dict(sourceId=sid,pdfPage=int(parts[i]),headingCandidate=m.group(0).strip(),manualReviewRequired=True))
    save('amendment-heading-locators.json',candidates)

if __name__=='__main__':
    quality();lineage();upload_candidates();page_locators()
    print('Continuation quality, lineage, upload candidates and heading locators prepared; approvals remain false.')
