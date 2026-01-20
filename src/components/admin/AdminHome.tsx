
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Download, Eye, ArrowRight, TrendingUp, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const AdminHome = () => {
  // Use the REAL analytics query instead of the mock admin one
  const analytics = useQuery(api.analytics.getDashboardOverview, { days: 30 });
  const loading = analytics === undefined;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate generic content total (News + Pubs)
  const totalContent = (analytics.documentCounts?.news || 0) + (analytics.documentCounts?.publications || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-panton">Admin Dashboard</h2>
          <p className="text-gray-600 font-calibri">Welcome back! Here's what's happening with your website.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/admin/analytics">
            Full Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Unique Visitors (Est.)</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1 font-calibri flex items-center">
              Last 30 Days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Content Items</CardTitle>
            <FileText size={16} className="text-secondary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalContent}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">
              News & Publications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Total Downloads</CardTitle>
            <Download size={16} className="text-secondary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">All publications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Page Views</CardTitle>
            <Eye size={16} className="text-secondary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalPageViews.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">Total content views</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-panton flex items-center gap-2">
              <Calendar size={18} />
              Visitor Trends (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyStats?.slice(-14) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [value, 'Visitors']}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-panton flex items-center gap-2">
              <Download size={18} />
              Top Content by Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.contentPerformance?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="title"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="downloads" fill="#10B981" name="Downloads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-panton">Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium font-calibri">News Articles</div>
                    <div className="text-sm text-gray-500 font-calibri">Published content</div>
                  </div>
                </div>
                <div className="text-xl font-bold">{analytics.documentCounts?.news || 0}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary-teal/10 p-2 rounded-full">
                    <Download size={16} className="text-secondary-teal" />
                  </div>
                  <div>
                    <div className="font-medium font-calibri">Publications</div>
                    <div className="text-sm text-gray-500 font-calibri">Downloadable resources</div>
                  </div>
                </div>
                <div className="text-xl font-bold">{analytics.documentCounts?.publications || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-panton flex items-center gap-2">
              <Activity size={18} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No recent activity</div>
              )}
              {analytics.recentActivity?.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${activity.type === 'news' ? 'bg-primary/10' :
                    activity.type === 'publication' ? 'bg-secondary-teal/10' :
                      'bg-gray-100'
                    }`}>
                    <FileText size={16} className={
                      activity.type === 'news' ? 'text-primary' :
                        activity.type === 'publication' ? 'text-secondary-teal' :
                          'text-gray-500'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium font-calibri capitalize">
                      {activity.action} {activity.type}
                    </div>
                    <div className="text-sm text-gray-500 font-calibri mb-1 line-clamp-1">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-400 font-calibri">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-panton">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/admin/news">
                <FileText size={20} />
                <span className="font-calibri">Manage News</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/admin/publications">
                <Download size={20} />
                <span className="font-calibri">Manage Publications</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/admin/analytics">
                <TrendingUp size={20} />
                <span className="font-calibri">View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
