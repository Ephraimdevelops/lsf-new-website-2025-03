import { Link } from "react-router-dom";
import { useCopy } from "@/i18n/useCopy";
import AdminSupport from "./AdminSupport";
import AdminAudit from "./AdminAudit";

import AdminHome from './AdminHome';
import AdminNews from './AdminNews';
import AdminOpportunities from './AdminOpportunities';
import AdminPublications from './AdminPublications';
import AdminSettings from './AdminSettings';
import AdminHeroSlides from './AdminHeroSlides';
import EnhancedAnalyticsDashboard from './EnhancedAnalyticsDashboard';
import AdminStories from './AdminStories';
import AdminTestimonials from './AdminTestimonials';
import AdminNewsletter from './AdminNewsletter';
import AdminFormSubmissions from './AdminFormSubmissions';
import AdminParalegals from './AdminParalegals';
import AdminSaraAnalytics from './AdminSaraAnalytics';
import AdminTeam from './AdminTeam';
import AdminAccess from './AdminAccess';
import AdminPlatform from './AdminPlatform';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AdminDashboard = () => {
  const c = useCopy();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'platform' ? 'home' : searchParams.get('tab') ?? 'home';
  const setActiveTab = (next: string) => setSearchParams((current) => {
    const updated = new URLSearchParams(current);
    updated.set('tab', next);
    return updated;
  });
  const navigate = useNavigate();


  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminPlatform openTab={setActiveTab} navigate={navigate} />;
      case 'website':
        return <AdminHome />;
      case 'support':
        return <AdminSupport />;
      case 'audit':
        return <AdminAudit />;
      case 'access':
        return <AdminAccess />;
      case 'platform':
        return <AdminPlatform openTab={setActiveTab} navigate={navigate} />;
      case 'hero-slides':
        return <AdminHeroSlides />;
      case 'news':
        return <AdminNews />;
      case 'stories':
        return <AdminStories />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'publications':
        return <AdminPublications />;
      case 'opportunities':
        return <AdminOpportunities />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'submissions':
        return <AdminFormSubmissions />;
      case 'paralegals':
        return <AdminParalegals />;
      case 'team':
        return <AdminTeam />;
      case 'analytics':
        return <EnhancedAnalyticsDashboard />;
      case 'sara-analytics':
        return <AdminSaraAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminPlatform openTab={setActiveTab} navigate={navigate} />;
    }
  };

  return <div className="workspace-admin-content work-page">{activeTab!=='home'&&<nav className="work-admin-context" aria-label={c("Administration")}><Link to="/admin">{c("Today")}</Link><span aria-hidden="true">/</span><span>{c(({access:'People & access',support:'Team support',audit:'Decision history',website:'Website overview',settings:'Settings',news:'News',stories:'Success stories',testimonials:'Testimonials',publications:'Publications',opportunities:'Opportunities',newsletter:'Newsletter',submissions:'Submissions',paralegals:'Paralegals',team:'Team',analytics:'Website analytics','sara-analytics':'Haki Yangu AI statistics','hero-slides':'Hero slides'} as Record<string,string>)[activeTab]??activeTab)}</span></nav>}<div className={activeTab==='home'?'':'work-admin-detail'}>{renderContent()}</div></div>;
};

export default AdminDashboard;
