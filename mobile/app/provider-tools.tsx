import { LoadingText } from '../src/components/BrandLoading';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { Text } from 'react-native';
import { api } from '../src/backend/api';
import { Screen } from '../src/components/Screen';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { ParalegalIntro } from '../src/components/ParalegalIntro';
import { SearchFilters } from '../src/components/SearchFilters';
import { ProviderNavigation } from '../src/provider/ProviderNavigation';
import { ProviderRow } from '../src/provider/ProviderHome';
import { useLanguage } from '../src/i18n';
import { colors, type } from '../src/theme';
const tools = [
  { en:'Cases to accept',sw:'Kesi za kupokea',body:'Read and respond to a case offer.',bodySw:'Soma ombi la kupokea kesi na ujibu.',route:'/paralegal-assignments',icon:'briefcase-outline' },
  { en:'Incoming referrals',sw:'Rufaa zilizopokelewa',body:'Reply and follow the help provided.',bodySw:'Jibu na fuatilia msaada uliotolewa.',route:'/provider-referrals',icon:'paper-plane-outline' },
  { en:'Appointments',sw:'Miadi',body:'View times and confirm what happened.',bodySw:'Angalia muda na uthibitishe kilichotokea.',route:'/work-appointments',icon:'calendar-outline' },
  { en:'Messages',sw:'Ujumbe',body:'Talk with people in your work cases.',bodySw:'Wasiliana na watu kwenye kesi zako.',route:'/(tabs)/help',icon:'chatbubble-outline' },
  { en:'Case documents',sw:'Nyaraka za kesi',body:'Read and add files in cases you can access.',bodySw:'Soma na ongeza nyaraka kwenye kesi unazoruhusiwa.',route:'/work-documents',icon:'document-text-outline' },
  { en:'Tasks',sw:'Kazi',body:'Plan and finish the next step.',bodySw:'Panga na ukamilishe hatua inayofuata.',route:'/paralegal-tasks',icon:'checkbox-outline' },
  { en:'Our organisation',sw:'Taasisi yetu',body:'Services, locations, available places and team.',bodySw:'Huduma, maeneo, nafasi na timu.',route:'/my-organisation',icon:'business-outline' },
  { en:'Ask LSF for help',sw:'Omba msaada wa LSF',body:'Ask for guidance and read the reply.',bodySw:'Omba mwongozo na soma jibu.',route:'/paralegal-support',icon:'people-outline' },
  { en:'My progress',sw:'Maendeleo yangu',body:'Your cases, outcomes and feedback summary.',bodySw:'Kesi zako, matokeo na muhtasari wa maoni.',route:'/paralegal-performance',icon:'trending-up-outline' },
  { en:'Rights guides',sw:'Miongozo ya haki',body:'Read reviewed guidance for your next step.',bodySw:'Soma mwongozo uliopitiwa kwa hatua inayofuata.',route:'/rights',icon:'book-outline' },
  { en:'My account',sw:'Akaunti yangu',body:'Profile, settings and personal help.',bodySw:'Wasifu, mipangilio na msaada binafsi.',route:'/work-profile',icon:'person-outline' },
] as const;
export default function ProviderTools() {
 const {locale}=useLanguage();const sw=locale==='sw';const [search,setSearch]=useState('');const access=useQuery(api.users.currentAccess);const allowed=access?.roles.includes('provider_staff');
 const visible=tools.filter(item=>[item.en,item.sw,item.body,item.bodySw].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
 return <Screen footer={allowed ? <ProviderNavigation current="tools" /> : undefined}><CivicPageHeader back compact title={sw?'Zana za huduma':'Service tools'} /><ParalegalIntro pose="documents" title={sw?'Hatua yako inayofuata, hapa.':'Your next step, right here.'} body={sw?'Tafuta zana unayohitaji kwa kazi yako.':'Find the tool you need for your work.'} />{allowed ? <><SearchFilters sw={sw} value={search} onChange={setSearch} placeholder={sw?'Tafuta zana':'Find a tool'} />{visible.map(item=><ProviderRow key={item.route} icon={item.icon} title={sw?item.sw:item.en} body={sw?item.bodySw:item.body} route={item.route} />)}{!visible.length&&<Text style={{fontFamily:type.regular,color:colors.inkMuted}}>{sw?'Hakuna zana inayolingana. Jaribu neno jingine.':'No matching tool. Try another word.'}</Text>}</> : <LoadingText>{access===undefined?(sw?'Inaangalia ruhusa zako…':'Checking your access…'):(sw?'LSF lazima iidhinishe ruhusa yako ya kazi.':'LSF must approve your work access.')}</LoadingText>}</Screen>;
}
