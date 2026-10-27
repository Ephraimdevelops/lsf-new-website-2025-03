"""Build source-linked bilingual review drafts, never publish them."""
import csv
import json
import re
from collections import Counter
from pathlib import Path

OUT = Path(__file__).resolve().parent
PACK = OUT.parent / 'saada-research-pack-2026-10-05'
REGISTER = {s['id']: s for s in json.loads((PACK / 'source-register.json').read_text())['sources']}
ACQUIRED = {s['sourceId']: s for s in json.loads((PACK / 'acquisition-manifest.json').read_text())['sources']}
GUIDES = []

CATEGORIES = {
 'employment': ('Work and employment', 'Kazi na ajira'),
 'land_housing': ('Land, renting and housing', 'Ardhi, upangaji na makazi'),
 'family_children': ('Family and children', 'Familia na watoto'),
 'inheritance': ('Inheritance and estates', 'Mirathi na usimamizi wa mali'),
 'consumer_money': ('Consumer problems and money', 'Matatizo ya walaji na fedha'),
 'safety_criminal': ('Safety, violence and criminal justice', 'Usalama, ukatili na haki katika mashauri ya jinai'),
 'documents_services': ('Documents and public services', 'Nyaraka na huduma za umma'),
 'access_justice': ('Getting legal help and using justice pathways', 'Kupata msaada wa kisheria na kufuata njia za haki'),
 'zanzibar': ('Zanzibar-specific pathways', 'Njia za haki zinazohusu Zanzibar'),
}

WEB = {
 'WEB-LHRC-DEMAND': ('LHRC 2024 Legal Aid Report announcement', 'https://lhrc.humanrights.or.tz/sw/news-events/LHRC_2024_LEGAL_AID', 'Legal and Human Rights Centre', 'Search result and publisher page content', 'Land 58%, family 14%, labour 10% of reported LHRC cases; provider-specific demand, not national ranking.'),
 'WEB-CMA': ('CMA frequently asked questions', 'https://cma.go.tz/faqs', 'Commission for Mediation and Arbitration', 'Search result; direct open timed out', 'Published termination referral question mentions CMA F.1 and 30 days; draft does not generalise that period to all disputes.'),
 'WEB-RITA-FAQ': ('RITA frequently asked questions', 'https://www.rita.go.tz/faq.php?lang=en', 'Registration, Insolvency and Trusteeship Agency', 'Publisher page content via search', 'Late registration, replacement certificates, corrections and name changes; fee amounts conflict with newer portal.'),
 'WEB-RITA-PORTAL': ('eRITA official portal', 'https://erita.rita.go.tz/', 'Registration, Insolvency and Trusteeship Agency', 'Publisher portal content via search', 'Portal shows different replacement/correction fees from old FAQ; exact prices intentionally omitted.'),
 'WEB-RITA-SERVICES': ('RITA online services', 'https://rita.go.tz/erita.php?lang=en', 'Registration, Insolvency and Trusteeship Agency', 'Publisher page content via search', 'Birth, death, marriage and divorce online service categories.'),
 'WEB-BOT': ('Bank of Tanzania financial consumer protection', 'https://www.bot.go.tz/DFDI/ConsumerProtection?lang=en', 'Bank of Tanzania', 'Publisher page content via search', 'Internal provider complaint precedes escalation. Reconcile current regulations/guidelines before quoting precise time limits.'),
 'WEB-BOT-2025': ('Guidelines for Handling Financial Consumer Complaints, 2025', 'https://www.bot.go.tz/Publications/Acts%2C%20Regulations%2C%20Circulars%2C%20Guidelines/Guidelines/sw/2025111212295369.pdf', 'Bank of Tanzania', 'Publisher search result', 'Newer complaint guidance exists; check alongside 2019 rules and amendments.'),
 'WEB-TCRA': ('TCRA consumer complaint information', 'https://www.tcra.go.tz/sw/resources/complaints', 'Tanzania Communications Regulatory Authority', 'Publisher search result', 'Consumer complaint information; do not treat every mobile-money issue as telecom-only.'),
 'WEB-EWURA-WATER': ('Water complaints and resolution', 'https://ewura.go.tz/index.php/pages/water-complaints-and-resolution', 'Energy and Water Utilities Regulatory Authority', 'Publisher page content via search', 'Regulated water-service complaints; limitation period depends on type.'),
 'WEB-EWURA-POWER': ('Electricity complaints and dispute resolution', 'https://www.ewura.go.tz/index.php/pages/electricity-complaints-and-dispute-resolution', 'Energy and Water Utilities Regulatory Authority', 'Publisher page content via search', 'Electricity complaint portal and regulator route.'),
 'WEB-TAWLA': ('TAWLA legal aid services', 'https://www.tawla.or.tz/portfolio/legal-aid-services/', 'Tanzania Women Lawyers Association', 'Publisher page content via search', 'Women/children legal aid; family, succession, land and voluntary mediation service leads, not confirmed intake.'),
 'WEB-CHRAGG': ('CHRAGG complaint page', 'https://www.chragg.go.tz/index.php/complaints', 'Commission for Human Rights and Good Governance', 'Publisher search result', 'Official complaint page; mandate and admissibility must be checked case by case.'),
 'WEB-NIDA': ('NIDA online services', 'https://services.nida.go.tz/', 'National Identification Authority', 'Publisher search result', 'Official portal lead; precise replacement requirements not acquired.'),
 'WEB-ZCSRA': ('Zanzibar civil status online registration', 'https://ecrvs.zcsra.go.tz/', 'Zanzibar Civil Status Registration Agency', 'Publisher page content via search', 'Birth/death registration, including late-registration service categories.'),
 'WEB-ZLSC': ('ZLSC legal aid and legislation information', 'https://zlsc.or.tz/aid/', 'Zanzibar Legal Services Centre', 'Publisher page content via search', 'English/Swahili Legal Aid Act numbers differ on catalogue; do not infer correct Act number from label.'),
 'WEB-ZLS': ('Zanzibar Law Society public information', 'https://zls.or.tz/', 'Zanzibar Law Society', 'Publisher search result', 'Public legal aid/access to justice, family/succession and land assistance leads.'),
 'WEB-ZNZ-LAND': ('Zanzibar Land Tribunal official information', 'https://landtribunalsmz.go.tz/', 'Land Tribunal Zanzibar', 'Publisher page content via search', 'Tribunal establishment statement; www hostname returned directory listing in search, so current access needs confirmation.'),
 'WEB-PCCB': ('Tanzania submission on public participation and corruption reporting', 'https://www.unodc.org/documents/corruption/WG-Prevention/Art_13_Participation_of_society/Tanzania.pdf', 'United Nations Office on Drugs and Crime / Tanzania submission', 'Official submission search result', 'PCCB reporting mechanisms described; not proof of current hotline or emergency response.'),
}

def source(source_id, keywords):
    if source_id in WEB:
        title, url, publisher, observation, note = WEB[source_id]
        return {'id': source_id, 'title': title, 'url': url, 'publisher': publisher,
                'checkedOn': '2026-10-07', 'observation': observation, 'caution': note,
                'pageCandidates': [], 'sourcePassageManuallyVerified': False}
    r = REGISTER[source_id]
    a = ACQUIRED.get(source_id, {})
    text_file = a.get('textFile')
    locators = []
    if text_file:
        text = (PACK / text_file).read_text()
        for m in re.finditer(r'\[PDF PAGE (\d+)\](.*?)(?=\[PDF PAGE |\Z)', text, re.S):
            hits = [k for k in keywords if k.lower() in m.group(2).lower()]
            if hits:
                locators.append({'pdfPage': int(m.group(1)), 'matchedKeywords': hits})
        locators.sort(key=lambda x: (-len(x['matchedKeywords']), x['pdfPage']))
    publisher = 'Revolutionary Government of Zanzibar' if source_id.startswith('ZNZ-') else 'United Republic of Tanzania'
    return {'id': source_id, 'title': r['title'], 'url': r.get('recordUrl') or r.get('downloadUrl'),
            'publisher': publisher, 'localText': str(PACK / text_file) if text_file else None,
            'localPDF': str(PACK / a['file']) if a.get('file') else None,
            'sha256': a.get('sha256'), 'acquisitionStatus': a.get('status'),
            'versionObserved': r.get('versionLabel'), 'checkedOn': '2026-10-07',
            'pageCandidates': locators[:5], 'sourcePassageManuallyVerified': False,
            'caution': 'Keyword locators are review aids, not verified sections. Reconcile amendments, commencement and applicability.'}

def add(category, en, sw, answer_en, answer_sw, documents_en, documents_sw,
        action_en, action_sw, route_en, route_sw, ids, keywords, concern='', safety=False):
    primary, *support = [source(i, keywords) for i in ids.split(',')]
    jurisdiction = 'zanzibar' if category == 'zanzibar' else 'tanzania_mainland'
    n = sum(g['categoryKey'] == category for g in GUIDES) + 1
    follow_en = 'Keep a copy and reference number for every submission. Confirm the applicable deadline, official fee and next appointment; internal discussions do not automatically extend a filing deadline.'
    follow_sw = 'Hifadhi nakala na namba ya kumbukumbu ya kila ombi. Thibitisha muda wa kuwasilisha, ada rasmi na tarehe inayofuata; mazungumzo ya ndani hayaongezi moja kwa moja muda wa kufungua shauri.'
    if safety:
        follow_en = 'Use a safe contact method and share sensitive details only with the responsible professional. Do not wait for an app reply if there is immediate danger; seek in-person emergency help where safely possible.'
        follow_sw = 'Tumia njia salama ya mawasiliano na toa taarifa nyeti kwa mtaalamu anayehusika tu. Usisubiri jibu la programu ukiwa katika hatari ya haraka; tafuta msaada wa dharura ana kwa ana ikiwa ni salama kufanya hivyo.'
    fields = {'titleEn': en, 'titleSw': sw, 'summaryEn': answer_en, 'summarySw': answer_sw,
        'stepsEn': [documents_en, action_en, route_en, follow_en],
        'stepsSw': [documents_sw, action_sw, route_sw, follow_sw],
        'category': CATEGORIES[category][0], 'jurisdiction': jurisdiction,
        'sourceTitle': primary['title'], 'sourceUrl': primary['url'], 'publisher': primary['publisher']}
    GUIDES.append({'id': f'KYR-{category.upper()}-{n:02}', 'categoryKey': category,
        'priority': 'first_review_wave' if n <= 4 and category in ['employment','land_housing','family_children','safety_criminal','access_justice'] else 'second_review_wave',
        'appFieldsDraft': fields, 'reviewDueAt': None, 'legalReviewer': None,
        'approvalStatus': 'not_submitted', 'productionEligible': False, 'backendGuideId': None,
        'primarySource': primary, 'supportingSources': support,
        'publicationBlockers': ['Independent legal review', 'Kiswahili language review', 'Current source and amendment reconciliation',
            'Review date must be assigned', 'Confirm local institution and practical procedure'] + ([concern] if concern else []),
        'safetySensitive': safety, 'exactDeadline': None, 'exactFee': None,
        'scopeNote': 'Mainland guidance must not be applied automatically in Zanzibar.' if jurisdiction == 'tanzania_mainland' else 'Zanzibar-specific route; Mainland forms and forums are not substitutes.',
        'frequencyClaim': 'Editorial selection informed by legal-aid demand and official FAQs; no question-level national popularity rank claimed.'})

# Per-question actions are original drafts. They do not promise entitlement, admission or case success.
add('employment', 'I was dismissed from work. What should I do first?', 'Nimefukuzwa kazi. Nianzie wapi?',
    'Act promptly. A dismissal complaint has its own referral time limit; gather the dismissal facts and check the correct labour route before waiting for negotiations.', 'Chukua hatua mapema. Malalamiko ya kufukuzwa yana muda wake wa kuwasilishwa; kusanya taarifa na thibitisha njia ya kushughulikia mgogoro kabla ya kusubiri mazungumzo.',
    'Save the dismissal letter, contract, payslips, messages and dates of notification and last work.', 'Hifadhi barua ya kufukuzwa, mkataba, hati za malipo, ujumbe na tarehe za taarifa na siku ya mwisho kazini.',
    'Write a short timeline and identify whether you challenge the reason, procedure, unpaid benefits or all three.', 'Andika mfuatano mfupi wa matukio na eleza kama unapinga sababu, utaratibu, mafao ambayo hayajalipwa au yote.',
    'Contact CMA or a labour legal-aid adviser promptly about referral, the prescribed form and any late-filing application.', 'Wasiliana mapema na CMA au mtoa msaada wa sheria za kazi kuhusu kuwasilisha mgogoro, fomu na ombi la kuchelewa ikiwa linahitajika.',
    'BASE-ELRA,EMPLOYMENT-AMENDMENTS-2025,WEB-CMA,CMA-PROCEDURE', ['termination','unfair','referral'], 'Confirm current 30-day termination rule, trigger date, exclusions and condonation before publishing any number.')
add('employment', 'My employer has not paid my wages. How can I claim them?', 'Mwajiri hajanilipa mshahara. Naudai vipi?',
    'Prepare an itemised wage claim and distinguish agreed pay from disputed deductions. The appropriate labour route depends on the employment relationship.', 'Andaa madai ya mshahara kwa kila kipindi na tenganisha malipo yaliyokubaliwa na makato yanayopingwa. Njia ya madai hutegemea uhusiano wa ajira.',
    'List each unpaid period, amount, hours worked and payments already received; keep attendance and payment records.', 'Orodhesha kila kipindi kisicholipwa, kiasi, saa ulizofanya kazi na malipo yaliyopokelewa; hifadhi kumbukumbu za kazi na malipo.',
    'If safe, request payment and an explanation of deductions in writing; keep the response.', 'Ikiwa ni salama, omba malipo na maelezo ya makato kwa maandishi; hifadhi jibu.',
    'Ask a labour officer, CMA or a legal-aid adviser to identify the applicable wage-enforcement route and filing time.', 'Muulize afisa kazi, CMA au mtoa msaada wa kisheria kuhusu njia sahihi ya kudai mshahara na muda wa kuwasilisha.',
    'BASE-ELRA,EMPLOYMENT-INSTITUTIONS,WEB-CMA', ['remuneration','deduction','wages'])
add('employment', 'I work without a written contract. Can I still seek help?', 'Nafanya kazi bila mkataba wa maandishi. Naweza kupata msaada?',
    'Lack of a written contract does not settle whether an employment relationship exists. Evidence of how the work was organised is important.', 'Kutokuwa na mkataba wa maandishi hakuamui peke yake kama kuna uhusiano wa ajira. Ushahidi wa namna kazi ilivyopangwa ni muhimu.',
    'Collect work messages, rosters, payment records, supervisor details and witnesses.', 'Kusanya ujumbe wa kazi, ratiba, kumbukumbu za malipo, taarifa za msimamizi na mashahidi.',
    'Record who set your hours, supplied tools, supervised you and paid you; request written employment particulars if safe.', 'Andika nani alipanga saa, alitoa vifaa, alikusimamia na kukulipa; omba taarifa za ajira kwa maandishi ikiwa ni salama.',
    'Ask a labour adviser to assess employee status and the correct complaint route; do not assume a casual or contractor label decides it.', 'Omba mshauri wa sheria za kazi achunguze hadhi yako na njia ya malalamiko; usidhani jina la kibarua au mkandarasi linaamua suala lote.',
    'BASE-ELRA,EMPLOYMENT-GENERAL-FORMS', ['written','particulars','employee'], 'General-regulations original is scanned; readable counterpart must be reconciled.')
add('employment', 'I am pregnant and facing dismissal or refusal of leave. What can I do?', 'Nina ujauzito na natishiwa kufukuzwa au kunyimwa likizo. Nifanye nini?',
    'Pregnancy-related treatment and maternity entitlements require prompt assessment of the facts and applicable employment rules.', 'Matendo yanayohusiana na ujauzito na haki za likizo ya uzazi yanahitaji uchunguzi wa haraka wa mazingira na sheria za ajira zinazotumika.',
    'Keep leave requests, the employer response, relevant medical confirmation and any dismissal or disciplinary notice.', 'Hifadhi maombi ya likizo, jibu la mwajiri, uthibitisho wa kitabibu unaohusika na taarifa ya kufukuzwa au nidhamu.',
    'Ask for the decision and reason in writing; disclose medical details only as necessary and through a safe channel.', 'Omba uamuzi na sababu kwa maandishi; toa taarifa za afya zinazohitajika tu kupitia njia salama.',
    'Seek labour legal aid promptly to check discrimination, maternity leave and any dismissal-referral deadline.', 'Tafuta msaada wa sheria za kazi mapema kuhusu ubaguzi, likizo ya uzazi na muda wa kuwasilisha mgogoro wa kufukuzwa.',
    'BASE-ELRA,EMPLOYMENT-AMENDMENTS-2025', ['maternity','pregnancy','discrimination'], 'Reconcile 2025 maternity-related amendments before quoting leave duration.')
add('employment', 'I was injured at work. Where do I seek compensation?', 'Nimeumia kazini. Naomba fidia wapi?',
    'Get medical care and document the work connection. Workplace injury compensation is a distinct process from an ordinary dismissal complaint.', 'Pata matibabu na rekodi uhusiano wa tukio na kazi. Fidia ya kuumia kazini ina utaratibu tofauti na malalamiko ya kufukuzwa.',
    'Keep medical reports, incident details, witness contacts, employer information and expenses.', 'Hifadhi ripoti za afya, taarifa za tukio, mawasiliano ya mashahidi, taarifa za mwajiri na gharama.',
    'Report the incident to the employer promptly and ask for the official injury-report reference; avoid signing an unexplained final settlement.', 'Toa taarifa kwa mwajiri mapema na omba kumbukumbu ya taarifa rasmi ya ajali; epuka kusaini makubaliano ya mwisho usiyoyaelewa.',
    'Check Workers Compensation Fund requirements and applicable coverage with WCF or a legal-aid adviser.', 'Thibitisha mahitaji na kama tukio linahusika chini ya Mfuko wa Fidia kwa Wafanyakazi kupitia WCF au mtoa msaada wa kisheria.',
    'WORKERS-COMPENSATION,WCF-REGULATIONS-2016,WCF-AMENDMENT-2021', ['injury','notice','compensation'])
add('employment', 'My employer deducts pension contributions but they are missing. What next?', 'Mwajiri anakata michango ya pensheni lakini haionekani. Nifanye nini?',
    'Compare payroll deductions with the fund statement and report the missing periods. A deduction alone does not confirm remittance.', 'Linganisha makato ya mshahara na taarifa ya mfuko na toa malalamiko kuhusu vipindi vinavyokosekana. Makato pekee hayathibitishi michango kuwasilishwa.',
    'Save payslips, membership number, fund statements and the employer name for each missing month.', 'Hifadhi hati za malipo, namba ya uanachama, taarifa za mfuko na jina la mwajiri kwa kila mwezi unaokosekana.',
    'Request a contribution reconciliation from the employer and relevant fund; keep both responses.', 'Omba mwajiri na mfuko husika walinganishe michango; hifadhi majibu yote.',
    'Use the relevant NSSF or PSSSF complaint route and seek legal help if deductions remain unexplained.', 'Tumia njia ya malalamiko ya NSSF au PSSSF inayohusika na tafuta msaada wa kisheria ikiwa makato hayajaelezwa.',
    'SOCIAL-NSSF,SOCIAL-PSSSF-2025,SOCIAL-NSSF-COMPLAINT-FORM', ['contribution','employer','complaint'])
add('employment', 'My employer refuses overtime or rest days. How do I check my rights?', 'Mwajiri anakataa malipo ya ziada au siku za mapumziko. Nachunguza haki zangu vipi?',
    'Hours, overtime and rest rules depend on the applicable employment provisions and any valid agreement. Prepare actual hours rather than estimates.', 'Saa za kazi, kazi ya ziada na mapumziko hutegemea masharti ya ajira na makubaliano halali. Andaa saa ulizofanya kazi badala ya makadirio.',
    'Keep daily start/finish times, rosters, overtime instructions, contract and payslips.', 'Hifadhi saa za kuanza na kumaliza kila siku, ratiba, maagizo ya kazi ya ziada, mkataba na hati za malipo.',
    'Compare the records with what was paid and ask for the employer calculation in writing.', 'Linganisha kumbukumbu na malipo na omba hesabu ya mwajiri kwa maandishi.',
    'Ask a labour adviser about coverage, permitted exceptions and the wage or hours complaint route.', 'Muulize mshauri wa sheria za kazi kuhusu masharti yanayokuhusu, tofauti zinazoruhusiwa na njia ya malalamiko ya saa au malipo.',
    'BASE-ELRA,EMPLOYMENT-INSTITUTIONS', ['overtime','hours','rest'], 'Do not quote a universal rate without checking sector and current rules.')
add('employment', 'I am being sexually harassed or discriminated against at work. Where do I report?', 'Ninanyanyaswa kingono au kubaguliwa kazini. Nitoe taarifa wapi?',
    'Choose a safe reporting channel. Workplace misconduct, employment discrimination and a possible criminal offence may require different parallel responses.', 'Chagua njia salama ya taarifa. Makosa kazini, ubaguzi wa ajira na kosa linaloweza kuwa la jinai vinaweza kuhitaji hatua tofauti zinazokwenda pamoja.',
    'Preserve messages and a private incident timeline; record witnesses without putting yourself at further risk.', 'Hifadhi ujumbe na mfuatano wa matukio kwa siri; andika mashahidi bila kujiweka katika hatari zaidi.',
    'Use an employer grievance channel only if safe; request protection from retaliation and confidential handling.', 'Tumia njia ya malalamiko ya mwajiri ikiwa ni salama; omba kulindwa dhidi ya kulipiziwa kisasi na taarifa kushughulikiwa kwa siri.',
    'Seek labour legal aid; where violence or a suspected offence is involved, also seek appropriate police or medical assistance.', 'Tafuta msaada wa sheria za kazi; ikiwa kuna ukatili au kosa linaloshukiwa, tafuta pia msaada unaofaa wa polisi au afya.',
    'BASE-ELRA,CRIM-PENAL,SAFE-HOMES', ['harassment','discrimination','sexual'], safety=True)

add('land_housing', 'My neighbour has moved the boundary or occupied my land. What should I do?', 'Jirani amehamisha mpaka au ameingia kwenye ardhi yangu. Nifanye nini?',
    'Preserve boundary and ownership evidence and avoid a physical confrontation. The proper land forum depends on the location, tenure and dispute.', 'Hifadhi ushahidi wa mpaka na umiliki na epuka mapambano. Chombo sahihi hutegemea eneo, aina ya umiliki na mgogoro.',
    'Gather title or occupancy documents, survey plans, purchase records, safe photographs and witness details.', 'Kusanya hati za ardhi, ramani za upimaji, kumbukumbu za ununuzi, picha zilizopigwa kwa usalama na mashahidi.',
    'Ask the relevant land office to check the recorded boundary; do not remove structures or markers yourself.', 'Omba ofisi husika ya ardhi ichunguze mpaka uliorekodiwa; usiondoe majengo au alama mwenyewe.',
    'Ask legal aid to identify the competent land mediation, tribunal or court route and any urgent protective application.', 'Omba msaada wa kisheria utambue njia sahihi ya usuluhishi, baraza au mahakama na ombi la haraka la kulinda haki ikiwa linahitajika.',
    'BASE-LAND,BASE-VILLAGE-LAND,LAND-DISPUTES', ['boundary','jurisdiction','dispute'])
add('land_housing', 'I want to buy a plot. What should I check before paying?', 'Nataka kununua kiwanja. Nikague nini kabla ya kulipa?',
    'Verify the seller authority and land records before paying. A receipt or local introduction alone is not a substitute for land due diligence.', 'Thibitisha mamlaka ya muuzaji na kumbukumbu za ardhi kabla ya kulipa. Risiti au utambulisho wa eneo pekee hauchukui nafasi ya ukaguzi wa ardhi.',
    'Obtain copies of land documents, seller identification, survey details and any proposed sale agreement.', 'Pata nakala za nyaraka za ardhi, utambulisho wa muuzaji, taarifa za upimaji na mkataba unaopendekezwa.',
    'Check the record with the responsible land registry or village authority and investigate occupation, disputes and required consents.', 'Kagua kumbukumbu kwa masjala husika au mamlaka ya kijiji na chunguza wanaotumia ardhi, migogoro na ridhaa zinazohitajika.',
    'Have an independent legal adviser check transfer requirements and any spouse, estate or joint-owner authority before committing money.', 'Omba mshauri huru akague utaratibu wa uhamisho na mamlaka ya mwenzi, msimamizi wa mirathi au mmiliki wa pamoja kabla ya kutoa fedha.',
    'BASE-LAND,BASE-VILLAGE-LAND,CONTRACT-ACT', ['transfer','disposition','consent'])
add('land_housing', 'Can a woman own or inherit land?', 'Mwanamke anaweza kumiliki au kurithi ardhi?',
    'Do not accept an exclusion simply because of gender. Ownership and inheritance require review of the land documents and applicable succession law.', 'Usikubali kutengwa kwa sababu ya jinsia pekee. Umiliki na urithi vinahitaji ukaguzi wa nyaraka za ardhi na sheria ya mirathi inayotumika.',
    'Collect occupancy or title records, marriage and family information, death records where relevant and the stated reason for exclusion.', 'Kusanya nyaraka za ardhi, taarifa za ndoa na familia, kumbukumbu za kifo inapohusika na sababu iliyotolewa ya kukutenga.',
    'Record any threats or attempted sale and seek advice before signing a surrender or family settlement.', 'Andika vitisho au jaribio la kuuza na pata ushauri kabla ya kusaini kuachia haki au makubaliano ya familia.',
    'Seek women-focused legal aid for the appropriate land or succession claim; do not assume every inheritance system uses identical shares.', 'Tafuta msaada wa kisheria unaohusu wanawake kuhusu madai ya ardhi au mirathi; usidhani mifumo yote ya urithi ina mgao sawa.',
    'BASE-LAND,BASE-VILLAGE-LAND,ESTATES-PROBATE,WEB-TAWLA', ['women','equal','inheritance'])
add('land_housing', 'My landlord is threatening to remove me immediately. What can I do?', 'Mwenye nyumba anatishia kuniondoa mara moja. Nifanye nini?',
    'An eviction dispute needs prompt review of the tenancy, notices and applicable law. Do not assume a universal notice period.', 'Mgogoro wa kuondolewa kwenye nyumba unahitaji ukaguzi wa haraka wa upangaji, taarifa na sheria husika. Usidhani kuna muda mmoja wa taarifa kwa kila hali.',
    'Save the tenancy agreement, rent receipts, deposit proof, messages and eviction notice.', 'Hifadhi mkataba wa upangaji, risiti za kodi, uthibitisho wa amana, ujumbe na taarifa ya kuondolewa.',
    'Request the reason and proposed date in writing; document threats or lock changes safely.', 'Omba sababu na tarehe inayopendekezwa kwa maandishi; rekodi vitisho au kubadilishwa kufuli kwa usalama.',
    'Seek urgent legal aid about the competent tenancy/land forum and interim protection; seek safety help if violence is threatened.', 'Tafuta msaada wa kisheria wa haraka kuhusu chombo cha upangaji au ardhi na kinga ya muda; tafuta msaada wa usalama ikiwa unatishiwa ukatili.',
    'BASE-LAND,CONTRACT-ACT,LAND-DISPUTES', ['lease','notice','termination'], 'Review applicable rent legislation and forum before finalising; source pack is not complete on tenancy.')
add('land_housing', 'My landlord will not return my deposit or my belongings. What next?', 'Mwenye nyumba harudishi amana au vitu vyangu. Nifanye nini?',
    'Separate the deposit dispute from any urgent access or safety issue. Your agreement and payment evidence help identify the remedy.', 'Tenganisha mgogoro wa amana na tatizo la haraka la kupata vitu au usalama. Mkataba na ushahidi wa malipo husaidia kutambua suluhisho.',
    'List the amount paid, deductions claimed, condition photographs and belongings withheld.', 'Orodhesha kiasi kilicholipwa, makato yanayodaiwa, picha za hali ya nyumba na vitu vilivyoshikiliwa.',
    'If safe, send a written request for an itemised deduction account and return of the balance or property.', 'Ikiwa ni salama, tuma ombi la maandishi la hesabu ya makato na kurudishwa fedha au vitu.',
    'Ask legal aid to determine the proper contract or tenancy forum; do not force entry or seize the landlord property.', 'Omba msaada wa kisheria utambue chombo sahihi cha mkataba au upangaji; usivunje mlango au kukamata mali ya mwenye nyumba.',
    'CONTRACT-ACT,BASE-LAND,PROC-CIVIL', ['agreement','lease','damages'], 'Review rent-law coverage and claim jurisdiction.')
add('land_housing', 'Village leaders allocated my land to someone else. How do I challenge it?', 'Viongozi wa kijiji wamempa mwingine ardhi yangu. Napinga vipi?',
    'Obtain the allocation decision and village land records. Identify whether the issue is allocation, boundaries, transfer or ownership.', 'Pata uamuzi wa ugawaji na kumbukumbu za ardhi ya kijiji. Tambua kama tatizo ni ugawaji, mipaka, uhamisho au umiliki.',
    'Keep village certificates, meeting records, occupation evidence, witnesses and dates of the decision.', 'Hifadhi vyeti vya kijiji, kumbukumbu za mikutano, ushahidi wa matumizi ya ardhi, mashahidi na tarehe ya uamuzi.',
    'Request written reasons and a copy of the relevant land record; avoid surrendering original documents.', 'Omba sababu kwa maandishi na nakala ya kumbukumbu husika ya ardhi; epuka kutoa nyaraka asili bila utaratibu.',
    'Ask a land legal-aid adviser about the competent challenge route and any order needed to prevent a transfer while the dispute is heard.', 'Muulize mshauri wa ardhi kuhusu njia sahihi ya kupinga na amri inayoweza kuhitajika kuzuia uhamisho wakati mgogoro unasikilizwa.',
    'BASE-VILLAGE-LAND,LAND-DISPUTES', ['allocation','village council','dispute'])
add('land_housing', 'My land is being acquired for a public project. How do I question compensation?', 'Ardhi yangu inachukuliwa kwa mradi wa umma. Napinga fidia vipi?',
    'Obtain the acquisition notice and valuation details promptly. Entitlement and valuation depend on the acquisition facts and applicable law.', 'Pata taarifa ya uchukuaji na tathmini mapema. Haki na tathmini hutegemea mazingira ya uchukuaji na sheria husika.',
    'Preserve notices, title or occupancy evidence, valuation schedules, property photographs and payment offers.', 'Hifadhi taarifa, ushahidi wa umiliki au matumizi, orodha za tathmini, picha za mali na ofa za malipo.',
    'Request the valuation basis, objection procedure and deadline in writing before accepting a final settlement.', 'Omba msingi wa tathmini, utaratibu wa pingamizi na muda kwa maandishi kabla ya kukubali makubaliano ya mwisho.',
    'Seek legal advice about the acquisition authority, compensation challenge and any urgent filing requirement.', 'Pata ushauri kuhusu mamlaka ya uchukuaji, kupinga fidia na hitaji lolote la haraka la kufungua shauri.',
    'LAND-ACQUISITION,BASE-LAND,PROC-LIMITATION', ['compensation','notice','acquisition'])
add('land_housing', 'Someone sold the same plot to two buyers. Where do we start?', 'Mtu ameuzia watu wawili kiwanja kimoja. Tunaanzia wapi?',
    'Verify the land record and each seller transaction. A suspected fraud report does not by itself resolve competing ownership claims.', 'Thibitisha kumbukumbu za ardhi na kila mauzo ya muuzaji. Taarifa ya udanganyifu unaoshukiwa haiamui peke yake madai yanayoshindana ya umiliki.',
    'Collect sale agreements, receipts, transfer documents, advertisements and the seller contact details.', 'Kusanya mikataba ya mauzo, risiti, nyaraka za uhamisho, matangazo na mawasiliano ya muuzaji.',
    'Ask the land office to check the registered position and seek advice before making further payments or changes on the plot.', 'Omba ofisi ya ardhi ichunguze hali ya usajili na pata ushauri kabla ya malipo mengine au mabadiliko kiwanjani.',
    'Seek land legal aid for ownership and recovery claims; report suspected criminal fraud separately where appropriate.', 'Tafuta msaada wa sheria za ardhi kuhusu umiliki na kurejesha fedha; toa taarifa tofauti ya udanganyifu wa jinai unaoshukiwa inapofaa.',
    'BASE-LAND,CONTRACT-ACT,CRIM-PENAL', ['transfer','fraud','contract'])

add('family_children', 'The other parent is not supporting our child. What can I do?', 'Mzazi mwenzangu hamhudumii mtoto. Nifanye nini?',
    'A child-support request should focus on the child needs, parentage and each parent circumstances. Do not make contact with the child conditional on informal payment demands.', 'Ombi la matunzo lilenge mahitaji ya mtoto, uzazi na mazingira ya wazazi. Usiweke mawasiliano na mtoto kuwa sharti la malipo yasiyo rasmi.',
    'Prepare the birth record, school/medical expenses, existing orders and payment history.', 'Andaa kumbukumbu ya kuzaliwa, gharama za shule na afya, amri zilizopo na historia ya malipo.',
    'Write a realistic monthly needs list and record support already received; keep communication safe.', 'Andika mahitaji ya mwezi kwa uhalisia na msaada uliopokea; tumia mawasiliano salama.',
    'Ask social welfare or family legal aid about a maintenance application or enforcement of an existing order.', 'Uliza ustawi wa jamii au mtoa msaada wa sheria za familia kuhusu ombi la matunzo au utekelezaji wa amri iliyopo.',
    'BASE-CHILD,BASE-MARRIAGE,WEB-TAWLA', ['maintenance','parentage','child'])
add('family_children', 'We are separating. How is child custody decided?', 'Tunatengana. Malezi ya mtoto yanaamuliwaje?',
    'Custody arrangements require assessment of the child welfare and circumstances. Neither parent should assume an automatic outcome.', 'Mpango wa malezi unahitaji kuzingatia maslahi na mazingira ya mtoto. Mzazi yeyote asidhani matokeo ni ya moja kwa moja.',
    'Gather birth details, existing orders, living arrangements, school information and any safety concerns.', 'Kusanya taarifa za kuzaliwa, amri zilizopo, makazi, taarifa za shule na hatari za usalama.',
    'Propose practical care and contact arrangements that protect the child; avoid coaching or pressuring the child.', 'Pendekeza mpango wa malezi na mawasiliano unaomlinda mtoto; epuka kumfundisha majibu au kumshinikiza.',
    'Seek family legal aid or social welfare help to identify the court route and any urgent protection required.', 'Tafuta msaada wa sheria za familia au ustawi wa jamii kuhusu mahakama sahihi na kinga ya haraka inapohitajika.',
    'BASE-CHILD,BASE-MARRIAGE', ['custody','welfare','access'])
add('family_children', 'I want to separate or divorce. What is the first legal step?', 'Nataka kutengana au kuachana. Hatua ya kwanza ya kisheria ni ipi?',
    'Check the applicable marriage law and required process before filing. Violence or other exceptions may affect reconciliation requirements.', 'Thibitisha sheria ya ndoa na utaratibu unaohitajika kabla ya kufungua shauri. Ukatili au hali nyingine maalumu zinaweza kuathiri masharti ya usuluhishi.',
    'Keep the marriage evidence, separation timeline, children details and relevant safety records.', 'Hifadhi ushahidi wa ndoa, mfuatano wa kutengana, taarifa za watoto na kumbukumbu za usalama.',
    'List the issues needing decisions: divorce, children, support, property and immediate protection.', 'Orodhesha mambo yanayohitaji uamuzi: talaka, watoto, matunzo, mali na kinga ya haraka.',
    'Ask a family legal-aid adviser about the competent court and any reconciliation certificate or applicable exception.', 'Muulize mshauri wa familia kuhusu mahakama sahihi na cheti cha usuluhishi au hali inayoruhusu kutotumia utaratibu huo.',
    'BASE-MARRIAGE,WEB-TAWLA', ['divorce','conciliation','petition'], 'Verify marriage duration and statutory exceptions; do not require unsafe mediation.')
add('family_children', 'My spouse wants to sell our home without consulting me. What can I do?', 'Mwenzi anataka kuuza nyumba yetu bila kunishirikisha. Nifanye nini?',
    'Seek advice before a threatened sale is completed. Occupation, ownership, consent and matrimonial-property rules need separate assessment.', 'Pata ushauri kabla ya mauzo yanayotishiwa kukamilika. Makazi, umiliki, ridhaa na masharti ya mali ya ndoa vinahitaji kuchunguzwa tofauti.',
    'Gather marriage evidence, title records, purchase details, contribution records and sale messages.', 'Kusanya ushahidi wa ndoa, hati za umiliki, ununuzi, mchango wako na ujumbe wa mauzo.',
    'Record the proposed sale date and avoid signing consents or transfers you do not understand.', 'Andika tarehe ya mauzo inayopendekezwa na epuka kusaini ridhaa au uhamisho usiouelewa.',
    'Seek urgent family/land legal aid about spouse rights and whether a lawful protective application is available.', 'Tafuta msaada wa haraka wa sheria za familia na ardhi kuhusu haki za mwenzi na ombi halali la kinga linaloweza kuwepo.',
    'BASE-MARRIAGE,BASE-LAND', ['matrimonial','consent','home'])
add('family_children', 'We lived together without a marriage certificate. Do I have any rights?', 'Tumeishi pamoja bila cheti cha ndoa. Nina haki zozote?',
    'Cohabitation does not have one automatic legal outcome. Duration, how the relationship was presented and applicable legal presumptions require review.', 'Kuishi pamoja hakutoi matokeo moja ya kisheria moja kwa moja. Muda, jinsi uhusiano ulivyojulikana na dhana za kisheria zinazohusika zinahitaji ukaguzi.',
    'Gather evidence of shared residence, public recognition, children, property and contributions.', 'Kusanya ushahidi wa makazi ya pamoja, kutambulika kwa uhusiano, watoto, mali na michango.',
    'Describe the actual help needed: child support, housing, property or recognition of the relationship.', 'Eleza msaada unaohitaji: matunzo ya mtoto, makazi, mali au kutambuliwa kwa uhusiano.',
    'Ask a family legal adviser about any marriage presumption and separate child or property remedies.', 'Muulize mshauri wa familia kuhusu dhana ya ndoa inayoweza kutumika na njia tofauti za haki za mtoto au mali.',
    'BASE-MARRIAGE,BASE-CHILD', ['presumption','cohabitation','maintenance'])
add('family_children', 'A child is being abused or neglected. Where can I seek help?', 'Mtoto ananyanyaswa au kupuuzwa. Natafuta msaada wapi?',
    'Prioritise the child safety and appropriate medical/social-welfare help. Do not confront the suspected abuser or repeatedly question the child.', 'Tanguliza usalama wa mtoto na msaada unaofaa wa afya na ustawi wa jamii. Usimkabili anayeshukiwa au kumuhoji mtoto mara kwa mara.',
    'Record what you observed, when it happened and existing messages without circulating identifying details.', 'Andika ulichoona, wakati kilipotokea na ujumbe uliopo bila kusambaza taarifa zinazomtambulisha mtoto.',
    'Help the child reach a safe adult or appropriate professional without exposing them to further danger.', 'Msaidie mtoto kufikia mtu mzima salama au mtaalamu anayefaa bila kumweka katika hatari zaidi.',
    'Seek social welfare and police gender/children-desk assistance; obtain medical help promptly where needed.', 'Tafuta msaada wa ustawi wa jamii na dawati la polisi la jinsia na watoto; pata matibabu mapema inapohitajika.',
    'BASE-CHILD,CRIM-PENAL,SAFE-HOMES', ['abuse','protection','neglect'], safety=True)
add('family_children', 'A child is being forced into marriage. What should we do?', 'Mtoto analazimishwa kuolewa au kuoa. Tufanye nini?',
    'Seek urgent child-protection and legal assistance. Do not rely on an old statutory age provision without considering the relevant court decisions.', 'Tafuta msaada wa haraka wa ulinzi wa mtoto na sheria. Usitegemee kifungu cha zamani cha umri bila kuzingatia maamuzi ya mahakama yanayohusika.',
    'Record the child age evidence, planned ceremony details and threats without putting the child at risk.', 'Rekodi ushahidi wa umri, taarifa za sherehe inayopangwa na vitisho bila kumweka mtoto hatarini.',
    'Identify a safe adult and suitable protection professional; avoid forced family mediation.', 'Tambua mtu mzima salama na mtaalamu wa ulinzi anayefaa; epuka usuluhishi wa familia unaolazimishwa.',
    'Contact social welfare, the police gender/children desk and legal aid promptly about protective action.', 'Wasiliana mapema na ustawi wa jamii, dawati la polisi la jinsia na watoto na msaada wa kisheria kuhusu hatua za kinga.',
    'BASE-CHILD,BASE-MARRIAGE,FAMILY-GYUMI-APPEAL', ['marriage','child','age'], 'Review judgment effect and subsequent legislation before publishing an exact age rule.', safety=True)
add('family_children', 'We cannot agree on paternity. How do we address it lawfully?', 'Hatuwezi kukubaliana kuhusu ubaba. Tunashughulikiaje kisheria?',
    'Parentage disputes should use the proper legal process and protect the child privacy. Do not treat informal allegations as a legal determination.', 'Migogoro ya uzazi itumie utaratibu sahihi wa sheria na ilinde faragha ya mtoto. Usichukulie madai yasiyo rasmi kuwa uamuzi wa kisheria.',
    'Keep birth records, relevant relationship dates, existing acknowledgements and any support order.', 'Hifadhi kumbukumbu za kuzaliwa, tarehe za uhusiano zinazohusika, kukiri uzazi na amri za matunzo.',
    'Avoid public accusations or sharing a child medical details; record the question that needs determination.', 'Epuka tuhuma za hadharani au kusambaza taarifa za afya za mtoto; eleza jambo linalohitaji uamuzi.',
    'Ask family legal aid or social welfare about the competent court process and lawful handling of any testing.', 'Uliza msaada wa sheria za familia au ustawi wa jamii kuhusu mahakama sahihi na utaratibu halali wa vipimo vinavyohitajika.',
    'BASE-CHILD,PROC-EVIDENCE', ['parentage','paternity','evidence'])

add('inheritance', 'A relative has died. How do we begin administering the estate?', 'Ndugu amefariki. Tunaanzaje kusimamia mirathi?',
    'Identify the applicable succession system and authorised estate process before distributing property. A family meeting alone does not settle legal authority.', 'Tambua mfumo wa mirathi na utaratibu wa mamlaka kabla ya kugawa mali. Mkutano wa familia pekee hauamui mamlaka ya kisheria.',
    'Collect the death record, any will, family/dependant details and a preliminary asset and debt list.', 'Kusanya kumbukumbu ya kifo, wosia uliopo, taarifa za familia na wategemezi na orodha ya mali na madeni.',
    'Keep property records safe and record necessary preservation expenses without privately dividing the estate.', 'Linda kumbukumbu za mali na andika gharama muhimu za kuhifadhi mali bila kugawa mirathi kwa binafsi.',
    'Ask a probate registry or succession legal adviser which court and grant procedure applies to this estate.', 'Uliza masjala ya mirathi au mshauri wa mirathi kuhusu mahakama na utaratibu wa kupata mamlaka unaohusu mirathi hii.',
    'ESTATES-PROBATE,ESTATES-RULES,PROC-APPLICABLE-LAWS', ['administration','probate','jurisdiction'])
add('inheritance', 'Someone is taking estate property before an administrator is appointed. What can I do?', 'Mtu anachukua mali za mirathi kabla ya msimamizi kuteuliwa. Nifanye nini?',
    'Seek prompt advice about preserving the estate and recording disputed dealings. Do not recover property by force.', 'Pata ushauri mapema wa kuhifadhi mirathi na kurekodi miamala inayopingwa. Usirudishe mali kwa nguvu.',
    'List the affected assets, who controls them, transfers attempted and available ownership records.', 'Orodhesha mali zinazohusika, anayezishikilia, uhamisho unaojaribiwa na nyaraka za umiliki.',
    'Keep evidence of sales or withdrawals and identify any existing probate case or court order.', 'Hifadhi ushahidi wa mauzo au kutoa fedha na tambua shauri la mirathi au amri iliyopo.',
    'Ask succession legal aid about lawful preservation orders, estate authority and reporting suspected theft where appropriate.', 'Uliza msaada wa sheria za mirathi kuhusu amri halali za kuhifadhi mali, mamlaka ya mirathi na taarifa ya wizi unaoshukiwa inapofaa.',
    'ESTATES-PROBATE,ESTATES-RULES,CRIM-PENAL', ['intermeddling','preservation','administrator'])
add('inheritance', 'I am a widow or widower being excluded from inheritance. Where do I start?', 'Nimefiwa na mwenzi na ninatengwa kwenye mirathi. Nianzie wapi?',
    'Your position needs assessment under the applicable marriage, property and succession rules. Do not assume one fixed share for every family.', 'Hali yako ichunguzwe chini ya sheria zinazohusika za ndoa, mali na mirathi. Usidhani kuna mgao mmoja kwa kila familia.',
    'Gather marriage evidence, death record, property/contribution records, will and court notices.', 'Kusanya ushahidi wa ndoa, kumbukumbu ya kifo, nyaraka za mali na mchango, wosia na taarifa za mahakama.',
    'Record the exclusion and any threatened eviction; do not sign a release of rights without advice.', 'Andika namna unavyotengwa na tishio la kuondolewa nyumbani; usisaini kuachia haki bila ushauri.',
    'Seek succession/family legal aid promptly about your claim, objection and protection of the home or estate.', 'Tafuta msaada wa sheria za mirathi na familia mapema kuhusu madai, pingamizi na kulinda nyumba au mirathi.',
    'ESTATES-PROBATE,BASE-MARRIAGE,PROC-APPLICABLE-LAWS,WEB-TAWLA', ['spouse','inheritance','estate'])
add('inheritance', 'Children are being left out of an estate. What should we do?', 'Watoto wanatengwa kwenye mirathi. Tufanye nini?',
    'Check parentage, dependency, the will and applicable succession law. Children interests may need representation through the proper process.', 'Chunguza uzazi, utegemezi, wosia na sheria ya mirathi inayotumika. Maslahi ya watoto yanaweza kuhitaji uwakilishi kupitia utaratibu sahihi.',
    'Collect birth records, dependency evidence, estate documents and the proposed distribution.', 'Kusanya kumbukumbu za kuzaliwa, ushahidi wa utegemezi, nyaraka za mirathi na mgao unaopendekezwa.',
    'Record each child circumstances and identify any guardian conflict of interest.', 'Andika mazingira ya kila mtoto na tambua mgongano wowote wa maslahi wa mlezi.',
    'Ask succession legal aid and social welfare about representation, objections and lawful management of a minor share.', 'Uliza msaada wa sheria za mirathi na ustawi wa jamii kuhusu uwakilishi, pingamizi na usimamizi halali wa mgao wa mtoto.',
    'ESTATES-PROBATE,BASE-CHILD,PROC-APPLICABLE-LAWS', ['minor','child','guardian'])
add('inheritance', 'I found a will. Is it valid and what should I do with it?', 'Nimepata wosia. Ni halali na niufanyie nini?',
    'A will needs assessment of authenticity, execution and applicable law. Finding a document does not authorise immediate distribution.', 'Wosia unahitaji uchunguzi wa uhalisi, utayarishaji na sheria husika. Kupata nyaraka hakukupi mamlaka ya kugawa mali mara moja.',
    'Preserve the original safely and record where it was found, its date and witnesses.', 'Hifadhi asili kwa usalama na andika ilipopatikana, tarehe yake na mashahidi.',
    'Avoid alterations and check whether there are other wills or an existing estate proceeding.', 'Usibadilishe wosia na chunguza kama kuna wosia mwingine au shauri la mirathi lililopo.',
    'Take the will to a succession adviser or probate registry for the appropriate proof and application process.', 'Peleka wosia kwa mshauri wa mirathi au masjala kwa utaratibu sahihi wa uthibitisho na maombi.',
    'ESTATES-PROBATE,ESTATES-RULES,PROC-EVIDENCE', ['will','probate','testament'])
add('inheritance', 'The estate administrator will not explain how money was used. What next?', 'Msimamizi wa mirathi haelezi matumizi ya fedha. Nifanye nini?',
    'An administrator authority and accounting obligations should be checked against the grant and applicable estate procedure.', 'Mamlaka na wajibu wa hesabu wa msimamizi vikaguliwe kwa kuzingatia mamlaka aliyopewa na utaratibu wa mirathi.',
    'Keep the grant, asset list, distribution proposal, payment records and requests for information.', 'Hifadhi nyaraka za mamlaka, orodha ya mali, mgao unaopendekezwa, kumbukumbu za malipo na maombi ya taarifa.',
    'Request a written estate account and distinguish missing information from suspected misuse.', 'Omba hesabu ya mirathi kwa maandishi na tenganisha taarifa zinazokosekana na matumizi mabaya yanayoshukiwa.',
    'Ask the probate registry or legal aid about an accounting application, objection or change of administrator where justified.', 'Uliza masjala au msaada wa kisheria kuhusu ombi la hesabu, pingamizi au kubadili msimamizi ikiwa kuna msingi.',
    'ESTATES-PROBATE,ESTATES-RULES', ['accounts','inventory','revocation'])
add('inheritance', 'I object to the proposed estate administrator. How do I respond?', 'Ninapinga msimamizi wa mirathi anayependekezwa. Nijibuje?',
    'Respond through the notified estate process promptly and explain your interest and objection. Do not ignore a court notice.', 'Jibu mapema kupitia utaratibu wa mirathi uliotangazwa na eleza maslahi na pingamizi lako. Usipuuze taarifa ya mahakama.',
    'Keep the notice, case number, death record and evidence supporting the objection.', 'Hifadhi taarifa, namba ya shauri, kumbukumbu ya kifo na ushahidi wa pingamizi.',
    'Write specific reasons and check the hearing date and the procedure for lodging an objection.', 'Andika sababu maalumu na thibitisha tarehe ya kusikilizwa na utaratibu wa kuwasilisha pingamizi.',
    'Ask a succession adviser about the applicable caveat/objection process and suitable administrator alternatives.', 'Muulize mshauri wa mirathi kuhusu utaratibu wa pingamizi unaotumika na chaguo la msimamizi anayefaa.',
    'ESTATES-PROBATE,ESTATES-RULES,ESTATES-AMENDMENT-2025,ESTATES-PRIMARY-AMENDMENT-2025', ['caveat','objection','notice'], '2025 probate amendments and Primary Court procedure must be reconciled separately.')
add('inheritance', 'The deceased left debts. Must the family pay them personally?', 'Marehemu ameacha madeni. Familia lazima ilipe binafsi?',
    'Separate estate debts from a person own contractual obligations, guarantees or joint liabilities. Do not assume every relative personally owes the debt.', 'Tenganisha madeni ya mirathi na wajibu binafsi wa mkataba, dhamana au deni la pamoja. Usidhani kila ndugu anadaiwa binafsi.',
    'Collect creditor demands, loan documents, guarantees, estate assets and the grant if issued.', 'Kusanya madai ya wadai, mikataba ya mkopo, dhamana, mali za mirathi na nyaraka za mamlaka zilizotolewa.',
    'Ask creditors for the legal basis and account statement; avoid personally admitting liability before advice.', 'Omba wadai waeleze msingi wa madai na taarifa ya hesabu; epuka kukiri deni binafsi kabla ya ushauri.',
    'Seek succession/contract advice about verified debts and lawful payment from the estate before distribution.', 'Tafuta ushauri wa mirathi na mikataba kuhusu madeni yaliyothibitishwa na malipo halali kutoka mirathi kabla ya mgao.',
    'ESTATES-PROBATE,CONTRACT-ACT', ['debts','creditor','liability'])

add('consumer_money', 'I bought a faulty product and the seller refuses to help. What can I do?', 'Nimenunua bidhaa mbovu na muuzaji anakataa kusaidia. Nifanye nini?',
    'Document the defect and your purchase terms. The remedy depends on the transaction and applicable consumer or contract rules.', 'Rekodi hitilafu na masharti ya ununuzi. Suluhisho hutegemea muamala na sheria za walaji au mikataba zinazohusika.',
    'Keep the receipt, warranty, advertisement, photographs and seller communication.', 'Hifadhi risiti, dhamana, tangazo, picha na mawasiliano ya muuzaji.',
    'Send the seller a clear written complaint describing the fault and requested remedy; keep the response.', 'Tuma malalamiko ya maandishi yanayoeleza hitilafu na suluhisho unaloomba; hifadhi jibu.',
    'Check whether FCC handles this complaint or whether a contract claim belongs in another competent forum.', 'Thibitisha kama FCC hushughulikia malalamiko haya au kama madai ya mkataba yanahusu chombo kingine sahihi.',
    'FCC-CURRENT-ACT,FCC-CONSUMER-PROCEDURE,CONTRACT-ACT', ['consumer','misleading','goods'])
add('consumer_money', 'An online seller took my money and did not deliver. What next?', 'Muuzaji wa mtandaoni amechukua fedha bila kuleta bidhaa. Nifanye nini?',
    'Preserve the transaction and distinguish non-delivery from suspected fraud. Act promptly to ask the payment provider about available dispute options.', 'Hifadhi muamala na tenganisha kutowasilishwa bidhaa na udanganyifu unaoshukiwa. Uliza mtoa huduma ya malipo mapema kuhusu kupinga muamala.',
    'Save the listing, seller identity, order, payment reference, promised delivery date and messages.', 'Hifadhi tangazo, utambulisho wa muuzaji, agizo, kumbukumbu ya malipo, tarehe ya kuleta bidhaa na ujumbe.',
    'Request delivery or repayment in writing and report the disputed payment through the provider official channel.', 'Omba bidhaa au kurudishiwa fedha kwa maandishi na ripoti malipo yanayopingwa kupitia njia rasmi ya mtoa huduma.',
    'Seek consumer/contract advice; where facts suggest fraud, report to police without assuming a refund is guaranteed.', 'Tafuta ushauri wa walaji na mikataba; ikiwa kuna dalili za udanganyifu, toa taarifa polisi bila kudhani fedha zitarudi kwa uhakika.',
    'CONTRACT-ACT,FCC-CURRENT-ACT,CRIM-PENAL,WEB-BOT', ['fraud','contract','representation'])
add('consumer_money', 'Money disappeared from my bank or mobile-money account. What should I do?', 'Fedha zimepotea kwenye benki au akaunti ya fedha ya simu. Nifanye nini?',
    'Report the disputed transaction promptly through the financial provider official channel and secure the account. The responsible regulator depends on the service.', 'Ripoti muamala unaopingwa mapema kupitia njia rasmi ya mtoa huduma na linda akaunti. Mdhibiti husika hutegemea huduma.',
    'Save transaction IDs, dates, amounts, statements and complaint references; never share your PIN or one-time code.', 'Hifadhi namba za miamala, tarehe, kiasi, taarifa za akaunti na kumbukumbu za malalamiko; usitoe PIN au msimbo wa mara moja.',
    'Ask the provider to investigate and secure access; use its official recovery process if your SIM or account was compromised.', 'Omba mtoa huduma achunguze na alinde matumizi; tumia utaratibu rasmi wa kurejesha huduma ikiwa SIM au akaunti imeingiliwa.',
    'Use the provider complaint process first, then check Bank of Tanzania escalation for regulated financial-service complaints.', 'Anza na malalamiko kwa mtoa huduma, kisha thibitisha utaratibu wa kupeleka kwa Benki Kuu kuhusu huduma za fedha zinazodhibitiwa.',
    'WEB-BOT,WEB-BOT-2025,FIN-BOT-REGULATIONS', ['complaint','financial','transaction'], 'Reconcile current provider and Bank complaint time limits; no automatic refund claim.')
add('consumer_money', 'My lender is adding unexplained charges or threatening me. Where do I complain?', 'Mkopeshaji anaongeza gharama zisizoeleweka au kunitishia. Nilalamike wapi?',
    'Check the loan agreement, lender status and account calculation. A dispute about charges does not automatically cancel repayment obligations.', 'Kagua mkataba wa mkopo, hadhi ya mkopeshaji na hesabu. Kupinga gharama hakufuti moja kwa moja wajibu wa kulipa.',
    'Keep the agreement, disbursement amount, repayments, fee notices and threatening messages.', 'Hifadhi mkataba, kiasi kilichotolewa, marejesho, taarifa za ada na ujumbe wa vitisho.',
    'Request an itemised balance and complaint decision; do not provide further passwords or contacts to an unverified collector.', 'Omba maelezo ya salio kwa vipengele na uamuzi wa malalamiko; usitoe nywila au mawasiliano zaidi kwa mkusanyaji asiyehakikiwa.',
    'Check the provider regulator with a financial/legal adviser; seek police or protection help if threats create a safety risk.', 'Thibitisha mdhibiti wa mtoa huduma kwa mshauri wa fedha au sheria; tafuta msaada wa polisi au ulinzi ikiwa vitisho vinahatarisha usalama.',
    'FIN-BOT-REGULATIONS,WEB-BOT,CONTRACT-ACT,CRIM-PENAL', ['charges','collection','credit'])
add('consumer_money', 'My phone company charged me incorrectly or suspended my service. What next?', 'Kampuni ya simu imenikata fedha kimakosa au kusitisha huduma. Nifanye nini?',
    'Keep a record of the telecom charge or interruption and complain to the provider. Financial transactions may need a separate financial-services route.', 'Hifadhi kumbukumbu ya makato au kukatika huduma na mlalamikie mtoa huduma. Miamala ya fedha inaweza kuhitaji njia tofauti ya huduma za fedha.',
    'Save bills, package terms, balance messages, dates of interruption and complaint reference numbers.', 'Hifadhi bili, masharti ya kifurushi, ujumbe wa salio, tarehe za kukatika na namba za malalamiko.',
    'Ask the provider to explain the charge or suspension and give a written complaint outcome.', 'Omba mtoa huduma aeleze makato au kusitisha huduma na atoe matokeo ya malalamiko kwa maandishi.',
    'Check TCRA consumer complaint procedures for telecom services if the provider response does not resolve the issue.', 'Thibitisha utaratibu wa malalamiko ya walaji wa TCRA kuhusu mawasiliano ikiwa jibu la mtoa huduma halitatui tatizo.',
    'TELECOM-CONSUMER-REGULATIONS,WEB-TCRA,TELECOM-GUIDELINE-2020', ['complaint','billing','suspension'])
add('consumer_money', 'My water or electricity bill is wrong, or service was disconnected. Where do I go?', 'Bili ya maji au umeme si sahihi au huduma imekatwa. Niende wapi?',
    'Document the bill, meter and disconnection and use the supplier complaint process. The regulator route depends on the service and jurisdiction.', 'Rekodi bili, mita na kukatwa huduma na tumia njia ya malalamiko ya msambazaji. Mdhibiti hutegemea huduma na eneo la kisheria.',
    'Save bills, meter readings, payments, disconnection notice and customer account number.', 'Hifadhi bili, usomaji wa mita, malipo, taarifa ya kukatwa na namba ya mteja.',
    'Request a billing review and written reasons from the supplier; do not reconnect or tamper with equipment yourself.', 'Omba ukaguzi wa bili na sababu kwa maandishi kutoka kwa msambazaji; usijiunganishie au kuchezea vifaa.',
    'Check the appropriate EWURA water/electricity complaint route in Mainland Tanzania; Zanzibar requires its own regulator review.', 'Thibitisha njia sahihi ya malalamiko ya maji au umeme ya EWURA Tanzania Bara; Zanzibar inahitaji ukaguzi wa mdhibiti wake.',
    'WEB-EWURA-WATER,WEB-EWURA-POWER,UTILITIES-COMPLAINT-RULES', ['complaint','disconnection','billing'])
add('consumer_money', 'Someone borrowed my money and will not repay it. Can I recover it?', 'Mtu amekopa fedha zangu na harudishi. Naweza kuzidai?',
    'A debt recovery route depends on proof, amount, agreement and jurisdiction. Ordinary non-payment is not automatically a criminal offence.', 'Njia ya kudai deni hutegemea ushahidi, kiasi, makubaliano na mamlaka. Kutolipa pekee si moja kwa moja kosa la jinai.',
    'Collect the loan agreement, transfer receipts, repayment promises and a balance calculation.', 'Kusanya makubaliano ya mkopo, risiti za kutuma fedha, ahadi za kulipa na hesabu ya salio.',
    'If safe, send a clear written demand and consider a documented repayment proposal without threats.', 'Ikiwa ni salama, tuma madai ya maandishi na fikiria mpango wa marejesho uliorekodiwa bila vitisho.',
    'Ask a civil legal adviser whether negotiation, small claims or another competent civil court process applies.', 'Muulize mshauri wa madai ya kiraia kama mazungumzo, madai madogo au mahakama nyingine sahihi inahusika.',
    'CONTRACT-ACT,PROC-SMALL-CLAIMS,PROC-LIMITATION', ['debt','claim','jurisdiction'], 'Confirm current small-claims eligibility, monetary threshold and exclusions before quoting figures.')
add('consumer_money', 'A contractor took payment but did not finish the work. What can I do?', 'Fundi au mkandarasi amelipwa lakini hajamaliza kazi. Nifanye nini?',
    'Compare agreed work with delivery and payments. Keep a clear record before cancelling, withholding payments or hiring a replacement.', 'Linganisha kazi iliyokubaliwa, iliyofanywa na malipo. Rekodi hali kabla ya kuvunja mkataba, kusimamisha malipo au kuleta mbadala.',
    'Keep the quote, contract, scope, payment proof, progress photographs and agreed completion dates.', 'Hifadhi makadirio, mkataba, kazi zilizokubaliwa, malipo, picha za maendeleo na tarehe za kukamilisha.',
    'Request a written explanation and completion or refund proposal; document disputed variations.', 'Omba maelezo na pendekezo la kukamilisha au kurudisha fedha kwa maandishi; rekodi mabadiliko yanayopingwa.',
    'Ask consumer/contract legal aid about the appropriate remedy and forum before taking irreversible action.', 'Uliza msaada wa sheria za walaji na mikataba kuhusu suluhisho na chombo sahihi kabla ya hatua isiyoweza kurekebishwa.',
    'CONTRACT-ACT,FCC-CURRENT-ACT,PROC-CIVIL', ['breach','damages','agreement'])

add('safety_criminal', 'I am being harmed or threatened by my partner. Where can I get help?', 'Mwenzi ananiumiza au kunitishia. Napata msaada wapi?',
    'Prioritise immediate safety and medical care. A legal complaint and confidential protection referral can proceed with professional support.', 'Tanguliza usalama wa haraka na matibabu. Malalamiko ya kisheria na rufaa ya ulinzi ya siri vinaweza kuendelea kwa msaada wa wataalamu.',
    'Keep existing messages and injury records only where safe; do not put yourself at risk to obtain evidence.', 'Hifadhi ujumbe na kumbukumbu za majeraha ikiwa ni salama; usijiweke hatarini ili kupata ushahidi.',
    'Use a safe device/contact method and seek a trusted person or in-person emergency help if danger is immediate.', 'Tumia kifaa na mawasiliano salama na tafuta mtu wa kuaminika au msaada wa dharura ana kwa ana ikiwa hatari ni ya haraka.',
    'Seek appropriate police gender-desk, medical, social-welfare and legal-aid assistance; shelter admission must be confirmed by a responsible professional.', 'Tafuta msaada unaofaa wa dawati la jinsia la polisi, afya, ustawi wa jamii na sheria; kupokelewa makazi salama kuthibitishwe na mtaalamu anayehusika.',
    'SAFE-HOMES,CRIM-PENAL,BASE-MARRIAGE', ['violence','security','protection'], 'Confirm local emergency channels and protection-order route; do not publish confidential shelter addresses.', safety=True)
add('safety_criminal', 'I have experienced sexual assault. What should I do first?', 'Nimefanyiwa ukatili wa kingono. Nifanye nini kwanza?',
    'Seek safety and medical care promptly. A trained professional can help with treatment, evidence handling and reporting options.', 'Tafuta usalama na matibabu mapema. Mtaalamu aliyefunzwa anaweza kusaidia matibabu, kuhifadhi ushahidi na njia za kutoa taarifa.',
    'Preserve existing messages or clothing where safely possible, but do not delay care to collect evidence.', 'Hifadhi ujumbe au nguo zilizopo ikiwa inawezekana kwa usalama, lakini usicheleweshe matibabu ili kukusanya ushahidi.',
    'Ask the health facility for confidential care and documentation; request a trusted support person if you want one.', 'Omba huduma za siri na kumbukumbu katika kituo cha afya; omba mtu wa kukusaidia ikiwa unamhitaji.',
    'Seek trained police gender/children-desk, social-welfare and legal support for reporting and protection appropriate to your circumstances.', 'Tafuta msaada wa dawati la polisi la jinsia na watoto, ustawi wa jamii na sheria kwa taarifa na ulinzi unaofaa kwa mazingira yako.',
    'CRIM-PENAL,SAFE-HOMES,BASE-CHILD', ['rape','sexual','medical'], 'Clinical timing and treatment require health-professional review; no app diagnosis or unverified medical deadline.', safety=True)
add('safety_criminal', 'A child has been arrested. What should the family do?', 'Mtoto amekamatwa. Familia ifanye nini?',
    'Seek child-specific legal and welfare assistance promptly. Age, custody conditions and the allegation affect the correct procedure.', 'Tafuta msaada wa sheria na ustawi unaohusu watoto mapema. Umri, mazingira ya kushikiliwa na tuhuma huathiri utaratibu sahihi.',
    'Record the station, officer, arrest time, allegation and available proof of age.', 'Andika kituo, askari, muda wa kukamatwa, tuhuma na ushahidi wa umri uliopo.',
    'Ask where the child is held and request appropriate guardian and legal support; do not coach statements.', 'Uliza mtoto anashikiliwa wapi na omba msaada unaofaa wa mlezi na sheria; usimfundishe kauli za kutoa.',
    'Contact child legal aid and social welfare about juvenile procedure, safety and any release application.', 'Wasiliana na msaada wa sheria za watoto na ustawi wa jamii kuhusu utaratibu wa watoto, usalama na ombi la kuachiwa.',
    'BASE-CHILD,CHILD-JUVENILE-RULES,CRIM-PROCEDURE', ['juvenile','arrest','child'], safety=True)
add('safety_criminal', 'I or a relative has been arrested. How do we get legal help?', 'Mimi au ndugu amekamatwa. Tunapataje msaada wa kisheria?',
    'Identify the detention location and seek legal assistance promptly. Do not rely on one universal detention or bail rule.', 'Tambua mahali pa kushikiliwa na tafuta msaada wa kisheria mapema. Usitegemee kanuni moja ya muda wa kushikiliwa au dhamana kwa kila hali.',
    'Record arrest time, station, known allegation, officer details and any court or case reference.', 'Andika muda wa kukamatwa, kituo, tuhuma zinazojulikana, askari na kumbukumbu ya shauri.',
    'Request the reason for detention and access to an advocate or legal-aid provider; seek medical attention where needed.', 'Omba sababu ya kushikiliwa na kupata wakili au mtoa msaada wa kisheria; tafuta matibabu inapohitajika.',
    'Ask a criminal legal adviser to check lawful custody, the next court step and any available release remedy.', 'Muulize mshauri wa jinai kuhusu uhalali wa kushikiliwa, hatua inayofuata mahakamani na njia ya kuachiwa inayoweza kuwepo.',
    'CRIM-PROCEDURE,CRIM-PROCEDURE-SUPPLEMENT-2025,BASE-LEGAL-AID', ['arrest','detention','advocate'], safety=True)
add('safety_criminal', 'How do I ask about bail, and must I pay someone privately?', 'Naulizaje kuhusu dhamana, na lazima nimlipe mtu binafsi?',
    'Bail depends on the offence, stage and applicable law. Ask for official conditions and receipts; an unofficial payment is not proof of a lawful bail process.', 'Dhamana hutegemea kosa, hatua na sheria husika. Omba masharti rasmi na risiti; malipo yasiyo rasmi hayathibitishi utaratibu halali wa dhamana.',
    'Keep the charge, custody or court reference and any written bail decision or payment request.', 'Hifadhi tuhuma, kumbukumbu za polisi au mahakama na uamuzi au ombi la malipo la dhamana.',
    'Ask who decides the application, what conditions apply and whether any requested payment has an official legal basis.', 'Uliza nani anaamua ombi, masharti yanayohusika na msingi rasmi wa kisheria wa malipo yanayoombwa.',
    'Seek criminal legal aid about eligibility, sureties and any review of refusal; do not assume all offences are bailable.', 'Tafuta msaada wa sheria za jinai kuhusu vigezo, wadhamini na kupinga kukataliwa; usidhani makosa yote yana dhamana.',
    'CRIM-PROCEDURE,CRIM-PROCEDURE-SUPPLEMENT-2025,CORRUPTION-ACT', ['bail','surety','release'], 'Current bail exclusions and amendments require specialist review.')
add('safety_criminal', 'Police did not act on my report. How do I follow up?', 'Polisi hawajachukua hatua kwa taarifa yangu. Nifuatilieje?',
    'Keep the report reference and distinguish investigation follow-up from a complaint about misconduct. Neither process guarantees prosecution.', 'Hifadhi kumbukumbu ya taarifa na tenganisha kufuatilia uchunguzi na malalamiko ya mwenendo. Hakuna utaratibu unaohakikisha kufunguliwa mashitaka.',
    'Keep the report date, station, reference, evidence submitted and names of officers contacted.', 'Hifadhi tarehe ya taarifa, kituo, kumbukumbu, ushahidi uliotolewa na askari uliowasiliana nao.',
    'Request an update through the station responsible officer or appropriate supervisory channel and record the response.', 'Omba mrejesho kupitia afisa anayehusika kituoni au njia sahihi ya usimamizi na hifadhi jibu.',
    'Seek legal aid about safe escalation; an alleged rights violation may also need a CHRAGG admissibility assessment.', 'Tafuta msaada wa kisheria kuhusu kufuatilia kwa usalama; ukiukaji wa haki unaodaiwa unaweza pia kuhitaji uchunguzi wa THBUB.',
    'CRIM-PROCEDURE,RIGHTS-CHRAGG-ACT,WEB-CHRAGG', ['investigation','complaint','police'], 'Verify current police oversight channels; CHRAGG is not a substitute for urgent court relief.', safety=True)
add('safety_criminal', 'Someone is threatening me because I reported an offence. What can I do?', 'Mtu ananitishia kwa sababu nimetoa taarifa ya kosa. Nifanye nini?',
    'Report the threat and seek an individual protection assessment. Do not assume reporting automatically enrols you in witness protection.', 'Toa taarifa ya tishio na omba uchunguzi wa ulinzi unaokufaa. Usidhani taarifa inakuingiza moja kwa moja kwenye ulinzi wa mashahidi.',
    'Save existing threats, dates and case references securely without provoking further contact.', 'Hifadhi vitisho vilivyopo, tarehe na kumbukumbu za shauri kwa usalama bila kuchochea mawasiliano mengine.',
    'Tell the responsible investigator or prosecutor about the threat through a safe channel and identify a safe contact method.', 'Mweleze mpelelezi au mwendesha mashitaka anayehusika kuhusu tishio kupitia njia salama na eleza namna salama ya kukutafuta.',
    'Seek legal/safeguarding advice about protection eligibility and immediate safety arrangements.', 'Tafuta ushauri wa sheria na ulinzi kuhusu vigezo vya ulinzi na mpango wa usalama wa haraka.',
    'SAFE-WITNESS-ACT,CRIM-PROCEDURE,SAFE-HOMES', ['witness','protection','threat'], safety=True)
add('safety_criminal', 'My photos or personal information are being shared to threaten me. Where do I start?', 'Picha au taarifa zangu zinasambazwa ili kunitishia. Nianzie wapi?',
    'Preserve evidence safely and secure your accounts. Threats, data misuse and platform removal may require separate responses.', 'Hifadhi ushahidi kwa usalama na linda akaunti. Vitisho, matumizi mabaya ya taarifa na kuondoa maudhui vinaweza kuhitaji hatua tofauti.',
    'Keep URLs, timestamps, screenshots and messages without forwarding intimate material to others.', 'Hifadhi viungo, muda, picha za skrini na ujumbe bila kusambaza picha za faragha kwa wengine.',
    'Use the platform reporting tools and change compromised access through official recovery channels.', 'Tumia njia za kuripoti za jukwaa na rekebisha matumizi yaliyoingiliwa kupitia utaratibu rasmi wa kurejesha akaunti.',
    'Seek police/legal help for threats or suspected offences and check PDPC complaint applicability for personal-data misuse.', 'Tafuta msaada wa polisi na sheria kuhusu vitisho au makosa yanayoshukiwa na thibitisha kama malalamiko ya PDPC yanahusika kwa matumizi mabaya ya taarifa.',
    'BASE-PRIVACY,PRIVACY-COMPLAINTS,CRIM-PENAL', ['complaint','personal data','disclosure'], 'Acquire and review relevant cybercrime/electronic-communications provisions before a full criminal-law explanation.', safety=True)

add('documents_services', 'I was born at home and have no birth certificate. How do I begin?', 'Nilizaliwa nyumbani na sina cheti cha kuzaliwa. Nianzie wapi?',
    'Mainland birth registration includes a late-registration route. The evidence depends on the birth circumstances; use RITA guidance for the correct application.', 'Usajili wa kuzaliwa Tanzania Bara una njia ya usajili uliochelewa. Ushahidi hutegemea mazingira ya kuzaliwa; tumia mwongozo wa RITA kwa ombi sahihi.',
    'Prepare your birth date/place, parent details and available identity, school or birth evidence.', 'Andaa tarehe na mahali pa kuzaliwa, taarifa za wazazi na ushahidi uliopo wa utambulisho, shule au kuzaliwa.',
    'Check the official eRITA service or registrar requirements for late registration; do not invent missing facts.', 'Kagua huduma rasmi ya eRITA au mahitaji ya msajili kwa usajili uliochelewa; usibuni taarifa zinazokosekana.',
    'Submit through the official registration route and keep the application and payment references.', 'Wasilisha kupitia utaratibu rasmi wa usajili na hifadhi kumbukumbu za ombi na malipo.',
    'WEB-RITA-FAQ,WEB-RITA-PORTAL,CIVIL-BIRTH-DEATH', ['birth','registration','late'], 'Reconcile old FAQ and current portal requirements; no fee quoted.')
add('documents_services', 'My birth or death certificate is lost. How do I replace it?', 'Cheti changu cha kuzaliwa au kifo kimepotea. Nakipataje tena?',
    'Request the appropriate replacement or copy service using the existing registration details. Replacement differs from registering an unrecorded event.', 'Omba huduma sahihi ya cheti mbadala au nakala kwa taarifa za usajili uliopo. Kubadilisha cheti ni tofauti na kusajili tukio ambalo halijasajiliwa.',
    'Collect the old certificate number or copy if available, names, event date/place and your identification.', 'Kusanya namba au nakala ya cheti cha zamani ikiwa ipo, majina, tarehe na mahali pa tukio na utambulisho wako.',
    'Check eRITA for the current replacement/copy service and supporting documents.', 'Kagua eRITA kuhusu huduma ya sasa ya cheti mbadala au nakala na nyaraka zinazohitajika.',
    'Use the official registrar channel and generated payment reference; avoid paying an unverified intermediary.', 'Tumia njia rasmi ya msajili na kumbukumbu rasmi ya malipo; epuka kumlipa mpatanishi asiyehakikiwa.',
    'WEB-RITA-PORTAL,WEB-RITA-FAQ,CIVIL-BIRTH-DEATH', ['certificate','copy','registration'], 'Old FAQ and current portal show conflicting fees.')
add('documents_services', 'My certificate has a spelling error or wrong detail. What can I do?', 'Cheti kina kosa la herufi au taarifa. Nifanye nini?',
    'An error correction and a legal change of name may use different procedures. Present evidence of the correct detail rather than editing the certificate yourself.', 'Kurekebisha kosa na kubadili jina kisheria vinaweza kutumia taratibu tofauti. Toa ushahidi wa taarifa sahihi badala ya kubadili cheti mwenyewe.',
    'Keep the incorrect certificate and supporting identity, school, hospital or family records.', 'Hifadhi cheti chenye kosa na nyaraka zinazounga mkono za utambulisho, shule, hospitali au familia.',
    'Describe exactly which detail is wrong and ask the registrar whether this is a correction or another legal process.', 'Eleza taarifa yenye kosa na muulize msajili kama ni marekebisho au utaratibu mwingine wa kisheria.',
    'Use the official correction service and keep the decision; seek legal help if supporting records conflict.', 'Tumia huduma rasmi ya marekebisho na hifadhi uamuzi; tafuta msaada wa kisheria ikiwa kumbukumbu zinakinzana.',
    'WEB-RITA-PORTAL,WEB-RITA-FAQ,CIVIL-BIRTH-DEATH', ['correction','name','certificate'])
add('documents_services', 'A relative died without a death certificate. How do we obtain one?', 'Ndugu amefariki bila cheti cha kifo. Tunakipataje?',
    'The death event may need registration before a certificate can be issued. Older unregistered deaths require the appropriate late-registration assessment.', 'Tukio la kifo linaweza kuhitaji kusajiliwa kabla ya cheti kutolewa. Vifo vya zamani visivyosajiliwa vinahitaji utaratibu unaofaa wa usajili uliochelewa.',
    'Collect the deceased identity, death date/place, hospital or burial records and informant details.', 'Kusanya utambulisho wa marehemu, tarehe na mahali pa kifo, kumbukumbu za hospitali au mazishi na taarifa za mtoa taarifa.',
    'Check whether the death was registered and ask RITA which evidence is required for this case.', 'Thibitisha kama kifo kilisajiliwa na uliza RITA ushahidi unaohitajika kwa hali hii.',
    'Use the official death-registration/certificate route and keep records needed for any estate application.', 'Tumia njia rasmi ya usajili wa kifo na cheti na hifadhi kumbukumbu za maombi ya mirathi.',
    'WEB-RITA-SERVICES,WEB-RITA-FAQ,CIVIL-BIRTH-DEATH', ['death','informant','register'])
add('documents_services', 'My marriage certificate is lost, or I need my divorce registered. What next?', 'Cheti cha ndoa kimepotea au nataka kusajili talaka. Nifanye nini?',
    'A marriage-record copy and divorce registration are different services. Registering a divorce is not the same as obtaining a court divorce.', 'Nakala ya kumbukumbu ya ndoa na usajili wa talaka ni huduma tofauti. Kusajili talaka si sawa na kupata talaka mahakamani.',
    'Gather spouse names, marriage date/place, any certificate copy and the relevant court decree for divorce.', 'Kusanya majina ya wanandoa, tarehe na mahali pa ndoa, nakala ya cheti iliyopo na hukumu husika ya talaka.',
    'Identify whether you need a record search/copy or registration of a court decision.', 'Tambua kama unahitaji kutafutiwa kumbukumbu au nakala au kusajili uamuzi wa mahakama.',
    'Check the RITA marriage/divorce service requirements, including the decision finality requirements where relevant.', 'Thibitisha mahitaji ya huduma ya ndoa au talaka ya RITA, pamoja na masharti ya uamuzi kuwa wa mwisho inapohusika.',
    'WEB-RITA-SERVICES,WEB-RITA-FAQ,BASE-MARRIAGE', ['register','divorce','marriage'])
add('documents_services', 'My NIDA card is lost or the details do not match. Where do I start?', 'Kitambulisho cha NIDA kimepotea au taarifa hazilingani. Nianzie wapi?',
    'Use NIDA official channels to determine the replacement or correction process. Do not submit identity details to an unofficial website.', 'Tumia njia rasmi za NIDA kuthibitisha utaratibu wa kitambulisho mbadala au marekebisho. Usiweke taarifa za utambulisho kwenye tovuti isiyo rasmi.',
    'Keep your NIN or application reference if available and the records that establish the correct details.', 'Hifadhi NIN au kumbukumbu ya ombi ikiwa ipo na nyaraka zinazothibitisha taarifa sahihi.',
    'Identify whether the issue is a lost card, missing NIN, application delay or inconsistent records.', 'Tambua kama tatizo ni kitambulisho kupotea, NIN kukosekana, kuchelewa kwa ombi au taarifa kutofautiana.',
    'Ask NIDA through its official portal/office for the current evidence and fee requirements; obtain a submission reference.', 'Uliza NIDA kupitia tovuti au ofisi rasmi kuhusu ushahidi na ada za sasa; pata kumbukumbu ya kuwasilisha.',
    'WEB-NIDA,BASE-PRIVACY', ['identity','personal data'], 'Precise NIDA replacement/correction requirements were not acquired; review with NIDA before publishing as a complete procedural guide.')
add('documents_services', 'An official asks for an unofficial payment to provide a service. What can I do?', 'Afisa anadai malipo yasiyo rasmi ili kutoa huduma. Nifanye nini?',
    'Ask for the official fee basis and receipt where safe. Reporting suspected corruption needs a safe factual record, not public accusations.', 'Omba msingi wa ada rasmi na risiti ikiwa ni salama. Taarifa ya rushwa inayoshukiwa ihifadhi ukweli kwa usalama badala ya tuhuma za hadharani.',
    'Record the office, date, service, amount requested and existing messages without arranging a risky confrontation.', 'Andika ofisi, tarehe, huduma, kiasi kilichoombwa na ujumbe uliopo bila kupanga makabiliano ya hatari.',
    'Check the published service charge and request an official payment channel rather than a personal transfer.', 'Kagua ada iliyochapishwa na omba njia rasmi ya malipo badala ya kutuma kwa mtu binafsi.',
    'Seek legal/safety advice about reporting to PCCB in Mainland Tanzania; Zanzibar corruption complaints require the appropriate Zanzibar institution.', 'Tafuta ushauri wa sheria na usalama kuhusu kutoa taarifa TAKUKURU Tanzania Bara; malalamiko ya rushwa Zanzibar yanahitaji taasisi husika ya Zanzibar.',
    'CORRUPTION-ACT,WEB-PCCB,SAFE-WITNESS-ACT', ['corruption','bribe','report'], 'Verify the current reporting channel; no hotline or confidentiality guarantee invented.', safety=True)
add('documents_services', 'A public service is refusing reasonable disability access. How can I complain?', 'Huduma ya umma inakataa msaada unaofaa wa ulemavu. Nalalamikaje?',
    'Describe the access barrier and assistance needed. Disability-rights remedies depend on the service, facts and applicable law.', 'Eleza kizuizi cha kupata huduma na msaada unaohitaji. Njia za haki za watu wenye ulemavu hutegemea huduma, mazingira na sheria husika.',
    'Record the service, date, access barrier, assistance requested and response; retain relevant evidence privately.', 'Rekodi huduma, tarehe, kizuizi, msaada ulioombwa na jibu; hifadhi ushahidi kwa faragha.',
    'Request an accessible alternative and a written explanation from the responsible office.', 'Omba njia mbadala inayofikika na maelezo kwa maandishi kutoka ofisi inayohusika.',
    'Seek disability-focused legal aid or an appropriate rights complaint assessment, including CHRAGG where within its mandate.', 'Tafuta msaada wa kisheria unaohusu ulemavu au uchunguzi wa malalamiko ya haki, pamoja na THBUB ikiwa suala liko ndani ya mamlaka yake.',
    'DISABILITY-ACT,RIGHTS-CHRAGG-ACT,WEB-CHRAGG', ['accessibility','discrimination','public'])

add('access_justice', 'I cannot afford a lawyer. How do I ask for legal aid?', 'Siwezi kumudu wakili. Naombaje msaada wa kisheria?',
    'Start with a registered provider and ask about eligibility, scope and current availability. Registration does not guarantee representation in every case.', 'Anza kwa mtoa msaada aliyesajiliwa na uliza vigezo, huduma na upatikanaji wa sasa. Usajili hauhakikishi uwakilishi katika kila shauri.',
    'Prepare a short problem summary, location, key dates, notices and the outcome you seek.', 'Andaa maelezo mafupi ya tatizo, eneo, tarehe muhimu, taarifa ulizopewa na unachotaka kifanyike.',
    'Explain any filing deadline, disability, language or safe-contact need when requesting help.', 'Eleza muda wa kufungua shauri, ulemavu, lugha au hitaji la mawasiliano salama unapoomba msaada.',
    'Use the official provider register or verified contacts, then confirm acceptance and whether any costs remain.', 'Tumia orodha rasmi ya watoa msaada au mawasiliano yaliyothibitishwa, kisha thibitisha kupokelewa na gharama zinazobaki.',
    'BASE-LEGAL-AID,LEGAL-AID-SUPPLEMENT-2025,WEB-TAWLA', ['legal aid','registration','eligibility'])
add('access_justice', 'I have a dispute but do not know which office or court handles it. How do I choose?', 'Nina mgogoro lakini sijui ofisi au mahakama sahihi. Nachaguaje?',
    'Identify the issue and jurisdiction before choosing a forum. Labour, land, family, consumer and criminal matters do not all follow the same route.', 'Tambua suala na mamlaka kabla ya kuchagua chombo. Kazi, ardhi, familia, walaji na jinai havifuati njia moja.',
    'Write what happened, where, when, who is involved and what remedy you need.', 'Andika kilichotokea, eneo, wakati, wahusika na suluhisho unalohitaji.',
    'Separate immediate safety needs from compensation, employment, ownership or family decisions.', 'Tenganisha mahitaji ya usalama wa haraka na fidia, ajira, umiliki au maamuzi ya familia.',
    'Ask a legal-aid adviser to confirm Mainland/Zanzibar scope, subject-matter authority, claim value and any required preliminary step.', 'Muulize mshauri wa kisheria athibitishe Tanzania Bara au Zanzibar, mamlaka ya suala, thamani ya madai na hatua ya awali inayohitajika.',
    'BASE-LEGAL-AID,COURTS-MAGISTRATES,LAND-DISPUTES,EMPLOYMENT-INSTITUTIONS', ['jurisdiction','court','dispute'])
add('access_justice', 'What documents should I bring when asking for legal help?', 'Nipeleke nyaraka gani ninapoomba msaada wa kisheria?',
    'Bring relevant evidence and a clear timeline; a missing document should be explained rather than replaced with an invented statement.', 'Peleka ushahidi unaohusika na mfuatano wazi wa matukio; eleza nyaraka zinazokosekana badala ya kubuni taarifa.',
    'Collect notices, agreements, receipts, orders, messages and witness contacts relevant to the problem.', 'Kusanya taarifa, mikataba, risiti, amri, ujumbe na mawasiliano ya mashahidi yanayohusu tatizo.',
    'Make an index with dates and keep originals safe; share copies and sensitive material only through an agreed secure method.', 'Andaa orodha yenye tarehe na linda asili; toa nakala na taarifa nyeti kupitia njia salama iliyokubaliwa.',
    'Ask the provider for any case-specific checklist and explain what is unavailable and why.', 'Omba mtoa msaada atoe orodha maalumu ya shauri na eleza kinachokosekana na sababu.',
    'BASE-LEGAL-AID,PROC-EVIDENCE,BASE-PRIVACY', ['evidence','document','confidential'])
add('access_justice', 'I received a court summons or notice. What should I do?', 'Nimepokea wito au taarifa ya mahakama. Nifanye nini?',
    'Do not ignore it. Check authenticity, service date, hearing date and any required response with the court registry or an adviser.', 'Usiipuuze. Thibitisha uhalisi, tarehe ya kupokelewa, tarehe ya kusikilizwa na jibu linalohitajika kupitia masjala au mshauri.',
    'Keep the complete notice, envelope or delivery record and all related court papers.', 'Hifadhi taarifa yote, bahasha au kumbukumbu ya kufikishwa na nyaraka zote za mahakama zinazohusika.',
    'Verify the case reference through official court channels; do not use an unknown payment link in a message.', 'Thibitisha kumbukumbu ya shauri kupitia njia rasmi za mahakama; usitumie kiungo cha malipo kisichojulikana kwenye ujumbe.',
    'Seek legal help promptly about appearance, response, documents and any application if you cannot attend.', 'Tafuta msaada wa kisheria mapema kuhusu kufika, kujibu, nyaraka na ombi linalohitajika ikiwa huwezi kufika.',
    'PROC-CIVIL,CRIM-PROCEDURE,COURTS-MAGISTRATES', ['summons','service','appearance'])
add('access_justice', 'Can mediation resolve my dispute without a full court case?', 'Usuluhishi unaweza kutatua mgogoro bila shauri kamili mahakamani?',
    'Mediation can help some disputes, but suitability, consent and legal effect need checking. It should not replace urgent protection or be forced in an unsafe situation.', 'Usuluhishi unaweza kusaidia baadhi ya migogoro, lakini kufaa kwake, ridhaa na athari za sheria vihakikiwe. Usichukue nafasi ya kinga ya haraka au kulazimishwa katika hali isiyo salama.',
    'List the issues, documents, proposed outcomes and any power imbalance or safety concern.', 'Orodhesha masuala, nyaraka, suluhisho yanayopendekezwa na tofauti ya nguvu au hatari ya usalama.',
    'Ask who will mediate, what it costs, whether participation is voluntary and how a settlement would be recorded.', 'Uliza nani atasuluhisha, gharama, kama kushiriki ni kwa hiari na makubaliano yatarekodiwaje.',
    'Use a competent, appropriate mediation route and get advice before signing; preserve filing deadlines while discussions continue.', 'Tumia njia ya usuluhishi yenye uwezo na inayofaa na pata ushauri kabla ya kusaini; linda muda wa kufungua shauri wakati mazungumzo yanaendelea.',
    'ADR-ACCREDITATION,ADR-CONDUCT,WEB-TAWLA,CMA-PROCEDURE', ['mediation','consent','settlement'], 'Distinguish voluntary mediation from mandatory preliminary processes and criminal complaints.')
add('access_justice', 'I lost my case or missed a filing deadline. Is there any next step?', 'Nimeshindwa shauri au nimechelewa kuwasilisha. Kuna hatua nyingine?',
    'Appeal, review and extension of time are different remedies with different conditions. Seek prompt advice rather than assuming the case is automatically over or reopenable.', 'Rufaa, mapitio na kuongeza muda ni njia tofauti zenye masharti tofauti. Pata ushauri mapema badala ya kudhani shauri limekwisha au linafunguliwa tena moja kwa moja.',
    'Collect the decision, order, delivery date, service records and reasons for any delay.', 'Kusanya hukumu, amri, tarehe ya kutolewa, kumbukumbu za kufikishwa na sababu za kuchelewa.',
    'Record what you challenge and any missing documents; request the available certified record through the registry.', 'Andika unachopinga na nyaraka zinazokosekana; omba kumbukumbu iliyothibitishwa inayopatikana kupitia masjala.',
    'Ask an adviser which remedy, court and time limit applies; no appeal or late-filing success should be promised.', 'Muulize mshauri njia, mahakama na muda unaohusika; usitarajie ahadi ya kufanikiwa kwa rufaa au ombi la kuchelewa.',
    'PROC-APPEAL-PRINCIPAL,PROC-APPEAL-AMENDMENT-2024,PROC-APPEAL-AMENDMENT-2025,PROC-LIMITATION', ['appeal','extension','time'], 'Review the decision-specific appeal route; limitation provisions have judgment/amendment cautions.')
add('access_justice', 'I won a case but the other side has not complied. What can I do?', 'Nimeshinda shauri lakini upande mwingine hautekelezi. Nifanye nini?',
    'A judgment may require a separate enforcement process. Do not seize property or compel payment yourself.', 'Hukumu inaweza kuhitaji utaratibu tofauti wa utekelezaji. Usikamate mali au kulazimisha malipo mwenyewe.',
    'Keep the judgment, decree/order, payments received and known information relevant to compliance.', 'Hifadhi hukumu, amri, malipo yaliyopokelewa na taarifa zinazohusu utekelezaji.',
    'Check whether the order is enforceable and whether a stay, appeal or different enforcement procedure affects it.', 'Thibitisha kama amri inaweza kutekelezwa na kama kusimamishwa, rufaa au utaratibu tofauti unaathiri.',
    'Ask the court registry or legal adviser about the lawful execution/application process appropriate to that order.', 'Uliza masjala au mshauri kuhusu utaratibu halali wa utekelezaji au maombi unaofaa kwa amri hiyo.',
    'PROC-CIVIL,PROC-GOVERNMENT,BASE-MARRIAGE', ['execution','decree','order'], 'Government and maintenance orders may need special procedures.')
add('access_justice', 'My legal-aid referral was ignored or the service asked for an unexplained fee. What next?', 'Rufaa yangu ya msaada imepuuzwa au huduma imedai ada isiyoeleweka. Nifanye nini?',
    'Request a clear acceptance decision and fee explanation. A referral is not proof that the destination accepted or delivered assistance.', 'Omba uamuzi wazi wa kupokelewa na maelezo ya ada. Rufaa haithibitishi kuwa huduma imekubali au imetoa msaada.',
    'Keep referral details, appointment records, fee requests, receipts and contact attempts.', 'Hifadhi taarifa za rufaa, miadi, madai ya ada, risiti na majaribio ya mawasiliano.',
    'Ask the referring caseworker to follow up and clarify scope, costs and an alternative if the destination cannot assist.', 'Omba mhudumu aliyekutuma afuatilie na aeleze huduma, gharama na mbadala ikiwa huduma haiwezi kusaidia.',
    'Use the provider complaint process and ask legal aid about the appropriate registration/professional oversight route.', 'Tumia utaratibu wa malalamiko wa mtoa huduma na uliza msaada wa kisheria kuhusu usimamizi sahihi wa usajili au taaluma.',
    'BASE-LEGAL-AID,LEGAL-AID-SUPPLEMENT-2025,BASE-PRIVACY', ['complaint','provider','fees'], 'Confirm provider complaint and disciplinary channels; do not promise all assistance is free.')

add('zanzibar', 'I live in Zanzibar and need a birth or death certificate. Where do I apply?', 'Niko Zanzibar na nahitaji cheti cha kuzaliwa au kifo. Naomba wapi?',
    'Use the Zanzibar Civil Status Registration Agency route for the applicable Zanzibar event. Mainland RITA instructions are not automatically the correct process.', 'Tumia utaratibu wa Wakala wa Usajili wa Matukio ya Kijamii Zanzibar kwa tukio linalohusika Zanzibar. Maelekezo ya RITA ya Tanzania Bara si moja kwa moja utaratibu sahihi.',
    'Prepare event dates/places, identification, family details and existing registration or hospital records.', 'Andaa tarehe na mahali pa tukio, utambulisho, taarifa za familia na kumbukumbu za usajili au hospitali zilizopo.',
    'Identify whether you need first registration, late registration, a copy or a correction.', 'Tambua kama unahitaji usajili wa kwanza, uliochelewa, nakala au marekebisho.',
    'Check ZCSRA official portal/office requirements and current charges; keep the application reference.', 'Thibitisha mahitaji na gharama za sasa kwenye tovuti au ofisi rasmi ya ZCSRA; hifadhi kumbukumbu ya ombi.',
    'ZNZ-CIVIL-STATUS,WEB-ZCSRA', ['birth','death','registration'], 'Confirm event-location rules and current forms; no fee quoted.')
add('zanzibar', 'I have a land dispute in Zanzibar. Which route should I use?', 'Nina mgogoro wa ardhi Zanzibar. Nitumie njia ipi?',
    'Zanzibar land disputes require Zanzibar land-law and forum review. Do not use the Mainland tribunal pathway without checking jurisdiction.', 'Migogoro ya ardhi Zanzibar inahitaji ukaguzi wa sheria na chombo cha Zanzibar. Usitumie njia ya mabaraza ya Tanzania Bara bila kuhakiki mamlaka.',
    'Gather the land documents, location/shehia details, survey or allocation records and disputed decision.', 'Kusanya nyaraka za ardhi, eneo na shehia, kumbukumbu za upimaji au ugawaji na uamuzi unaopingwa.',
    'Identify whether the dispute concerns boundaries, title, allocation, occupation or an appeal.', 'Tambua kama mgogoro unahusu mipaka, umiliki, ugawaji, matumizi au rufaa.',
    'Ask Zanzibar legal aid or the appropriate Land Tribunal registry about current jurisdiction, procedure and any urgent application.', 'Uliza msaada wa kisheria Zanzibar au masjala inayofaa ya Mahakama ya Ardhi kuhusu mamlaka, utaratibu na ombi la haraka.',
    'ZNZ-LAND-TRIBUNAL-ASSEMBLY,ZNZ-LAND-AMENDMENT-2008,ZNZ-LAND-TENURE,WEB-ZNZ-LAND', ['jurisdiction','tribunal','land'], 'Principal and amendment identity/currentness plus tribunal contact access require review.')
add('zanzibar', 'I was dismissed or not paid in Zanzibar. Where do I seek labour help?', 'Nimefukuzwa au sijalipwa Zanzibar. Natafuta msaada wa kazi wapi?',
    'Use Zanzibar employment and labour-relations procedures. Mainland CMA forms and time limits should not be copied into this route.', 'Tumia taratibu za ajira na mahusiano ya kazi za Zanzibar. Fomu na muda wa CMA Tanzania Bara visitumike moja kwa moja hapa.',
    'Keep your employment evidence, dismissal notice, wage records and key dates.', 'Hifadhi ushahidi wa ajira, taarifa ya kufukuzwa, malipo na tarehe muhimu.',
    'Write the issue and desired remedy and request the employer decision or wage account if safe.', 'Andika tatizo na suluhisho unalotaka na omba uamuzi wa mwajiri au hesabu ya mshahara ikiwa ni salama.',
    'Ask a Zanzibar labour legal adviser or responsible labour office to confirm the current dispute-handling body, forms and deadline.', 'Muulize mshauri wa sheria za kazi Zanzibar au ofisi husika ya kazi athibitishe chombo cha sasa, fomu na muda wa kuwasilisha.',
    'ZNZ-EMPLOYMENT-GAZETTE,ZNZ-LABOUR-RELATIONS,WEB-ZLS', ['dispute','termination','commission'], 'Confirm current labour institution name and amendments; historical 2005 sources alone do not establish the latest procedure.')
add('zanzibar', 'I need divorce or marriage guidance in Zanzibar. Does the Kadhi court apply?', 'Nahitaji mwongozo wa talaka au ndoa Zanzibar. Mahakama ya Kadhi inahusika?',
    'The correct forum depends on the parties, subject and current Zanzibar law. Do not assume every family dispute belongs in the Kadhi court.', 'Chombo sahihi hutegemea wahusika, suala na sheria ya sasa ya Zanzibar. Usidhani kila mgogoro wa familia unahusu Mahakama ya Kadhi.',
    'Prepare marriage evidence, party details, children information and existing notices or orders.', 'Andaa ushahidi wa ndoa, taarifa za wahusika, watoto na taarifa au amri zilizopo.',
    'Identify whether you need divorce, maintenance, property, custody or urgent protection.', 'Tambua kama unahitaji talaka, matunzo, mali, malezi au kinga ya haraka.',
    'Ask Zanzibar family legal aid to confirm the competent court and applicable current rules before filing.', 'Uliza msaada wa sheria za familia Zanzibar uthibitishe mahakama na kanuni za sasa kabla ya kufungua shauri.',
    'ZNZ-KADHIS-2024,ZNZ-CHILD-GAZETTE,WEB-ZLS', ['jurisdiction','marriage','divorce'], 'Commencement and current post-2023 Kadhi procedure are unresolved; do not rely on older 2021 rules without reconciliation.')
add('zanzibar', 'A relative died in Zanzibar. How do we identify the inheritance process?', 'Ndugu amefariki Zanzibar. Tunatambuaje utaratibu wa mirathi?',
    'Identify the applicable succession law and competent Zanzibar forum before appointing or distributing informally. Do not assume Mainland probate forms apply.', 'Tambua sheria ya mirathi na chombo sahihi cha Zanzibar kabla ya uteuzi au mgao usio rasmi. Usidhani fomu za mirathi za Tanzania Bara zinahusika.',
    'Gather the death record, will, family details, asset locations and any court documents.', 'Kusanya kumbukumbu ya kifo, wosia, taarifa za familia, maeneo ya mali na nyaraka za mahakama.',
    'Preserve estate records and explain any religious-law, minor-beneficiary or cross-jurisdiction issue to the adviser.', 'Linda kumbukumbu za mirathi na eleza suala la sheria ya dini, watoto warithi au mali katika maeneo tofauti kwa mshauri.',
    'Seek Zanzibar succession legal aid to confirm the applicable forum, authority and objection process.', 'Tafuta msaada wa sheria za mirathi Zanzibar uthibitishe chombo, mamlaka na utaratibu wa pingamizi.',
    'ZNZ-KADHIS-2024,WEB-ZLS,WEB-ZLSC', ['inheritance','succession','jurisdiction'], 'Zanzibar non-Kadhi succession framework and current procedural rules remain acquisition gaps; this is triage guidance, not a full filing guide.')
add('zanzibar', 'My child needs maintenance or protection in Zanzibar. Where do I start?', 'Mtoto anahitaji matunzo au ulinzi Zanzibar. Nianzie wapi?',
    'Use Zanzibar child-law and welfare routes. A maintenance dispute and an immediate child-safety concern require different responses.', 'Tumia sheria za mtoto na njia za ustawi za Zanzibar. Mgogoro wa matunzo na hatari ya haraka kwa mtoto vinahitaji hatua tofauti.',
    'Keep birth details, care expenses, existing orders and relevant safety facts securely.', 'Hifadhi kwa usalama taarifa za kuzaliwa, gharama za malezi, amri zilizopo na taarifa za usalama.',
    'Identify the child immediate needs and whether urgent medical or protective assistance is required.', 'Tambua mahitaji ya mtoto ya sasa na kama msaada wa haraka wa afya au ulinzi unahitajika.',
    'Ask Zanzibar social welfare and child legal aid to confirm the appropriate court or protection route.', 'Uliza ustawi wa jamii na msaada wa sheria za watoto Zanzibar kuhusu mahakama au njia sahihi ya ulinzi.',
    'ZNZ-CHILD-GAZETTE,ZNZ-CHILD-COURT-RULES,WEB-ZLSC', ['maintenance','protection','children'], 'Verify Children Court rules identity/currentness and any Kadhi/Children Court interaction.', safety=True)
add('zanzibar', 'I need emergency protection or shelter in Zanzibar. How do I seek it safely?', 'Nahitaji ulinzi au makazi salama ya dharura Zanzibar. Nayatafutaje kwa usalama?',
    'Seek immediate safety and an assessed protection referral. No shelter place or admission can be promised from the current research directory.', 'Tafuta usalama wa haraka na rufaa ya ulinzi iliyochunguzwa. Orodha ya utafiti ya sasa haiwezi kuahidi nafasi au kupokelewa makazi salama.',
    'Keep existing incident details safely; identify a safe contact method and any children or medical needs.', 'Hifadhi taarifa za tukio kwa usalama; tambua njia salama ya mawasiliano na mahitaji ya watoto au afya.',
    'Seek in-person police/medical or social-welfare help if danger is immediate; avoid exposing a confidential location.', 'Tafuta msaada wa polisi, afya au ustawi wa jamii ana kwa ana ikiwa hatari ni ya haraka; epuka kufichua eneo la siri.',
    'Ask a responsible Zanzibar safeguarding professional to confirm admission eligibility, current capacity and safe transport before travel.', 'Omba mtaalamu wa ulinzi Zanzibar athibitishe vigezo vya kupokelewa, nafasi ya sasa na usafiri salama kabla ya safari.',
    'ZNZ-CHILD-GAZETTE,ZNZ-PENAL-2018,WEB-ZLSC', ['protection','violence','child'], 'Adult shelter directory, emergency contacts and confirmed admission arrangements remain missing.', safety=True)
add('zanzibar', 'I cannot afford a lawyer in Zanzibar. How do I find the right legal-aid provider?', 'Siwezi kumudu wakili Zanzibar. Napataje mtoa msaada sahihi?',
    'Use Zanzibar provider information and confirm the provider current registration, service scope and intake. A register entry does not guarantee representation.', 'Tumia taarifa za watoa msaada Zanzibar na thibitisha usajili wa sasa, huduma na kupokelewa. Kuwepo kwenye orodha hakuhakikishi uwakilishi.',
    'Prepare a short summary, district/shehia, key dates, documents and desired assistance.', 'Andaa maelezo mafupi, wilaya na shehia, tarehe muhimu, nyaraka na msaada unaohitaji.',
    'Check whether the provider handles your issue and island/location and whether any fees or conditions apply.', 'Thibitisha kama mtoa msaada anashughulikia suala, kisiwa au eneo lako na kama kuna ada au masharti.',
    'Use the Zanzibar register and confirmed ZLSC/ZLS or other appropriate provider contacts; obtain an acceptance or onward-referral decision.', 'Tumia orodha ya Zanzibar na mawasiliano yaliyothibitishwa ya ZLSC, ZLS au mtoa msaada mwingine anayefaa; pata uamuzi wa kupokelewa au rufaa nyingine.',
    'ZNZ-PROVIDER-LIST,WEB-ZLSC,WEB-ZLS', ['registration','legal aid','provider'], 'Acquire/reconcile the Zanzibar Legal Aid Act and regulations; catalogue Act-number conflict and current registry completeness remain unresolved.')

def write_json(name, obj):
    (OUT / name).write_text(json.dumps(obj, indent=2, ensure_ascii=False) + '\n')

counts = Counter(g['categoryKey'] for g in GUIDES)
assert len(GUIDES) == 72 and all(counts[k] == 8 for k in CATEGORIES)
assert len({g['id'] for g in GUIDES}) == 72
assert len({g['appFieldsDraft']['titleEn'] for g in GUIDES}) == 72
assert len({g['appFieldsDraft']['titleSw'] for g in GUIDES}) == 72
for g in GUIDES:
    f = g['appFieldsDraft']
    assert len(f['stepsEn']) == len(f['stepsSw']) == 4
    assert all(len(s.strip()) >= 8 for s in f['stepsEn'] + f['stepsSw'])
    assert f['sourceUrl'].startswith('https://')
    assert g['productionEligible'] is False and g['reviewDueAt'] is None

write_json('guide-drafts.json', {'preparedOn': '2026-10-07', 'total': 72,
    'status': 'local_original_bilingual_review_drafts_not_uploaded',
    'categories': [{'key': k, 'titleEn': v[0], 'titleSw': v[1], 'count': counts[k]} for k,v in CATEGORIES.items()],
    'appCompatibility': 'Existing title/summary/steps/category/jurisdiction/source/publisher fields are prepared. reviewDueAt is deliberately unset. No author, reviewer, approval or upload has been fabricated.',
    'guides': GUIDES})
all_sources = {}
for g in GUIDES:
    for s in [g['primarySource'], *g['supportingSources']]:
        if s['id'] not in all_sources:
            all_sources[s['id']] = {**s, 'usedBy': []}
        all_sources[s['id']]['usedBy'].append(g['id'])
write_json('source-register.json', {'checkedOn': '2026-10-07',
    'note': 'Web observations and existing acquired law copies are distinguished. Sources support review; currentness is not certified.',
    'sources': list(all_sources.values()), 'selectionEvidence': source('WEB-LHRC-DEMAND', [])})

with (OUT / 'question-plan.csv').open('w', newline='') as file:
    fields = ['id','category','jurisdiction','priority','questionEn','questionSw','primarySource','additionalSources','publicationBlockers']
    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()
    for g in GUIDES:
        f = g['appFieldsDraft']
        writer.writerow({'id': g['id'], 'category': f['category'], 'jurisdiction': f['jurisdiction'],
            'priority': g['priority'], 'questionEn': f['titleEn'], 'questionSw': f['titleSw'],
            'primarySource': f['sourceUrl'], 'additionalSources': ' | '.join(s['url'] for s in g['supportingSources']),
            'publicationBlockers': ' | '.join(g['publicationBlockers'])})

index = ['# Know Your Rights — 72-question preparation plan', '',
    'Eight original bilingual review drafts per proposed category. These are useful everyday questions, not a measured national top-72 ranking. Nothing has been uploaded or approved.', '',
    'The app derives category choices from approved guides; it has no fixed Know Your Rights category enum. These nine category names are a proposed editorial taxonomy. They do not automatically change intake or matching issue categories.', '',
    'Selection evidence: LHRC’s 2024 legal-aid announcement reports land (58%), family (14%) and labour (10%) as its largest case groups. This is LHRC-specific data. Official registration/regulator FAQs informed additional practical topics.', '',
    '[LHRC selection evidence](https://lhrc.humanrights.or.tz/sw/news-events/LHRC_2024_LEGAL_AID)', '']
full = ['# Bilingual draft guidance — private legal review', '',
    '72 original English/Kiswahili drafts. All remain unsubmitted and ineligible for publication. Source page matches are candidate locators, not confirmed legal citations. Review the full referenced passage, current amendments and language before approval.', '']
for key, (en, sw) in CATEGORIES.items():
    index += ['## ' + en + ' / ' + sw, '']
    for g in [x for x in GUIDES if x['categoryKey'] == key]:
        f = g['appFieldsDraft']
        index.append(f"- **{g['id']}** — {f['titleEn']} / {f['titleSw']}")
        full += [f"## {g['id']} — {f['titleEn']}", '', '**Scope:** ' + f['jurisdiction'], '',
            '**English**', '', f['summaryEn'], '', *[f'{i}. {s}' for i,s in enumerate(f['stepsEn'],1)], '',
            '**Kiswahili — ' + f['titleSw'] + '**', '', f['summarySw'], '', *[f'{i}. {s}' for i,s in enumerate(f['stepsSw'],1)], '',
            '**Sources for review**', '', *[f"- [{s['title']}]({s['url']})" for s in [g['primarySource'], *g['supportingSources']]], '',
            '**Publication blockers:** ' + '; '.join(g['publicationBlockers']), '']
    index.append('')
(OUT / 'QUESTION-PLAN.md').write_text('\n'.join(index) + '\n')
(OUT / 'BILINGUAL-GUIDANCE-DRAFTS.md').write_text('\n'.join(full) + '\n')
write_json('validation.json', {'total':len(GUIDES), 'byCategory':dict(counts), 'bilingualTitlePairs':72,
    'bilingualSummaryPairs':72, 'stepsPerLanguagePerGuide':4, 'distinctSources':len(all_sources),
    'uploaded':0, 'approved':0, 'productionEligible':0,
    'scope': 'Structural and provenance validation only; not a legal accuracy or language certification.'})

notes = '''# Review and publication plan

## Deliverables

72 original bilingual guide drafts across nine proposed categories, eight per category. Every draft includes a direct everyday question, short answer, evidence preparation, practical first action, route to seek help, follow-up/safety instruction, scope and sources. JSON maps to existing guide fields; CSV and Markdown make editorial review easier.

## What the research establishes

Land, family and labour are justified first priorities by LHRC-specific legal-aid demand. Official civil-registration and regulator FAQs support practical document, money and service-complaint questions. Selection is an editorial recommendation; question-level national popularity has not been measured.

## What remains unverified

All 72 require legal and Kiswahili review. The old source pack has unresolved amendment/commencement, extraction and identity issues; a local copy is not proof of current law. New web research includes publisher search extracts and failed direct opens, explicitly distinguished in the register. Keyword page locators do not constitute verified section citations. Exact deadlines and fees are unset; reviewers should add only verified, case-appropriate details. These drafts must not be described as already legally approved, latest, complete or uploaded.

RITA old FAQ and current portal publish differing fees. Bank complaint guidance includes newer 2025 guidelines alongside older rules. Zanzibar employment sources are historical; current labour procedures need confirmation. Zanzibar Kadhi commencement/current rules and non-Kadhi succession coverage need reconciliation. NIDA precise correction/replacement requirements remain unacquired. Shelter admission, emergency contacts and current capacity require direct partner confirmation.

## First review wave

Review the first four drafts in employment, land/housing, family/children, safety/criminal and access-to-justice first (20 drafts). Review remaining topics and Zanzibar-specific routes with appropriate specialists. A reviewer may split a broad question into narrower guides rather than publish an uncertain route.

## Publication workflow

1. Check full source passages, identify sections and current amendments, and confirm the named institution/form.
2. Verify the first step is feasible and does not delay urgent care, protection or filing.
3. Review Kiswahili and English together, including legal terms and equivalent meaning.
4. Assign a source-review due date and submit using an authenticated content-editor/admin account.
5. A different administrator reviews and approves under the existing app process.
6. Test category/language display, expired-guide hiding and request-help routing.

No automated backend submission has been prepared: missing dates and review findings should not be bypassed. The existing app supports one displayed primary source, while drafts retain multiple sources. Preserve the supporting-source audit outside the current public schema until a deliberate UI/model change exposes it.

## Review questions for every draft

Does this apply in Mainland Tanzania or Zanzibar? Which institution has jurisdiction? Is the source current? Is an urgent deadline mentioned correctly? Are fees and required forms verified? Could these steps expose someone to danger? Is there a confirmed alternative when the provider is unavailable? Do both languages mean the same thing? Can an ordinary person understand the next action?
'''
(OUT / 'REVIEW-AND-PUBLICATION.md').write_text(notes)
print(json.dumps({'guides':len(GUIDES), 'categories':dict(counts), 'sources':len(all_sources), 'uploaded':0, 'approved':0}))
