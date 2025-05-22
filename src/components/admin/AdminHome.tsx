
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Download, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  // Sample admin stats - in a real app, these would come from a backend API
  const stats = {
    totalVisitors: 1204,
    newsItems: 15,
    publications: 5,
    programs: 4,
    downloads: 321,
    newVisitorsToday: 42,
    mostViewedNews: "Women's rights workshop reaches 500 participants across Tanzania",
    mostDownloadedPublication: "Annual Report 2023: Impact and Progress in Legal Aid Delivery"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold font-panton">Admin Dashboard</h2>
        <Button asChild size="sm">
          <Link to="/admin/analytics">
            Full Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Total Visitors</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">+{stats.newVisitorsToday} today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">News Items</CardTitle>
            <FileText size={16} className="text-secondary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newsItems}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">+2 in the last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Downloads</CardTitle>
            <Download size={16} className="text-secondary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.downloads}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">All publications</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-panton">Most Viewed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Eye size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium font-calibri">Most Viewed News</div>
                  <div className="text-sm text-gray-500 font-calibri">{stats.mostViewedNews}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">410 views</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-secondary-teal/10 p-2 rounded-full">
                  <Download size={16} className="text-secondary-teal" />
                </div>
                <div>
                  <div className="font-medium font-calibri">Most Downloaded Publication</div>
                  <div className="text-sm text-gray-500 font-calibri">{stats.mostDownloadedPublication}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">87 downloads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-panton">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium font-calibri">New Publication Added</div>
                  <div className="text-sm text-gray-500 font-calibri">Annual Report 2023 was published</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">2 days ago</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-secondary-teal/10 p-2 rounded-full">
                  <FileText size={16} className="text-secondary-teal" />
                </div>
                <div>
                  <div className="font-medium font-calibri">News Article Updated</div>
                  <div className="text-sm text-gray-500 font-calibri">Women's rights workshop article was edited</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">3 days ago</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-secondary-green/10 p-2 rounded-full">
                  <Users size={16} className="text-secondary-green" />
                </div>
                <div>
                  <div className="font-medium font-calibri">Program Updated</div>
                  <div className="text-sm text-gray-500 font-calibri">Legal Empowerment program details modified</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">5 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
