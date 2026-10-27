"""Original review aids. No legal approval, upload, contact or case-data processing."""
import json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def load(name): return json.loads((ROOT/name).read_text())
def save(name,data): (ROOT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

TERMS=[
('Legal aid','Msaada wa kisheria','Legal help under an applicable legal-aid scheme; eligibility and services depend on the scheme.'),
('Jurisdiction','Mamlaka ya kisheria','The legal power of a particular body to handle a particular matter.'),
('Claimant','Mdai','The person bringing a claim; terminology differs between proceedings.'),
('Respondent','Mjibu maombi au mjibu rufaa','The party responding to an application or appeal; use the term prescribed by that proceeding.'),
('Defendant','Mdaiwa au mshtakiwa','A responding party in civil proceedings or an accused person in criminal proceedings; these roles must be distinguished.'),
('Summons','Wito wa mahakama','A formal document requiring a response or attendance; inspect the actual document and service.'),
('Service of documents','Ufikishaji wa nyaraka kisheria','Delivering documents in the manner required by the applicable rules.'),
('Hearing','Usikilizaji wa shauri','A proceeding at which the relevant body hears the matter.'),
('Judgment','Hukumu','A court decision; its reasons, orders and available challenges must be read together.'),
('Order','Amri','A direction or decision made by a competent body.'),
('Decree','Decree — istilahi ya kuthibitishwa','A formal expression of a civil adjudication as defined by the applicable law; do not equate every order with a decree.'),
('Appeal','Rufaa','A challenge to a decision before an appellate body, subject to applicable conditions.'),
('Revision','Mapitio ya mamlaka ya juu — kuthibitishwa','Supervisory examination under the applicable law; distinguish it from review by the deciding court.'),
('Review','Kupitiwa upya kwa uamuzi — kuthibitishwa','Reconsideration under the applicable rules; distinguish it from an appeal or supervisory revision.'),
('Limitation period','Muda wa ukomo wa kuleta shauri','A legal time limit whose trigger, exceptions and extension rules require issue-specific checking.'),
('Extension of time','Kuongezewa muda','Permission to take a step after the usual time, where the applicable law allows it.'),
('Stay','Kusimamishwa kwa hatua au utekelezaji','A temporary suspension ordered under applicable law; filing an appeal does not automatically establish a stay.'),
('Injunction','Amri ya zuio','An order concerning doing or refraining from specified acts; conditions depend on the proceeding.'),
('Affidavit','Hati ya kiapo','A written statement sworn or affirmed in a legally recognised manner.'),
('Witness','Shahidi','A person providing evidence; safety and procedural requirements need separate consideration.'),
('Consent','Ridhaa','Agreement to a specified action; validity and required form depend on the action and person involved.'),
('Confidentiality','Usiri','Restrictions on sharing information; do not promise absolute secrecy without an approved policy and legal basis.'),
('Referral','Rufaa ya huduma','A handoff to a service provider; distinguish this service referral from a court appeal.'),
('Mediation','Usuluhishi','A facilitated attempt to reach agreement; suitability, voluntariness and safety must be assessed.'),
('Arbitration','Uamuzi wa mgogoro kwa usuluhishi wa kisheria — kuthibitishwa','An adjudicative dispute process under an agreement or law; distinguish it from facilitated mediation.'),
('Probate','Uthibitisho wa wosia — kuthibitishwa','A legal process or grant relating to a will under the applicable succession law.'),
('Administrator of estate','Msimamizi wa mirathi','A person appointed under the applicable law to administer an estate; family nomination alone must not be assumed to confer authority.'),
('Beneficiary','Mnufaika','A person entitled or potentially entitled under a scheme, estate or instrument; entitlement needs verification.'),
('Fee remission','Msamaha au upunguzaji wa ada — kuthibitishwa','Relief from a fee under the applicable rules; eligibility and procedure must be checked.'),
('Reasonable accommodation','Marekebisho yanayofaa kwa upatikanaji — kuthibitishwa','An accessibility adjustment whose legal definition and duties depend on the applicable disability law.'),
('Commencement','Kuanza kutumika kwa sheria','When legal provisions come into operation; assent, publication and appointed dates may differ.'),
('Repeal and savings','Kufutwa kwa sheria na masharti ya kuendeleza mambo yaliyotangulia','Provisions ending an earlier law while addressing some existing rights, actions or proceedings.'),
]

def main():
    sources=load('source-register.json')['sources']; acquired={s['sourceId']:s for s in load('acquisition-manifest.json')['sources']}
    terms=[dict(id=f'TERM-{i:02}',english=e,kiswahiliDraft=s,explanationEnDraft=d,translationReviewed=False,legalAdviceApproved=False,productionEligible=False) for i,(e,s,d) in enumerate(TERMS,1)]
    save('glossary-review.json',dict(status='original_terminology_draft_not_authoritative_translation',terms=terms))
    md=['# Terminology for language and legal review','','These original drafts help reviewers identify distinctions the app must preserve. They are not an authoritative legal dictionary. Terms marked “kuthibitishwa” particularly need specialist language review. No legal deadline or entitlement is established by a definition.','','| English | Kiswahili draft | Meaning to review |','|---|---|---|']
    md += [f'| {t["english"]} | {t["kiswahiliDraft"]} | {t["explanationEnDraft"]} |' for t in terms]
    (ROOT/'GLOSSARY-REVIEW.md').write_text('\n'.join(md)+'\n')
    selected=['EMPLOYMENT-FORMS-READABLE','ESTATES-PRIMARY-AMENDMENT-2025','WCF-NOTIFICATION','WCF-CLAIM','WCF-AMENDMENT-2021','WCF-REGULATIONS-2016','PROC-SMALL-CLAIMS','PROC-CIVIL-FORMS-2022','PRIVACY-COMPLAINTS','LEGAL-AID-REGULATIONS','ZNZ-LEGAL-AID-RULES','FCC-CONSUMER-PROCEDURE','ZNZ-CHILD-COURT-RULES','PROC-ECMS-GUIDE']
    patterns=re.compile(r'\bCMA\s*F\.?\s*\d+|FOMU\s+MIRATHI\s*-?\s*\d+|\bWCN\s*-?\s*\d+\b|\bWCC\s*-?\s*\d+[A-Z]?\b|\bWCP\s*-?\s*\d+\b|\bFORM\s+[A-Z0-9]{1,3}\b',re.I)
    forms=[]
    for sid in selected:
        a=acquired.get(sid,{})
        if not a.get('textFile'):continue
        parts=re.split(r'\[PDF PAGE (\d+)\]',(ROOT/a['textFile']).read_text())
        for i in range(1,len(parts),2):
            page=int(parts[i]);text=parts[i+1]
            names=sorted(set(re.sub(r'\s+',' ',m.group(0)).strip() for m in patterns.finditer(text)))
            for name in names:
                forms.append(dict(sourceId=sid,pdfPage=page,formLabelCandidate=name,locatorType='unverified_text_match_may_be_reference_not_blank_form',completeBlankFormVerified=False,currentVersionVerified=False,filingDestination=None,mandatoryAttachments=None,signatures=None,deadline=None,fee=None,reviewer=None,productionEligible=False))
    if acquired.get('SOCIAL-NSSF-COMPLAINT-FORM',{}).get('pages'):
        forms.append(dict(sourceId='SOCIAL-NSSF-COMPLAINT-FORM',pdfPage=1,formLabelCandidate='FOMU YA UTHIBITISHO WA UAMUZI WA MALALAMIKO',locatorType='heading_observed_not_full_legal_review',completeBlankFormVerified=False,currentVersionVerified=False,filingDestination=None,mandatoryAttachments=None,signatures=None,deadline=None,fee=None,reviewer=None,productionEligible=False))
    save('form-locators-review.json',dict(status='source_page_candidates_require_visual_and_legal_review',blankFormsExtracted=False,personalDataCollected=False,locators=forms))
    md=['# Prescribed forms and filing-manual review','','Page references below are candidates from unverified extracted text. A reference to a form is not proof that a complete blank form appears on that page. Keep the source PDF intact; compare every field, continuation page, signature, rule and schedule before approving a form. No completed client form has been created.','','| Source | PDF page | Label candidate |','|---|---|---|']
    md += [f'| {r["sourceId"]} | {r["pdfPage"]} | {r["formLabelCandidate"]} |' for r in forms]
    md += ['','For each approved form record: exact instrument and form identity; all pages; current amendments; eligible proceeding and forum; lawful document alternatives; signature/witness requirements; service method; deadline trigger and extensions; fees/remission; registry or portal destination; lawyer and registry reviewer; approval date and next review. App-generated intake worksheets must never be presented as prescribed court forms.']
    (ROOT/'FORM-LOCATORS-REVIEW.md').write_text('\n'.join(md)+'\n')
    gaps=[]
    for s in sources:
        a=acquired.get(s['id'],{})
        if a.get('status') in ['fetch_failed','challenge_page']:
            gaps.append(dict(sourceId=s['id'],title=s['title'],url=a.get('requestedUrl') or s['recordUrl'],observedOutcome=a.get('error') or a['status'],scope='This retrieval attempt failed; not proof the instrument does not exist.',nextAction='Obtain authenticated copy from issuing body or registry; verify exact identity and currency. Never substitute search snippets for full law.',productionEligible=False))
    save('authoritative-source-gap-register.json',dict(researchDate='2026-10-05',gaps=gaps,focusedUnresolvedInstruments=[
      dict(title='Zanzibar Legal Aid Act',reason='ZLSC English18/2018 and Kiswahili13/2018 labels conflict; both linked copies returned404. Gazette regulations refer to13/2018; a bar catalogue lists7/2018 as coming soon. Authenticated Act required.'),
      dict(title='Kadhi Courts2024 rules and appointed commencement notice',reason='Later judicial material refers to2024 rules; full rules and appointed commencement notice not acquired.2021 rules and Act publication alone cannot establish current procedure.'),
      dict(title='Primary Courts Administration of Estates GN49/1971',reason='Focused OSG/catalogue searches did not supply principal instrument.2025 amendment acquired. Commercial/student copies are not substituted or purchased.'),
      dict(title='Zanzibar land/current benefits/utility/environment procedures',reason='Observed official Assembly/Tribunal/ZSSF/ZURA/ZEMA sources encountered transport failures. Search listings identify source candidates, not complete rules; counterpart Gazette environmental Act acquired.'),
      dict(title='Selected inheritance judgments',reason='Two OSG downloads contain summaries only. Full judgments and actual appellate dates still required before using binding reasons.'),
      dict(title='Specialist and local procedure gaps',reason='PF3 operational instructions, current scheme forms, non-Muslim Zanzibar succession, health/immigration complaint procedure, local practice and later treatment require issuing-body/specialist confirmation. The pack does not certify exhaustive legislative coverage.')]))
    md=['# Authoritative source gaps and acquisition record','','Research preparation is complete for this staged bundle; legal coverage remains partial. The following unresolved items must remain visible in topic routing. Public URLs and recorded failures are evidence of the research attempt, not proof that a document or remedy is unavailable. No insecure TLS bypass, paid purchase, provider contact or case submission was used.','']
    for r in load('authoritative-source-gap-register.json')['focusedUnresolvedInstruments']:md += ['## '+r['title'],'',r['reason'],'']
    md += ['## Individual failed acquisitions','','| Source | Recorded outcome | Public source |','|---|---|---|']
    md += [f'| {r["sourceId"]} | {r["observedOutcome"].replace("|","/")} | [Source]({r["url"]}) |' for r in gaps]
    (ROOT/'AUTHORITATIVE-SOURCE-GAPS.md').write_text('\n'.join(md)+'\n')
    paths=load('legal-pathways.json')['pathways']
    save('pathway-approval-workbook.json',dict(status='pending_independent_legal_and_service_review',pathways=[dict(pathwayId=p['id'],title=p['titleEn'],sourceIds=p['sourceIds'],branches=[],requiredBranchFields=['materialFacts','jurisdiction','currentAuthority','exactProvision','forum','mandatoryDocumentsAndAlternatives','formVersion','serviceMethod','deadlineTriggerAndExceptions','feesAndRemission','verifiedServiceId','safeHandoffAndFailureOwner'],legalReviewer=None,languageReviewer=None,serviceOwner=None,approved=False,productionEligible=False) for p in paths]))
    identity=[];licences=[]
    for sid,a in acquired.items():
        if not a.get('pages'):continue
        text=(ROOT/a['textFile']).read_text();parts=re.split(r'\[PDF PAGE (\d+)\]',text)
        identity.append(dict(sourceId=sid,sourceSha256=a['sha256'],coverExcerptUnverified=parts[2][:650] if len(parts)>2 else '',identityStatus='review_required_cover_is_not_full_instrument_review',manualLegalReviewCompleted=False,productionEligible=False))
        for i in range(1,len(parts),2):
            for line in parts[i+1].splitlines():
                if re.search(r'Creative Commons|CC BY|no copyright|All Rights Reserved',line,re.I):
                    licences.append(dict(sourceId=sid,pdfPage=int(parts[i]),observedTextUnverified=line.strip(),permissionDecision='not_approved',storageIndexingTranslationRedistributionSeparatelyReviewed=False,productionEligible=False))
    save('source-identity-triage.json',dict(status='per_document_cover_review_aid_not_authentication',documents=identity))
    save('licence-observations-review.json',dict(status='observed_not_permission_approval',observations=licences))
    print(f'Prepared {len(terms)} terminology drafts and {len(forms)} form-page candidates; {len(gaps)} failed acquisitions individually recorded.')

if __name__=='__main__':main()
