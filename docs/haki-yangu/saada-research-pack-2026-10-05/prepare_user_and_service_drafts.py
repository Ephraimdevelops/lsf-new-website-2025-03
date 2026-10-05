"""Original bilingual preparation guidance and public-provider review candidates."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SW={
'P01':'Eleza tatizo, eneo ulipo na kama kuna tarehe ya mahakama. Chagua njia salama ya mawasiliano. Mtoa huduma atahitaji kuthibitisha aina ya msaada, vigezo na uwezo wake; kuwa na nyaraka si sharti la kuanza kuomba msaada.',
'P02':'Kwanza tathmini kama ni salama kuzungumza au kutumia kifaa hiki. Eleza kama kuna hatari ya sasa, jeraha au mtoto anayehusika. Hifadhi ushahidi tu ikiwa kufanya hivyo ni salama. Njia ya huduma ya dharura au rufaa lazima ithibitishwe na mhudumu aliyefundishwa.',
'P03':'Eleza mahali pa ndoa na makazi, aina ya ndoa, watoto, mali na kama kuna ukatili. Andaa cheti au ushahidi wa ndoa, taarifa za mali na amri zilizopo ikiwa unazo. Njia ya talaka, matunzo au mali itachaguliwa baada ya kuthibitisha sheria na mamlaka husika.',
'P04':'Eleza umri na eneo la mtoto, mpangilio wa malezi, mahitaji ya matunzo na amri zilizopo. Andaa ushahidi wa uzazi na matumizi ya mtoto ikiwa upo. Mtaalamu atatathmini usalama, sheria husika na njia ya kushughulikia au kutekeleza amri.',
'P05':'Eleza hatari, eneo na umri wa mtoto bila kuchapisha taarifa zinazomtambulisha. Taja kama kuna mtu mzima salama wa kusaidia. Mhudumu wa ulinzi wa mtoto atahitaji kutathmini hatua za usalama, ridhaa na wajibu wa taarifa kulingana na sheria inayotumika.',
'P06':'Eleza umri, eneo na kama ndoa imepangwa au imeshafanyika. Taja vitisho na njia salama ya mawasiliano. Andaa ushahidi wa umri ikiwa upo. Mtaalamu lazima athibitishe sheria na athari za maamuzi ya mahakama kabla ya kutoa hatua za kisheria.',
'P07':'Eleza eneo halisi la ardhi, kama ni ardhi ya kijiji, aina ya mgogoro na mashauri yaliyotangulia. Andaa hati, CCRO, makubaliano, ramani au maamuzi ikiwa unayo. Mamlaka ya baraza au mahakama itahitaji kuthibitishwa kabla ya kuelekezwa kufungua shauri.',
'P08':'Eleza eneo, aina ya upangaji, notisi uliyopokea na tarehe ya kupokea. Taja kufungiwa nje au vitisho. Andaa mkataba, risiti na mawasiliano ikiwa yapo. Usalama na hatua zinazohitaji uharaka vitathminiwe kabla ya kuchagua njia ya mgogoro.',
'P09':'Eleza mamlaka iliyotoa notisi, eneo la ardhi na hatua ya utwaaji. Andaa notisi, uthamini, ofa ya fidia na kumbukumbu za malipo ikiwa zipo. Tarehe za notisi na upokeaji zinahitaji kutofautishwa; mtaalamu atathibitisha njia na muda wa kupinga.',
'P10':'Eleza eneo, tarehe ya kifo, wosia, mali, madeni, wategemezi na kama msimamizi ameteuliwa. Andaa ushahidi wa kifo na amri zilizopo ikiwa upo. Sheria ya mirathi, mamlaka na fomu zinazotumika zinahitaji kuthibitishwa kwa hali husika.',
'P11':'Eleza mahakama iliyotoa amri ya usimamizi, kitendo kinachopingwa na mali iliyo hatarini. Andaa amri, orodha ya mali, hesabu na notisi ikiwa zipo. Mtaalamu atatathmini uwezo wa kuwasilisha pingamizi, hatua za kulinda mali na njia ya mapitio au rufaa.',
'P12':'Eleza Tanzania Bara au Zanzibar, aina ya ajira, sekta na tarehe ya kufukuzwa au tukio. Andaa mkataba, hati ya kufukuzwa, mishahara na mawasiliano ikiwa yapo. Mtaalamu atathibitisha kama njia ni CMA, mahakama, utumishi wa umma au utaratibu wa Zanzibar pamoja na fomu na muda.',
'P13':'Eleza tarehe na eneo la ajali, mwajiri, aina ya kazi na kama taarifa au madai yamewasilishwa. Andaa taarifa za matibabu na tukio ikiwa zipo. Ustahiki wa mfuko, taarifa zinazohitajika na njia ya kupinga uamuzi lazima zithibitishwe.',
'P14':'Taja mfuko, aina ya mafao na uamuzi unaopingwa. Namba ya mwanachama ihifadhiwe katika njia salama. Andaa taarifa ya michango, mawasiliano na uamuzi ikiwa zipo. Mtaalamu atathibitisha sheria ya mfuko, utaratibu wa malalamiko na nyaraka za madai.',
'P15':'Eleza mahali mtu alipozuiliwa, kituo au mahakama, tuhuma na tarehe inayofuata. Andaa notisi au namba ya shauri ikiwa ipo. Hatua za haraka na masharti ya dhamana yanahitaji mtaalamu; usiahidi kuachiwa au kiasi cha dhamana.',
'P16':'Eleza aina ya kosa, vitisho na kama taarifa imetolewa. Chagua njia salama ya mawasiliano. Hifadhi ushahidi uliopatikana kwa njia halali ikiwa ni salama. Ulinzi wa shahidi, usiri na hatua za taarifa lazima zitathminiwe; kutotambulika hakuahidiwi.',
'P17':'Andaa uamuzi kamili, mahakama au baraza lililoutoa, tarehe ya uamuzi na tarehe ya kuupokea. Taja shauri lilivyoanzia na hatua zilizochukuliwa. Mtaalamu atathibitisha njia ya rufaa, mapitio au marejeo na chanzo sahihi cha kuhesabu muda.',
'P18':'Eleza aina ya shauri, mamlaka husika na ada au gharama unayoombwa. Andaa taarifa ya ada na hali ya kipato kwa njia salama ikiwa inahitajika. Msamaha, msaada wa gharama na ustahiki vinahitaji uthibitisho; huduma zote haziahidiwi kuwa bila malipo.',
'P19':'Eleza dai, upande unaodaiwa, kiasi, eneo na hatua zilizotangulia. Andaa makubaliano, risiti na mawasiliano ikiwa yapo. Mtaalamu atachunguza kama shauri linatimiza masharti ya madai madogo na halimo katika makundi yaliyotengwa.',
'P20':'Eleza aina ya madai, pande, eneo, kiasi na notisi au tarehe iliyopo. Andaa makubaliano, malipo, madai ya awali na majibu ikiwa yapo. Njia ya mahakama, nyaraka, uwasilishaji na muda zitathibitishwa kwa aina ya shauri.',
'P21':'Eleza hatua ya shauri, mahakama na kama una akaunti au unahitaji msaada wa kufungua mtandaoni. Taja nyaraka ulizo nazo na ugumu wa kutumia mfumo. Masharti, njia mbadala na huduma ya usaidizi lazima zithibitishwe kabla ya kutuma hati.',
'P22':'Taja taasisi ya fedha, aina ya huduma, tukio na hatua ya malalamiko. Namba za akaunti na miamala ziwekwe katika njia salama. Andaa risiti, masharti na majibu ya taasisi ikiwa yapo. Njia ya BOT itathibitishwa kulingana na huduma na hatua iliyofikiwa.',
'P23':'Taja mtoa huduma, tatizo la simu, intaneti au posta, tarehe na namba ya malalamiko. Andaa bili, risiti na majibu ikiwa yapo. Malalamiko ya maudhui yanaweza kuwa na njia na wigo tofauti; mtaalamu atathibitisha sheria na utaratibu wa TCRA.',
'P24':'Eleza eneo, mtoa huduma wa maji au umeme, bili au notisi ya kukatiwa na hatua za malalamiko. Taja hatari ya usalama. Andaa risiti, notisi na majibu ikiwa yapo. Mamlaka ya mdhibiti, ikiwemo tofauti za Tanzania Bara na Zanzibar, lazima ithibitishwe.',
'P25':'Eleza bidhaa au huduma, muuzaji, tarehe ya kununua, tatizo na suluhisho unalotaka. Andaa risiti, mkataba, dhamana na majibu ikiwa yapo. Mtaalamu atachunguza kama njia ni FCC, mdhibiti wa sekta au shauri la madai.',
'P26':'Eleza nani ametumia taarifa, taarifa gani na madhara bila kuweka taarifa nyeti katika mazungumzo ya umma. Andaa taarifa ya faragha, ridhaa au majibu yaliyofichwa taarifa binafsi ikiwa yapo. Sheria inayotumika na njia ya PDPC zinahitaji uthibitisho.',
'P27':'Eleza kama unahitaji usajili mpya, wa kuchelewa, nakala au marekebisho ya kuzaliwa au kifo. Taja eneo na kumbukumbu iliyopo. Andaa cheti au taarifa za tukio ikiwa zipo. RITA au mamlaka ya Zanzibar itahitaji kuthibitisha fomu, ushahidi mbadala na ada ya huduma husika.',
'P28':'Eleza huduma au ajira, tukio la ubaguzi, eneo na marekebisho unayohitaji ili kupata huduma. Andaa uamuzi au mawasiliano ikiwa yapo bila kukusanya taarifa za matibabu zisizohitajika. Njia inayofikika na tiba ya kisheria zitathibitishwa.',
'P29':'Taja mamlaka, uamuzi, tarehe, madhara na njia za malalamiko zilizotumika. Andaa uamuzi, notisi na mawasiliano ikiwa yapo. Mtaalamu atatofautisha malalamiko ya kiutawala, mapitio ya mahakama na shauri la haki za msingi.',
'P30':'Eleza mamlaka, eneo, tukio na hatari ya kulipiziwa kisasi kwa njia salama. Hifadhi ushahidi uliopatikana halali tu. Njia ya PCCB au ZAECA na ulinzi unaoweza kuombwa lazima zithibitishwe; usiri kamili au kutotambulika hakuahidiwi.',
'P31':'Eleza eneo, hadhi inayohusika, kizuizi au notisi ya kuondolewa na tarehe iliyopo. Taja mtoto au mahitaji ya usalama. Andaa hati na uamuzi ikiwa ni salama. Mtaalamu wa uhamiaji au ukimbizi atathibitisha njia na huduma zinazofaa.',
'P32':'Eleza kama tatizo ni hitaji la matibabu ya haraka au malalamiko ya kisheria kuhusu faragha, ubaguzi au huduma. Taja eneo na uamuzi bila kuweka utambuzi wa afya hadharani. Njia ya afya, ajira au faragha itathibitishwa kwa suala husika.',
'P33':'Eleza eneo, shughuli au uchafuzi, tarehe na madhara. Taja hatari ya sasa na malalamiko yaliyotolewa. Andaa picha zilizopatikana salama, notisi au kibali cha umma ikiwa kipo. Sheria ya mazingira, mamlaka na njia ya kupinga zitathibitishwa.',
'P34':'Eleza mgogoro, eneo, mashauri yaliyopo na kama kushiriki kwa hiari ni salama. Taja ukatili, vitisho au tofauti ya nguvu. Andaa makubaliano ikiwa yapo. Mtaalamu atatathmini kufaa kwa usuluhishi, mamlaka, utekelezaji na athari kwa muda wa madai.'}

def main():
    paths=json.loads((ROOT/'legal-pathways.json').read_text())['pathways'];assert set(SW)=={p['id'] for p in paths}
    drafts=[]
    for p in paths:
        en='To prepare for help with '+p['titleEn'].lower()+', explain: '+'; '.join(p['intakeQuestions'])+'. If available, prepare: '+'; '.join(p['documentsIfAvailable'])+'. A reviewer must confirm the applicable route, required forms, deadline triggers, fees and suitable provider. Missing documents should not automatically prevent initial assistance.'
        drafts.append(dict(id='GUIDANCE-'+p['id'],pathwayId=p['id'],titleEn=p['titleEn'],titleSwDraft=p['titleSwDraft'],preparationEnDraft=en,preparationSwDraft=SW[p['id']],sourceIds=p['sourceIds'],sourceUse='Source bundle for reviewer; paragraphs are original preparation guidance, not translations of laws or approved procedural directions.',legalAdviceApproved=False,translationReviewed=False,productionEligible=False,approvalStatus='not_submitted'))
    (ROOT/'bilingual-preparation-review.json').write_text(json.dumps(dict(status='original_unreviewed_bilingual_drafts',drafts=drafts),ensure_ascii=False,indent=2)+'\n')
    md=['# Bilingual preparation guidance — review drafts','','34 original English and Kiswahili preparation drafts. These are not literal translations of each other or of the source laws. Legal, language, accessibility and operational reviewers must approve both versions. Exact legal instructions remain unresolved.','']
    for d in drafts: md += ['## '+d['pathwayId']+' — '+d['titleEn'],'',d['preparationEnDraft'],'',d['preparationSwDraft'],'','Reviewer source bundle: '+', '.join(d['sourceIds']), '']
    (ROOT/'BILINGUAL-PREPARATION-REVIEW.md').write_text('\n'.join(md))
    sources=json.loads((ROOT/'source-register.json').read_text())['sources']; byid={s['id']:s for s in sources}
    providerRows=[
       ('PROVIDER-LHRC-KINONDONI','LHRC','Kinondoni','SERVICES-LHRC',['+255717143784','+255683169400'],'lhrckinondoni@humanrights.or.tz','Isere Street House660','Multiple numbers; provider confirmation required.'),
       ('PROVIDER-LHRC-ARUSHA','LHRC','Arusha','SERVICES-LHRC',['+255782277569','+255626281245','+255626281244'],'lhrcarusha@humanrights.or.tz','Sakina kwa Idd / Olerian Street / Olosiva Area','Different phone/address variants within page; do not silently choose one.'),
       ('PROVIDER-LHRC-DODOMA','LHRC','Dodoma','SERVICES-LHRC',['+255262350050','+255678933155','+255655444828'],'lhrcdodoma@humanrights.or.tz','Chimuli Street Plot20 AreaD','Different contact numbers in main and footer clinic sections.'),
       ('PROVIDER-TAWLA','TAWLA','Multiple offices','SERVICES-TAWLA-CONTACT',['0800110017','0800751010','+255712343717'],None,'Dar es Salaam and regional offices','Service page names five regions while contact page also names Mbeya; head-office address variants and Tanga +225 prefix require confirmation. Hotlines are public service-page candidates.'),
       ('PROVIDER-WLAC','WLAC','Dar es Salaam','SERVICES-WLAC',['+255222664051'],'wlac@wlac.or.tz',None,'Opening hours and programme claims need confirmation; testimonials are not proof of case acceptance or shelter availability.'),
       ('PROVIDER-ZLSC','ZLSC','Zanzibar','SERVICES-ZLSC',['+255654416250'],'info@zlsc.or.tz','House33 Karume Road Kijangwani','Public free-legal-aid statement; exact scope, current hours, Pemba office and registration require confirmation.'),
       ('PROVIDER-TLS','TLS','Dar es Salaam / chapter offices','SERVICES-TLS',[],None,'Wakili House','Public legal-aid unit and chapter service description; obtain chapter-specific verified contacts, fees and capacity.')]
    candidates=[]
    for sid,name,office,source,phones,email,address,caution in providerRows:
        assert source in byid
        candidates.append(dict(id=sid,organisation=name,officeDraft=office,sourceIds=[source],sourceUrl=byid[source]['recordUrl'],phonesObserved=phones,emailObserved=email,addressObserved=address,observedOn='2026-10-05',caution=caution,registrationVerified=False,providerContacted=False,availabilityConfirmed=False,verifiedServiceArea=None,verifiedHours=None,verifiedEligibility=None,verifiedFees=None,verifiedLanguages=None,verifiedAccessibility=None,referralAgreement=None,verificationDate=None,reviewDueAt=None,approvalStatus='not_submitted',productionEligible=False))
        if name=='TAWLA': candidates[-1]['sourceIds'].append('SERVICES-TAWLA')
        if name=='TLS': candidates[-1]['evidenceCaution']='Saved static HTML contains only the title; full service description was observed in web search. Require rendered-page capture or provider confirmation.'
    (ROOT/'provider-candidates-review.json').write_text(json.dumps(dict(status='public_discovery_only_not_live_directory',candidates=candidates),ensure_ascii=False,indent=2)+'\n')
    print('Prepared34 bilingual drafts and7 public-provider review candidates; no approvals or communications.')
if __name__=='__main__':main()
