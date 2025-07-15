
import React, { useState } from 'react';
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
  Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminHome from './AdminHome';
import AdminNews from './AdminNews';
import AdminPrograms from './AdminPrograms';
import AdminOpportunities from './AdminOpportunities';
import AdminPublications from './AdminPublications';
import AdminResources from './AdminResources';
import AdminSettings from './AdminSettings';
import AdminHeroSlides from './AdminHeroSlides';
import EnhancedAnalyticsDashboard from './EnhancedAnalyticsDashboard';
import AdminUserManagement from './AdminUserManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'hero-slides', label: 'Hero Slides', icon: Presentation },
    { id: 'news', label: 'News', icon: FileText },
    { id: 'programs', label: 'Programs', icon: Calendar },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'user-management', label: 'User Management', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminHome />;
      case 'hero-slides':
        return <AdminHeroSlides />;
      case 'news':
        return <AdminNews />;
      case 'programs':
        return <AdminPrograms />;
      case 'publications':
        return <AdminPublications />;
      case 'opportunities':
        return <AdminOpportunities />;
      case 'resources':
        return <AdminResources />;
      case 'analytics':
        return <EnhancedAnalyticsDashboard />;
      case 'settings':
        return <AdminSettings />;
      case 'user-management':
        return <AdminUserManagement />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">LSF Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                        activeTab === item.id
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
      <div className="ml-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
