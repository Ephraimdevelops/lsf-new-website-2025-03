"""Register explicit, evidence-selected continuation sources. No automated legal approval."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SELECTED=[
 ('CRIM-PENAL','c545f591-bf5d-482f-ac11-bbdad280726e','criminal','statute','R.E.2023'),
 ('CMA-PROCEDURE','691e334d-b69a-4e39-b831-7525b9318246','employment','regulation','GN64/2007'),
 ('CMA-GUIDELINES','cae67bc5-e406-4eda-8e6e-b2996be1fbe5','employment','regulation','GN67/2007'),
 ('LABOUR-COURT-RULES','985d8e8f-39a7-42cf-8c0b-bca299bd2f4d','employment','regulation','GN106/2007'),
 ('EMPLOYMENT-GENERAL-FORMS','4bef80c9-6b3e-4913-83ca-03ba5bb7c892','employment','regulation','GN47/2017'),
 ('LABOUR-INSTITUTIONS-GENERAL','acfc12db-a499-4e03-bb4f-88b3eb9d5902','employment','regulation','GN45/2017'),
 ('PROC-APPEAL-AMENDMENT-2024','5cb53706-9992-4c60-9b23-c8230baaa42c','procedure','regulation','GN188/2024'),
 ('PROC-JUDICIAL-REVIEW','96774d57-b86d-4b19-a3fd-5ab67fe44f97','procedure','regulation','GN324/2014'),
 ('SAFE-WITNESS-ACT','2a879887-a8e4-40d7-b539-6973db660512','safety','statute','R.E.2023'),
 ('ADR-ARBITRATION-ACT','43b1540f-e955-49c3-9e19-a7da72d9b0f8','adr','statute','R.E.2023'),
 ('ADR-ARBITRATION-RULES','c2f1e5d5-7015-40c5-a1fd-c31e4158de98','adr','regulation','GN146/2021'),
 ('ADR-ACCREDITATION','ca5ffa18-6bb0-4d26-aa8f-eac50414f53d','adr','regulation','GN147/2021'),
 ('ADR-CONDUCT','fdb4e69e-1ff3-4e3c-b659-9110182900fa','adr','regulation','GN148/2021'),
 ('SOCIAL-NSSF','f4b3485e-b14f-4be1-be42-bc13e10e1d61','social_security','statute','R.E.2023'),
 ('SOCIAL-PSSSF-2025','48f7955f-303f-47ed-a7ed-937c92bccfec','social_security','statute','R.E.2023 A.S.2025'),
 ('PROC-APPLICABLE-LAWS','d912b5c6-6f85-4591-b532-c2b7d3531f24','procedure','statute','R.E.2023'),
 ('RIGHTS-CHRAGG-ACT','676ba370-b108-4bb0-a0c6-9ea1645c989f','rights','statute','R.E.2023'),
 ('PROC-CIVIL-FORMS-2022','325110ac-5faa-4873-ba47-cf916ae54e9a','procedure','regulation','GN355/2022'),
 ('AMENDMENTS-MISC-1-2025','fe8e53cc-ef81-4b76-9f8f-4c97a4e9bc01','amendments','statute','Act1/2025'),
 ('AMENDMENTS-MISC-2-2025','93c3e881-027a-442f-af14-210d520c7695','amendments','statute','Act2/2025'),
 ('AMENDMENTS-MISC-2024','2a5cbf7b-2d9b-40c9-b553-9286fa81dbef','amendments','statute','2024; exact number to inspect'),
 ('LEGAL-AID-SUPPLEMENT-2025','844e0d81-aaad-49cb-bb18-dd3225004d39','legal_aid','statute','annual supplement through31 July2025'),
 ('AMENDMENTS-LEGAL-SECTOR-2023','8c987f44-10cd-4cd4-a6a6-9d39470a850c','amendments','statute','Act11/2023'),
]
EXTRA=[
 ('CMA-FEES-2025','Kanuni za Ada za Tume ya Usuluhishi na Uamuzi za Mwaka2025','employment','regulation','GN60/2025','sw','mainland_candidate','https://oagmis.oag.go.tz/portal/legislation/4336','https://oagmis.oag.go.tz/portal/legislation/4336/download','Official replacement for failed CMA-hosted download. Verify fee waiver and commencement separately.'),
 ('ZNZ-ASSEMBLY-2011','Zanzibar Assembly2011 Acts catalogue','children','catalogue','2011','en','zanzibar_candidate','https://www.zanzibarassembly.go.tz/sw/acts/acts_2011/2011',None,'Find official Children Act download; catalogue observed by web search.'),
 ('ZNZ-ASSEMBLY-2018','Zanzibar Assembly2018 Acts catalogue','legal_aid','catalogue','2018','en','zanzibar_candidate','https://www.zanzibarassembly.go.tz/sw/acts/acts_2018/2018',None,'Find full Legal Aid, Penal, Criminal Procedure and Judiciary Acts.'),
 ('ZNZ-ASSEMBLY-2017','Zanzibar Assembly2017 Acts catalogue','family','catalogue','2017','en','zanzibar_candidate','https://www.zanzibarassembly.go.tz/sw/acts/acts_2017/2017',None,'Find Kadhis Court Act and current amendments.'),
 ('ZNZ-EMPLOYMENT','Zanzibar Employment Act','employment','statute','Act11/2005','en','zanzibar_candidate','https://natlex.ilo.org/dyn/natlex2/r/natlex/fe/details?p3_isn=82420','https://zanzibar.eregulations.org/media/Employment-act-2005.pdf','Original principal Act; commencement notice and later amendments still required. Host is business-procedures portal, not proof of currency.'),
 ('ZNZ-CHILD-RESOURCE','Zanzibar children and succession document catalogue','children','catalogue','mixed historical versions','en','zanzibar_candidate','https://www.clr.africanchildforum.org/Pages_EN/Tanzania.html',None,'Archive lead only; avoid obsolete Children1952, Labour1997, Penal2004 as current law.'),
 ('SERVICES-LHRC','LHRC legal-aid clinic public contact page','services','service_page','page observed2026-10-05','en','mainland_candidate','https://legalaid.humanrights.or.tz/en/contact',None,'Read only. Publicly listed contacts need operational verification; no form or message submitted.'),
 ('SERVICES-ZLS','Zanzibar Law Society legal publications','services','catalogue','page observed2026-10-05','en','zanzibar_candidate','https://zls.or.tz/legal-publications',None,'Act labels conflict with Gazette; Coming soon is not a full legal source.'),
]
def main():
    discovered=json.loads((ROOT/'official-catalogue-discovery.json').read_text())
    byuuid={x['uuid']:x for group in discovered for x in group['results']}
    register=json.loads((ROOT/'source-register.json').read_text());byid={s['id']:s for s in register['sources']}
    candidates=[]
    for sid,uuid,topic,kind,version in SELECTED:
        x=byuuid[uuid]
        candidates.append((sid,x['title'],topic,kind,version,'en','mainland_candidate',x['recordUrl'],None,'Official OSG catalogue metadata saved. Actual PDF identity, amendments, scope and page-level extraction require review.'))
    candidates.extend(EXTRA)
    for row in candidates:
        sid,title,topic,kind,version,lang,jur,record,download,note=row
        previous=byid.get(sid)
        entry=dict(id=sid,title=title,topic=topic,kind=kind,versionLabel=version,languageObserved=lang,jurisdictionObserved=jur,
                   recordUrl=record,downloadUrl=download,researchDate='2026-10-05',discoveryStatus='evidence_selected_continuation',
                   evidenceLevel='catalogue_or_page_observed_not_full_legal_review',reviewNotes=[note],approvalStatus='not_submitted',
                   reusePermission='unresolved',amendmentReview='incomplete',effectiveDate=None,reviewDueAt=None,reviewer=None,productionEligible=False)
        if previous:
            entry['previousResearchUrls']=list(set(previous.get('previousResearchUrls',[])+[previous.get('downloadUrl') or previous['recordUrl']]))
            entry['reviewNotes']=previous['reviewNotes']+[note]
        byid[sid]=entry
    register['sources']=list(byid.values())
    (ROOT/'source-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'continuation-acquisition-ids.json').write_text(json.dumps([x[0] for x in candidates],indent=2)+'\n')
    print(' '.join(x[0] for x in candidates))
if __name__=='__main__':main()
