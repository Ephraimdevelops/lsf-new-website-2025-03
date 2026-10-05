
import React from 'react';
import {
  Home,
  FileText,
  Calendar,
  Briefcase,
  Users,
  Settings,
  LogOut,
  BarChart3,
  BookOpen,
  Presentation,
  Heart,
  Mail,
  MessageSquare,
  Scale,
  Bot,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpsDashboard from './OpsDashboard';
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

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'platform' ? 'home' : searchParams.get('tab') ?? 'home';
  const setActiveTab = (next: string) => setSearchParams((current) => {
    const updated = new URLSearchParams(current);
    updated.set('tab', next);
    return updated;
  });
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'LSF control centre', icon: ShieldCheck },
    { id: 'haki-yangu-ops', label: 'Haki Yangu Ops', icon: Scale },
    { id: 'notifications', label: 'Updates', icon: Bell },
    { id: 'access', label: 'Users & Access', icon: Users },
    { id: 'website', label: 'Website overview', icon: Home },
    { id: 'hero-slides', label: 'Hero Slides', icon: Presentation },
    { id: 'news', label: 'News', icon: FileText },
    { id: 'stories', label: 'Success Stories', icon: Heart },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'submissions', label: 'Submissions', icon: MessageSquare },
    { id: 'paralegals', label: 'Paralegals', icon: Scale },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sara-analytics', label: 'Saada AI Stats', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminPlatform openTab={setActiveTab} navigate={navigate} />;
      case 'website':
        return <AdminHome />;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-64 bg-white shadow-lg z-50 md:block">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">LSF Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => item.id === 'haki-yangu-ops' ? navigate('/dashboard/staff') : item.id === 'notifications' ? navigate('/notifications') : setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64">
        <div className="border-b bg-white p-3 md:hidden"><label className="block text-sm font-semibold text-gray-800">LSF workspace<select aria-label="LSF workspace" value={activeTab} onChange={(event) => event.target.value === 'haki-yangu-ops' ? navigate('/dashboard/staff') : event.target.value === 'notifications' ? navigate('/notifications') : setActiveTab(event.target.value)} className="mt-2 w-full rounded-xl border p-3">{menuItems.filter((item) => item.id !== 'haki-yangu-ops').map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><Button onClick={onLogout} variant="outline" className="mt-3 w-full">Sign out</Button></div>
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
