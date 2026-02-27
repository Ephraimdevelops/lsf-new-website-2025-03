
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, Download, Eye, Users, TrendingUp, Globe, FileText, Activity } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminAnalytics = () => {
  const analytics = useQuery(api.admin.getAnalytics);
  const loading = analytics === undefined;
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
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
          <p className="text-gray-500">Failed to load analytics data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalDownloads = analytics.engagement.downloads.reduce((sum, item) => sum + item.downloads, 0);
  const totalViews = analytics.engagement.views.reduce((sum, item) => sum + item.views, 0);
  const totalPageViews = analytics.engagement.topPages.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-panton">Analytics Dashboard</h2>
          <p className="text-gray-600 font-calibri">Comprehensive insights into your website performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Total Visitors</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.visitors.total.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1 font-calibri flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analytics.visitors.growth}% growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Page Views</CardTitle>
            <Eye size={16} className="text-secondary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">Across all pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Content Views</CardTitle>
            <FileText size={16} className="text-secondary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">News & articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Downloads</CardTitle>
            <Download size={16} className="text-secondary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">Publications downloaded</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="deep">Deep Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-panton flex items-center gap-2">
                  <Calendar size={18} />
                  Visitor Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.visitors.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value) => [value, 'Visitors']}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-panton">Traffic Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium font-calibri">Average Daily Visitors</p>
                      <p className="text-sm text-gray-600 font-calibri">Last 30 days</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(analytics.visitors.total / 30)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium font-calibri">Peak Day</p>
                      <p className="text-sm text-gray-600 font-calibri">Highest traffic</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.max(...analytics.visitors.daily.map(d => d.visitors))}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium font-calibri">Growth Rate</p>
                      <p className="text-sm text-gray-600 font-calibri">Month over month</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      +{analytics.visitors.growth}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                <Eye size={18} />
                Content Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.engagement.views}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Views']} />
                    <Legend />
                    <Bar dataKey="views" fill="#3B82F6" name="Content Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <BarChart data={analytics.engagement.downloads}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="downloads" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-panton">Download Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.engagement.downloads}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="downloads"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.engagement.downloads.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                <Globe size={18} />
                Top Performing Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.engagement.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium font-calibri">{page.page}</p>
                        <p className="text-sm text-gray-500 font-calibri">Page path</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 font-calibri">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deep" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* News Deep Dive */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-panton flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  News Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Impressions (Views)</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.news.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Full Reads</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.news.reads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Card Clicks</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.news.clicks.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Read Conversion</span>
                      <span className="font-bold text-blue-600">{analytics.detailedMetrics?.news.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analytics.detailedMetrics?.news.conversionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities Funnel */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-panton flex items-center gap-2">
                  <Activity size={18} className="text-green-500" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Views</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.opportunities.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">"Apply" Clicks</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.opportunities.applies.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Apply Rate</span>
                      <span className="font-bold text-green-600">{analytics.detailedMetrics?.opportunities.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analytics.detailedMetrics?.opportunities.conversionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paralegal Funnel */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-panton flex items-center gap-2">
                  <Users size={18} className="text-orange-500" />
                  Paralegal Recruitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Landing Page Views</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.paralegalFunnel.stage1Views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Started Application</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.paralegalFunnel.stage2Starts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Submitted Application</span>
                    <span className="font-bold text-gray-900">{analytics.detailedMetrics?.paralegalFunnel.stage3Completes.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Conversion Rate</span>
                      <span className="font-bold text-orange-600">{analytics.detailedMetrics?.paralegalFunnel.overallConversion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${analytics.detailedMetrics?.paralegalFunnel.overallConversion}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stories & Donations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-panton flex items-center gap-2">
                  <Globe size={18} className="text-purple-500" />
                  Impact & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Success Stories</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Views</span>
                      <span className="font-bold text-gray-900">{analytics.detailedMetrics?.stories.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-bold text-gray-700 mb-2 mt-2">Donations</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">"Donate Now" Clicks</span>
                      <span className="font-bold text-purple-600 text-lg">{analytics.detailedMetrics?.donations.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saada AI */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-panton flex items-center gap-2">
                  <Activity size={18} className="text-indigo-500" />
                  Saada AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-indigo-600">{analytics.detailedMetrics?.saadaAI.sessions}</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Total AI Sessions</h4>
                  <p className="text-sm text-gray-500 mt-2">Active chats initiated by visitors seeking legal assistance.</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
