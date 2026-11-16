import {useQuery} from 'convex/react';
import {Link} from 'react-router-dom';
import {BookOpen,Users,ArrowUpRight} from 'lucide-react';
import {api} from '../../../convex/_generated/api';
export default function SaadaReadiness(){
 const data=useQuery(api.sara.getReadiness);
 const services=useQuery(api.justiceServices.listPublicServices,{});
 const people=useQuery(api.paralegals.listApprovedParalegals,{});
 return <section className="resource-hub-overview" aria-label="What the AI can use" data-testid="saada-readiness">
  <div className="resource-hub-status"><BookOpen className="h-5 w-5"/><div><strong>{data?data.approvedCurrentSourceDocuments:'…'} legal documents ready</strong><p>{data?data.approvedCurrentGuides:'…'} {data?.approvedCurrentGuides===1?'approved guide available':'approved guides available'}</p></div></div>
  <div className="resource-hub-status"><Users className="h-5 w-5"/><div><strong>{people?.length??'…'} paralegals · {services?.length??'…'} services listed</strong><p>{people?.length===0&&services?.length===0?'Add verified profiles so the AI can suggest local help.':'The AI searches these published profiles for local help.'}</p></div><Link to="/dashboard/staff?tab=services" aria-label="Manage services and organisations"><ArrowUpRight className="h-4 w-4"/></Link></div>
  <details className="resource-hub-details"><summary>Other resources and counts</summary><div><p>{data?.privatePdfOriginals??'…'} saved PDF originals · {data?.privateDirectoryResearch??'…'} directory research records</p><p>{data?.pendingGuides??'…'} guides awaiting review · {data?.failedSourceDocuments??'…'} documents need processing repair</p><p>LSF publisher profile: identity, history, work and office contact. Detailed reports and programme knowledge still need to be added and reviewed.</p><p>Saved research is kept separate from approved answers and verified directory profiles.</p>{data?.countsAreLowerBounds&&<p>Counts cover up to 200 records per collection; open each management list for the full queue.</p>}<div className="resource-hub-related"><Link to="/dashboard/editorial">Manage guides</Link><Link to="/dashboard/paralegal-reviews">Review paralegals</Link><Link to="/dashboard/staff?tab=services">Manage offices and services</Link></div></div></details>
 </section>;
}
