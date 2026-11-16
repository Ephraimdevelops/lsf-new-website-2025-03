// Publisher website content, kept separate from legal evidence and operational referrals.
// Primary publisher sources checked 2026-11-16. A retrieval date is not a
// publication date or confirmation of live staffing, capacity or network totals.
export const LSF_TOPIC_SOURCES = {
 overview:'https://lsftz.org/about',history:'https://lsftz.org/about',work:'https://lsftz.org/about',
 contact:'https://lsftz.org/contact',leadership:'https://lsftz.org/secretariat',
 strategy:'https://www.lsftz.org/Publicationsfiles/LSF%20STRATEGIC%20PLAN%202022-2026%20%281%29.pdf',
 network:'https://lsftz.org/reportsfiles/LSF-Annual-ReportWeb-2%20%281%29.pdf'
} as const;
export type LsfTopic=keyof typeof LSF_TOPIC_SOURCES;
export function lsfTopicSource(topic?:string){return LSF_TOPIC_SOURCES[topic as LsfTopic]??LSF_TOPIC_SOURCES.overview;}
export const LSF_INFORMATION = {
 name:'Legal Services Facility (LSF)',checkedOn:'2026-11-16',kind:'publisher_information',
 overview:{en:'LSF is a Tanzanian non-profit working on access to justice and legal empowerment.',sw:'LSF ni shirika lisilo la faida nchini Tanzania linalofanya kazi katika upatikanaji wa haki na uwezeshaji wa kisheria.'},
 history:{en:'The published LSF website describes its launch in 2011 as a national basket-fund mechanism for legal empowerment, and its evolution from grant-maker towards direct implementation.',sw:'Tovuti ya LSF inaeleza kuwa ilianzishwa mwaka 2011 kama mfuko wa pamoja wa kitaifa wa uwezeshaji wa kisheria, na imepanua kazi kutoka utoaji wa ruzuku kuelekea utekelezaji wa moja kwa moja.'},
 work:{en:'Its published work includes legal empowerment, support for legal-aid and paralegal networks, capacity building and advocacy for equal access to justice. Its website describes a vision of meaningful access to justice and the ability to claim rights.',sw:'Kazi zake zilizochapishwa zinahusisha uwezeshaji wa kisheria, kusaidia mitandao ya msaada wa kisheria na wasaidizi wa kisheria, kujenga uwezo na utetezi wa upatikanaji sawa wa haki. Dira iliyoelezwa kwenye tovuti ni watu kupata haki kwa maana halisi na kudai haki zao.'},
 contact:{address:'Chole Road, Masaki, Dar es Salaam, Tanzania',phone:'+255 22 260 1534',email:'info@lsftz.org',sourceUrl:'https://lsftz.org/contact'},
 leadership:{name:"Lulu Ng’wanakilala",publishedRole:'Executive Director',sourceUrl:LSF_TOPIC_SOURCES.leadership,publicationDate:null,note:'Named on the LSF Secretariat page; this undated page is not a live staff roster.'},
 strategy:{period:'2022–2026',sourceUrl:LSF_TOPIC_SOURCES.strategy,publicationYear:2021,note:'Published strategy for this period, not confirmation of a successor strategy or current project availability.'},
 network:{reportYear:2021,sourceUrl:LSF_TOPIC_SOURCES.network,note:'The annual report describes direct funding to paralegals and over 200 partners. Partners are not individual paralegals. No verified current total of active individual paralegals is held in this profile; do not infer it from partner counts, old reports or the app directory.'},
 sources:[{title:'LSF About',url:'https://lsftz.org/about'},{title:'LSF Contact',url:'https://lsftz.org/contact'}],
 limits:'This profile does not establish current opening hours, intake, individual staff availability, current programme budgets, impact totals, service eligibility, appointment confirmation or an LSF referral agreement. Do not infer these from historic website statements.'
} as const;
export function lsfInformationReply(locale?:'en'|'sw',topic?:string){
 const language=locale==='en'?'en':'sw';const en=language==='en';
 if(topic==='leadership')return (en?"LSF’s Secretariat page names Lulu Ng’wanakilala as Executive Director. The page is undated, so I cannot confirm a more recent leadership change from that page alone.":"Tovuti ya LSF inamtaja Lulu Ng’wanakilala kama Mkurugenzi Mtendaji. Ukurasa huo hauna tarehe ya taarifa, hivyo siwezi kuthibitisha kama kuna mabadiliko mapya zaidi.")+`\n\n[LSF](${lsfTopicSource(topic)})`;
 if(topic==='network')return (en?"LSF works with paralegal networks, but I do not have a verified current total of individual paralegals. Its 2021 annual report refers to over 200 partners; that is a historical partner count, not today’s paralegal total or the number available in this app.":"LSF inafanya kazi na mitandao ya wasaidizi wa kisheria, lakini sina jumla ya sasa iliyothibitishwa ya wasaidizi hao. Ripoti ya 2021 inataja washirika zaidi ya 200; hao si idadi ya wasaidizi wa kisheria wala idadi inayopatikana kwenye app leo.")+`\n\n[LSF Annual Report 2021](${lsfTopicSource(topic)})`;
 if(topic==='strategy')return (en?"LSF has a published strategic plan covering 2022–2026. It guides its work on access to justice and legal empowerment. This document does not confirm a newer strategy or which projects are currently accepting requests.":"LSF ina mpango mkakati uliochapishwa wa 2022–2026, unaoongoza kazi zake za upatikanaji wa haki na uwezeshaji wa kisheria. Hati hii haithibitishi mpango mpya zaidi au miradi inayopokea maombi kwa sasa.")+`\n\n[LSF Strategic Plan 2022–2026](${lsfTopicSource(topic)})`;
 const parts:string[]=topic==='history'?[LSF_INFORMATION.history[language]]:topic==='work'?[LSF_INFORMATION.work[language]]:topic==='contact'?[]:[LSF_INFORMATION.overview[language]];
 if(topic==='contact')parts.push(en?`LSF's published office contact is ${LSF_INFORMATION.contact.address}. Phone: ${LSF_INFORMATION.contact.phone}; email: ${LSF_INFORMATION.contact.email}. Please confirm hours and whether the office can help before travelling. This is office information, not a booked appointment or paralegal assignment.`:`Mawasiliano ya ofisi yaliyochapishwa ni ${LSF_INFORMATION.contact.address}. Simu: ${LSF_INFORMATION.contact.phone}; barua pepe: ${LSF_INFORMATION.contact.email}. Thibitisha muda wa kazi na msaada unaopatikana kabla ya kwenda. Hizi ni taarifa za ofisi, si miadi iliyowekwa wala kuunganishwa na msaidizi wa kisheria.`);
 return parts.join('\n\n')+`\n\n[${en?'LSF website':'Tovuti ya LSF'}](${topic==='contact'?LSF_INFORMATION.contact.sourceUrl:LSF_INFORMATION.sources[0].url})`;
}

// Route bounded publisher questions separately from legal retrieval. Do not turn
// an LSF mention inside a person's legal problem into a generic organisation FAQ.
export function lsfInformationTopic(message:string):LsfTopic|undefined {
 const text=message.toLowerCase().replace(/[’']/g," ");
 if(!/\b(lsf|legal services facility)\b/.test(text))return;
 if(/\b(ceo|chief executive|executive director|mkurugenzi|mtendaji|uongozi|leadership)\b/.test(text))return 'leadership';
 if(/\b(how many|wangapi|idadi|network|mtandao|mitandao)\b/.test(text)&&/\b(paralegals?|wasaidizi|washirika|partners?|network|mtandao|mitandao)\b/.test(text))return 'network';
 if(/\b(strategy|strategic|mkakati|mwelekeo|direction)\b/.test(text))return 'strategy';
 if(/\b(my case|my request|my land|my employer|my tenant|court|deadline|eviction|tenant|unpaid|wages|salary|divorce|inheritance|mshahara|talaka|mirathi|kesi yangu|ombi langu|ardhi yangu|mwajiri wangu|mahakama|budget|funding|million|billion|how many|wangapi|bajeti)\b/.test(text))return;
 if(/\b(office|offices|contact|address|phone|email|ofisi|mawasiliano|simu|barua pepe)\b/.test(text))return 'contact';
 if(/\b(history|founded|established|historia|ilianzishwa|ilianza)\b/.test(text))return 'history';
 if(/\b(mission|vision|work|does lsf do|kazi|shughuli|inafanya|dira|dhima)\b/.test(text))return 'work';
 if(/\b(who is|what is|what s|tell me about|ni nini|ni nani|kuhusu lsf)\b/.test(text))return 'overview';
}
