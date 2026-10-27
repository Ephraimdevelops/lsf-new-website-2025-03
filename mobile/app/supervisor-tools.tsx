import { LoadingText } from '../src/components/BrandLoading';
import {useQuery} from 'convex/react';
import {router,type Href} from 'expo-router';
import {useState} from 'react';
import {Text,View} from 'react-native';
import {api} from '../src/backend/api';
import {AdminScreen} from '../src/admin/AdminScreen';
import {Row} from '../src/admin/AdminHome';
import {CivicPageHeader} from '../src/components/CivicPageHeader';
import {ParalegalIntro} from '../src/components/ParalegalIntro';
import {SearchFilters} from '../src/components/SearchFilters';
import {Button} from '../src/components/Button';
import {supervisorTools} from '../src/supervisor/tools';
import {useLanguage} from '../src/i18n';
import {colors,type} from '../src/theme';
import {useSensitiveScreenProtection} from '../src/useSensitiveScreenProtection';
export default function SupervisorTools(){useSensitiveScreenProtection('supervisor-tools');const sw=useLanguage().locale==='sw';const access=useQuery(api.users.currentAccess);const allowed=access?.roles.some(role=>['admin','supervisor'].includes(role));const [search,setSearch]=useState('');const [group,setGroup]=useState('');const visible=supervisorTools.filter(item=>(!group||item.group===group)&&[item.en,item.sw,item.body,item.bodySw].join(' ').toLowerCase().includes(search.trim().toLowerCase()));return <AdminScreen><CivicPageHeader compact back title={sw?'Zana za msimamizi':'Supervisor tools'}/><ParalegalIntro pose="documents" title={sw?'Hatua sahihi, mahali pamoja.':'The right next step, in one place.'} body={sw?'Tafuta zana ya kesi, timu au taarifa.':'Find a tool for cases, the team or reports.'}/>{allowed?<><SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw?'Tafuta zana':'Find a tool'} label={sw?'Aina':'Type'} title={sw?'Aina ya kazi':'Type of work'} count={Number(!!group)} onReset={()=>setGroup('')}><View style={{gap:8}}>{[['','All tools','Zana zote'],['cases','Cases','Kesi'],['team','Team','Timu'],['reports','Reports','Taarifa']].map(([value,en,label])=><Button key={value} label={sw?label:en} variant={group===value?'primary':'secondary'} onPress={()=>setGroup(value)}/>)}</View></SearchFilters>{visible.map(item=><Row key={item.key} title={sw?item.sw:item.en} body={sw?item.bodySw:item.body} icon={item.icon} onPress={()=>router.push(item.route as Href)}/>)}{!visible.length&&<Text style={copy}>{sw?'Hakuna zana inayolingana. Jaribu neno jingine.':'No matching tool. Try another word.'}</Text>}</>:<LoadingText style={copy}>{access===undefined?(sw?'Inapakia…':'Loading…'):(sw?'Idhini ya msimamizi inahitajika.':'Supervisor approval is required.')}</LoadingText>}</AdminScreen>}
const copy={fontFamily:type.regular,color:colors.inkMuted,fontSize:14,lineHeight:21};
