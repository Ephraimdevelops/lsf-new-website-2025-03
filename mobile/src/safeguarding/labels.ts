const titles:Record<string,[string,string]>={submitted:['New','Mpya'],under_review:['Being reviewed','Inapitiwa'],resolved:['Review completed','Mapitio yamekamilika'],declined:['Review declined','Mapitio yamekataliwa'],pending_review:['Needs review','Inahitaji mapitio'],approved:['Match approved','Pendekezo limekubaliwa'],needs_changes:['Needs changes','Inahitaji marekebisho'],escalated:['Needs senior review','Inahitaji msimamizi'],restricted:['Keep protected','Iendelee kulindwa']};
export const safetyLabel=(value:string,sw:boolean)=>titles[value]?.[sw?1:0]??(sw?'Mapitio':'Review');

const actionTitles:Record<string,[string,string]> = { approved:['Approve this match','Kubali pendekezo'], needs_changes:['Ask for changes','Omba marekebisho'], escalated:['Ask for senior review','Omba ukaguzi wa msimamizi'], restricted:['Keep this match on hold','Sitisha pendekezo hili'] };
export const safetyActionLabel=(value:string,sw:boolean)=>actionTitles[value]?.[sw?1:0]??safetyLabel(value,sw);
