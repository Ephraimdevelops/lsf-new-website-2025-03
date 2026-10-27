import { supervisorTools } from '../supervisor/tools';
// Each link uses the existing server role checks; staff cannot approve reports or manage accounts.
export const staffTools = [
  {key:'requests',en:'New requests',sw:'Maombi mapya',body:'Read requests and choose the next safe step.',bodySw:'Soma maombi na chagua hatua salama.',route:'/operations',web:'/dashboard/staff?tab=requests',icon:'document-text-outline',group:'cases'},
  ...supervisorTools.filter(item => item.key !== 'audit').map(item => ({...item,
    ...(item.key === 'support' ? {web:'/dashboard/staff?view=support'} : {}),
    ...(item.key === 'partners' ? {web:'/dashboard/staff?view=partners'} : {}),
    ...(item.key === 'reporting' ? {body:'Prepare a private draft for independent review.',bodySw:'Andaa rasimu binafsi kwa mapitio ya mtu mwingine.'} : {}),
    ...(item.key === 'directory' ? {body:'Update service details and review proposed corrections.',bodySw:'Sasisha taarifa za huduma na kagua marekebisho.'} : {}),
  })),
  {key:'paralegals',en:'Paralegal applications',sw:"Maombi ya msaidizi wa kisheria",body:'Check applications and record the next step.',bodySw:'Kagua maombi na rekodi hatua inayofuata.',route:'/paralegal-review-queue',web:'/dashboard/paralegal-reviews',icon:'person-add-outline',group:'team'},
  {key:'training',en:'Team learning',sw:'Mafunzo ya timu',body:'Prepare lessons and follow learning progress.',bodySw:'Andaa mafunzo na fuatilia maendeleo.',route:'/training-management',web:'/dashboard/training-management',icon:'book-outline',group:'team'},
  {key:'saada',en:'Haki Yangu AI quality checks',sw:'Ukaguzi wa Haki Yangu AI',body:'Review answer quality and record findings.',bodySw:'Kagua ubora wa majibu na rekodi matokeo.',route:'/saada-evaluations',web:'/dashboard/saada-evaluations',icon:'chatbubble-ellipses-outline',group:'team'},
] as const;
