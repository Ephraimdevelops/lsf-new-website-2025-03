// Publisher website content, kept separate from legal evidence and operational referrals.
// Sources: the owner's About/Contact pages in this repository. No live staffing or capacity claims.
export const LSF_INFORMATION = {
 name:'Legal Services Facility (LSF)',checkedOn:'2026-11-16',kind:'publisher_information',
 overview:{en:'LSF is a Tanzanian non-profit working on access to justice and legal empowerment.',sw:'LSF ni shirika lisilo la faida nchini Tanzania linalofanya kazi katika upatikanaji wa haki na uwezeshaji wa kisheria.'},
 history:{en:'The published LSF website describes its launch in 2011 as a national basket-fund mechanism for legal empowerment, and its evolution from grant-maker towards direct implementation.',sw:'Tovuti ya LSF inaeleza kuwa ilianzishwa mwaka 2011 kama mfuko wa pamoja wa kitaifa wa uwezeshaji wa kisheria, na imepanua kazi kutoka utoaji wa ruzuku kuelekea utekelezaji wa moja kwa moja.'},
 work:{en:'Its published work includes legal empowerment, support for legal-aid and paralegal networks, capacity building and advocacy for equal access to justice. Its website describes a vision of meaningful access to justice and the ability to claim rights.',sw:'Kazi zake zilizochapishwa zinahusisha uwezeshaji wa kisheria, kusaidia mitandao ya msaada wa kisheria na wasaidizi wa kisheria, kujenga uwezo na utetezi wa upatikanaji sawa wa haki. Dira iliyoelezwa kwenye tovuti ni watu kupata haki kwa maana halisi na kudai haki zao.'},
 contact:{address:'Chole Road, Masaki, Dar es Salaam, Tanzania',phone:'+255 22 260 1534',email:'info@lsftz.org',sourceUrl:'https://lsftz.org/contact'},
 sources:[{title:'LSF About',url:'https://lsftz.org/about'},{title:'LSF Contact',url:'https://lsftz.org/contact'}],
 limits:'This profile does not establish current opening hours, intake, individual staff availability, current programme budgets, impact totals, service eligibility, appointment confirmation or an LSF referral agreement. Do not infer these from historic website statements.'
} as const;
export function lsfInformationReply(locale?:'en'|'sw',topic?:string){
 const language=locale==='en'?'en':'sw';const en=language==='en';
 const parts:string[]=topic==='history'?[LSF_INFORMATION.history[language]]:topic==='work'?[LSF_INFORMATION.work[language]]:topic==='contact'?[]:[LSF_INFORMATION.overview[language],LSF_INFORMATION.history[language],LSF_INFORMATION.work[language]];
 if(topic==='contact'||!topic||topic==='overview')parts.push(en?`LSF's published office contact is ${LSF_INFORMATION.contact.address}. Phone: ${LSF_INFORMATION.contact.phone}; email: ${LSF_INFORMATION.contact.email}. Please confirm hours and whether the office can help before travelling. This is office information, not a booked appointment or paralegal assignment.`:`Mawasiliano ya ofisi yaliyochapishwa ni ${LSF_INFORMATION.contact.address}. Simu: ${LSF_INFORMATION.contact.phone}; barua pepe: ${LSF_INFORMATION.contact.email}. Thibitisha muda wa kazi na msaada unaopatikana kabla ya kwenda. Hizi ni taarifa za ofisi, si miadi iliyowekwa wala kuunganishwa na msaidizi wa kisheria.`);
 return parts.join('\n\n')+`\n\n[${en?'LSF website':'Tovuti ya LSF'}](${topic==='contact'?LSF_INFORMATION.contact.sourceUrl:LSF_INFORMATION.sources[0].url})`;
}

// Route bounded publisher questions separately from legal retrieval. Do not turn
// an LSF mention inside a person's legal problem into a generic organisation FAQ.
export function lsfInformationTopic(message:string):'overview'|'history'|'work'|'contact'|undefined {
 const text=message.toLowerCase().replace(/[’']/g," ");
 if(!/\b(lsf|legal services facility)\b/.test(text))return;
 if(/\b(my case|my request|my land|my employer|my tenant|court|deadline|eviction|tenant|unpaid|wages|salary|divorce|inheritance|mshahara|talaka|mirathi|kesi yangu|ombi langu|ardhi yangu|mwajiri wangu|mahakama|budget|funding|million|billion|how many|wangapi|bajeti)\b/.test(text))return;
 if(/\b(office|offices|contact|address|phone|email|ofisi|mawasiliano|simu|barua pepe)\b/.test(text))return 'contact';
 if(/\b(history|founded|established|historia|ilianzishwa|ilianza)\b/.test(text))return 'history';
 if(/\b(mission|vision|work|does lsf do|kazi|shughuli|inafanya|dira|dhima)\b/.test(text))return 'work';
 if(/\b(who is|what is|what s|tell me about|ni nini|ni nani|kuhusu lsf)\b/.test(text))return 'overview';
}
