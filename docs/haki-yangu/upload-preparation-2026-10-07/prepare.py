"""Prepare local audit artifacts; never upload or fabricate service facts."""
import csv
import hashlib
import json
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parent.parent.parent
PACK = OUT.parent / 'saada-research-pack-2026-10-05'

def read(name):
    return json.loads((PACK / name).read_text())

def save(name, data):
    (OUT / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')

candidates = read('upload-candidates-review.json')['candidates']
manifest = {r['sourceId']: r for r in read('acquisition-manifest.json')['sources']}
plan = []
for c in candidates:
    acquired = manifest[c['researchSourceId']]
    file = PACK / c['localPDF']
    actual_hash = hashlib.sha256(file.read_bytes()).hexdigest()
    assert actual_hash == c['sha256'], c['researchSourceId']
    size = file.stat().st_size
    chars = acquired.get('extractedCharacters', 0)
    plan.append({**c, 'absolutePDF': str(file), 'byteCount': size,
                 'nativeExtractedCharacters': chars,
                 'withinAppSizeLimit': size <= 15 * 1024 * 1024,
                 'nativeTextPresent': chars > 0,
                 'technicalCandidateOnly': size <= 15 * 1024 * 1024 and chars > 0,
                 'backendDocumentId': None, 'uploadedThisRun': False})
assert len(plan) == 128 and len({r['sha256'] for r in plan}) == 128
save('upload-plan.json', {'checkedOn': '2026-10-07', 'uploadedThisRun': 0,
    'authenticationRequired': True, 'technicalCandidateDoesNotMeanApproved': True,
    'candidates': plan})

code = (ROOT / 'convex/justiceServices.ts').read_text()
fields = {}
audit_rows = []
for block in ['organizationInput', 'serviceInput']:
    text = re.search(r'const ' + block + r' = \{(.*?)\n\};', code, re.S).group(1)
    fields[block] = []
    for line in text.splitlines():
        match = re.match(r'\s*(\w+)(?::\s*(.*?))?,\s*$', line)
        if not match:
            continue
        name, validator = match.groups()
        validator = validator or name
        required = 'v.optional(' not in validator
        fields[block].append(name)
        observations = {
            'name': 'Names available in public research; identity and aliases need review.',
            'organizationName': 'Public names available; links to backend IDs not created.',
            'source': 'Source URLs and locally retained documents available.',
            'phone': 'Some public numbers observed; conflicts and current availability unconfirmed.',
            'physicalLocation': 'Some public addresses observed; registry locations not service coverage.',
            'region': 'Some registry regions observed; current service area unconfirmed.',
            'district': 'Some registry districts observed; current service area unconfirmed.',
            'ward': 'Some Zanzibar registry wards observed; current locations unconfirmed.',
            'verificationStatus': 'Local records remain research drafts; no provider verification performed.',
            'active': 'No service activated by this preparation.',
            'organizationId': 'Requires authenticated creation/linking to actual backend IDs.',
            'country': 'Research concerns Tanzania; individual service scope needs review.',
            'currentIntakeState': 'Unknown. Backend enum has no unknown option; do not invent open/closed.',
            'safeguardingReady': 'Unknown; requires organisation confirmation and governance evidence.',
            'referralAgreementStatus': 'Unknown; no agreement has been obtained or verified.',
        }
        audit_rows.append({'recordType': block, 'field': name, 'required': required,
            'validator': validator, 'evidenceStatus': observations.get(name,
                'Not verified from current research; provider/owner confirmation or reviewer decision required.')})
assert len(fields['organizationInput']) == 11
assert len(fields['serviceInput']) == 40
with (OUT / 'all-app-parameters.csv').open('w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=list(audit_rows[0]))
    writer.writeheader()
    writer.writerows(audit_rows)

earlier = read('structured-data/earlier-provider-and-faq-review.json')
recent = read('provider-candidates-review.json')
registry = (PACK / 'extracted-text/znz-provider-list.txt').read_text()
registry_rows = []
for match in re.finditer(r'(?m)^(\d+)\.\s*\n(.*?)(LAP-\d{4}-\d{4})', registry, re.S):
    number, body, registration = match.groups()
    registry_rows.append({'registryRow': int(number), 'page': 1 if int(number) <= 6 else 2,
        'extractedRecordVerbatim': body.strip() + '\n' + registration,
        'registrationNumberObserved': registration, 'currentRegistrationVerified': False,
        'sourceURL': 'https://zlsc.or.tz/wp-content/uploads/2024/08/Registered-Legal-Aid-Provider-Organizations.pdf',
        'productionEligible': False})
assert len(registry_rows) == 17
save('organisation-research-inventory.json', {
    'preparedOn': '2026-10-07', 'directBackendImport': False,
    'note': 'Overlapping research rows are retained with provenance. Null means unknown. Not a verified provider register.',
    'earlierSources': earlier['sources'], 'earlierOfficeAndProgrammeRows': earlier['offices'],
    'recentPublicCandidateRows': recent['candidates'], 'zanzibarRegistryRows': registry_rows,
    'identityConflicts': [
        'Mkoani District Paralegal Organization appears twice with different registration numbers (rows 9 and 10).',
        'Zanzibar Legal Services Centre may overlap ZLSC candidate; confirm identity and address before merging.',
        'Earlier and recent LHRC, TAWLA and WLAC entries overlap; do not count every row as a distinct organisation.'
    ],
    'organisationFieldTemplateUnknowns': dict.fromkeys(fields['organizationInput']),
    'serviceFieldTemplateUnknowns': dict.fromkeys(fields['serviceInput']),
    'systemManagedFields': ['_id', '_creationTime', 'createdBy', 'lastMaterialEditedBy', 'verifiedBy', 'createdAt', 'updatedAt'],
    'schemaGaps': ['Service email and website are not serviceInput fields.',
        'Fees are not a dedicated serviceInput field.',
        'Unknown intake state and unknown required capability booleans cannot be represented honestly by current validators.']})
save('public-directory-check.json', {
    'checkedAt': '2026-10-07T04:48:13.738Z',
    'scope': 'Configured deployment: public, active, verified and review-current Find Help services only',
    'total': 0, 'draftOrPrivateCount': None,
    'method': 'npm run haki:directory-readiness; successful authenticated-free public query',
    'note': 'This does not establish whether private/draft organisation records exist.'})

report = '''# Upload and organisation readiness — 7 October 2026

No documents have been uploaded in this run. The upload page redirects to the staff/admin sign-in screen. User approval in chat authorizes uploading, but the app still requires authentication and independent document review before retrieval.

## Documents

128 unique PDFs have been checked against their recorded SHA-256 hashes. 123 have native extracted text and fit the app's 15 MiB limit. This is technical screening, not legal approval or confirmation of PDF.js extraction quality. Required publisher, jurisdiction, language, category, version and future review date must be completed honestly before ingestion.

Five original PDFs have no native extracted text: CMA-PROCEDURE, CMA-GUIDELINES, LABOUR-COURT-RULES, EMPLOYMENT-GENERAL-FORMS and ZNZ-EMPLOYMENT. The two CMA files also exceed 15 MiB. Retain originals; prepare and review searchable derivatives before indexing. Machine OCR currently available for CMA is unverified. Readable counterparts for other scans require identity reconciliation.

The acquired Zanzibar Constitution copy is R.E. 2006. Do not label it as the latest edition. Amendment, commencement, applicability and permissions checks remain in the original research pack.

## Organisation information

The inventory retains 13 earlier office/programme rows, seven later public candidate rows, and 17 rows from a Zanzibar registry PDF. These overlap and are not a count of distinct verified organisations. Eight named public leads are TAWLA, LHRC, WLAC, WiLDAF, WoteSawa, KIWOHEDE, ZLSC and TLS. The registry adds paralegal and other organisation leads; its current completeness and registration status are unverified.

Some names, public phone numbers, emails, addresses and registry locations are available. We do not have all operational parameters. Provider confirmation is needed for service coverage, issue categories, eligibility, fees, hours, walk-in/appointment arrangements, remote and phone services, intake state, capacity, languages, disability access, privacy, gender sensitivity and emergency capability. Organisation owners must supply focal contacts, referral agreements, response commitments, safeguarding readiness and data-sharing terms. Independent reviewers must record verifying authority and review dates. Public clinic emails are not automatically authorised referral focal contacts.

The configured backend returned zero public, active, verified and review-current Find Help services at the recorded check time. Private/draft counts remain unknown until staff access is available.

## All app fields

`all-app-parameters.csv` covers all 11 organisation and 40 service input fields directly from `convex/justiceServices.ts`. System-generated audit fields are listed separately in the inventory. Some additional information the app needs, including fees and service email/website, has no dedicated field in the current service input. The intake enum and required capability booleans also lack an explicit unknown state. These gaps require a deliberate data-model decision before importing incomplete research as services.

## Files

- `upload-plan.json`: all 128 absolute file paths, hashes, technical screening and unresolved metadata.
- `organisation-research-inventory.json`: source-preserving public research and registry rows, overlaps, unknown field templates.
- `all-app-parameters.csv`: every organisation/service input field and evidence status.
- `public-directory-check.json`: scope and outcome of the configured backend read.

This folder is a separate preparation supplement. The existing private-review ZIP and its hashes are unchanged by this script. No providers have been contacted, registered, verified or activated by this preparation.
'''
(OUT / 'READINESS.md').write_text(report)
print(json.dumps({'uniquePDFs': len(plan), 'technicalCandidates': sum(r['technicalCandidateOnly'] for r in plan),
    'oversize': sum(not r['withinAppSizeLimit'] for r in plan),
    'noNativeText': sum(not r['nativeTextPresent'] for r in plan),
    'organisationFields': len(fields['organizationInput']), 'serviceFields': len(fields['serviceInput']),
    'registryRows': len(registry_rows), 'uploadedThisRun': 0}))
