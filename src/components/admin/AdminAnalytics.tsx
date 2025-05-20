
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Download, Eye, Users } from 'lucide-react';

// Sample analytics data - in a real app, these would come from a backend API
const sampleVisitorData = [
  { name: 'May 1', visitors: 145 },
  { name: 'May 2', visitors: 139 },
  { name: 'May 3', visitors: 170 },
  { name: 'May 4', visitors: 182 },
  { name: 'May 5', visitors: 190 },
  { name: 'May 6', visitors: 168 },
  { name: 'May 7', visitors: 210 }
];

const sampleDownloadsData = [
  { name: 'Annual Report 2023', downloads: 87 },
  { name: 'Women\'s Land Rights', downloads: 63 },
  { name: 'Digital Legal Services', downloads: 42 },
  { name: 'Policy Brief', downloads: 51 },
  { name: 'Legal Aid Handbook', downloads: 78 }
];

const samplePostViewsData = [
  { name: 'Paralegal Training', views: 320 },
  { name: 'Women\'s Rights Workshop', views: 410 },
  { name: 'Climate Justice', views: 215 },
  { name: 'Mobile Legal Aid', views: 280 },
  { name: 'MOU Signing', views: 350 }
];

const AdminAnalytics = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  
  useEffect(() => {
    // Calculate totals
    setTotalVisitors(sampleVisitorData.reduce((sum, item) => sum + item.visitors, 0));
    setTotalDownloads(sampleDownloadsData.reduce((sum, item) => sum + item.downloads, 0));
    setTotalViews(samplePostViewsData.reduce((sum, item) => sum + item.views, 0));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-panton">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Total Visitors</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Publication Downloads</CardTitle>
            <Download size={16} className="text-secondary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">News Item Views</CardTitle>
            <Eye size={16} className="text-secondary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">All time</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="visitors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="views">News Views</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visitors" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                <Users size={18} />
                Daily Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sampleVisitorData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="downloads" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                <Download size={18} />
                Publication Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sampleDownloadsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="downloads" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="views" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                <Eye size={18} />
                News Item Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={samplePostViewsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
