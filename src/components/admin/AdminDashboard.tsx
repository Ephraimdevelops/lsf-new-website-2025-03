
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LayoutDashboard, Settings, Users, FileText, X, Menu, BarChart, Briefcase, FolderOpen } from 'lucide-react';
import AdminNews from './AdminNews';
import AdminPublications from './AdminPublications';
import AdminPrograms from './AdminPrograms';
import AdminOpportunities from './AdminOpportunities';
import AdminSettings from './AdminSettings';
import AdminHome from './AdminHome';
import AdminAnalytics from './AdminAnalytics';
import AdminResources from './AdminResources';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <div className="font-bold text-primary font-panton">LSF Admin</div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <LayoutDashboard size={18} className="mr-2" />
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/analytics" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/analytics') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <BarChart size={18} className="mr-2" />
                {sidebarOpen && <span>Analytics</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/news" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/news') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <FileText size={18} className="mr-2" />
                {sidebarOpen && <span>News</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/publications" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/publications') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <FileText size={18} className="mr-2" />
                {sidebarOpen && <span>Publications</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/resources" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/resources') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <FolderOpen size={18} className="mr-2" />
                {sidebarOpen && <span>Resources</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/programs" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/programs') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <Users size={18} className="mr-2" />
                {sidebarOpen && <span>Programs</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/opportunities" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/opportunities') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <Briefcase size={18} className="mr-2" />
                {sidebarOpen && <span>Opportunities</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 font-calibri ${
                  isActiveRoute('/admin/settings') ? 'bg-primary text-white hover:bg-primary/90' : ''
                }`}
              >
                <Settings size={18} className="mr-2" />
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold font-panton">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 font-calibri hidden md:block">
                Last login: {localStorage.getItem('admin-last-login') 
                  ? new Date(parseInt(localStorage.getItem('admin-last-login') || '0')).toLocaleString() 
                  : 'Unknown'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center font-calibri"
                onClick={onLogout}
              >
                <User size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/news" element={<AdminNews />} />
            <Route path="/publications" element={<AdminPublications />} />
            <Route path="/resources" element={<AdminResources />} />
            <Route path="/programs" element={<AdminPrograms />} />
            <Route path="/opportunities" element={<AdminOpportunities />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
