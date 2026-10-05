import { useState } from 'react';
import {
  Users,
  Download,
  Eye,
  Calendar,
  Activity,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart,
  Pie
} from 'recharts';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const EnhancedAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = useQuery(api.analytics.getDashboardOverview, {
    days: parseInt(timeRange)
  });
  const journey = useQuery(api.journeyAnalytics.overview, { days: parseInt(timeRange) });
  const partnerPerformance = useQuery(api.justiceServices.staffPartnerPerformance, { days: parseInt(timeRange) });

  const isLoading = metrics === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return <div>Failed to load data</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];


  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">
              {metrics.realTimeStats.activeUsers} distinct visitors with an event in the last 5 minutes
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Haki Yangu help journey</CardTitle>
          <p className="text-sm text-gray-600">Public click counts are approximate and can be inflated by repeated or automated calls. Submitted requests, visit check-ins and referral transitions come from backend records; these figures are not a conversion rate or a count of unique people.</p>
        </CardHeader>
        <CardContent>
          {journey === undefined ? <p role="status">Loading journey counts…</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(['web', 'mobile'] as const).map((surface) => <div key={surface} className="rounded-xl border p-4">
                <h3 className="font-semibold capitalize">{surface}</h3>
                <p className="mt-2 text-sm">Find Help searches: <strong>{journey.interactions[surface].find_help_search}</strong></p>
                <p className="text-sm">No-result searches: <strong>{journey.interactions[surface].find_help_no_results}</strong></p>
                <p className="text-sm">Request reviews opened: <strong>{journey.interactions[surface].request_review}</strong></p>
                <p className="text-sm">Call actions opened: <strong>{journey.interactions[surface].service_call_open}</strong></p>
                <p className="text-sm">Directions opened: <strong>{journey.interactions[surface].service_directions_open}</strong></p>
              </div>)}
              <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-2">
                <h3 className="font-semibold">Requests submitted</h3>
                <p className="mt-2 text-2xl font-bold">{journey.submittedRequests}</p>
                <p className="text-sm text-gray-600">All platforms combined; counted from submitted help requests, including those since triaged or closed.</p>
              </div>
              <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-2">
                <h3 className="font-semibold">LSF triage</h3>
                <p className="mt-2 text-sm">Waiting to start: <strong>{journey.triage.awaitingStart}</strong></p>
                <p className="text-sm">Waiting over 24 hours: <strong>{journey.triage.awaitingOver24Hours}</strong></p>
                <p className="text-sm">Average time to first review: <strong>{journey.triage.averageHoursToStart === null ? 'Unavailable' : `${journey.triage.averageHoursToStart} hours`}</strong></p>
                <p className="mt-2 text-xs text-gray-600">Waiting counts include all still-submitted requests, even older than the selected period. Average covers {journey.triage.startedWithTimestamp} requests submitted in the period with a recorded first-review timestamp. Older reviews may lack one.</p>
              </div>
              <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-2">
                <h3 className="font-semibold">Find Help follow-up</h3>
                <p className="mt-2 text-sm">Personal visit or call plans saved: <strong>{journey.personalVisitPlans}</strong></p>
                <p className="text-sm">Completed check-ins: <strong>{journey.visitCheckIns.total}</strong></p>
                <p className="text-sm">Self-reported helpful / partly helpful / not helpful: <strong>{journey.visitCheckIns.helpful} / {journey.visitCheckIns.partlyHelpful} / {journey.visitCheckIns.notHelpful}</strong></p>
                <p className="mt-2 text-xs text-gray-600">A personal plan is not a provider-confirmed appointment. A check-in is the beneficiary’s report, not independently verified service delivery.</p>
              </div>
              <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-4">
                <h3 className="font-semibold">Referral decisions and provider responses</h3>
                <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <p>Consent requested: <strong>{journey.referrals.referral_consent_requested}</strong></p>
                  <p>Beneficiary approved: <strong>{journey.referrals.referral_consent_approved}</strong></p>
                  <p>Beneficiary declined: <strong>{journey.referrals.referral_consent_declined}</strong></p>
                  <p>Provider accepted: <strong>{journey.referrals.referral_accepted}</strong></p>
                  <p>Provider declined: <strong>{journey.referrals.referral_declined}</strong></p>
                  <p>Returned: <strong>{journey.referrals.referral_returned}</strong></p>
                  <p>Service delivered recorded: <strong>{journey.referrals.referral_service_delivered}</strong></p>
                </div>
                <p className="mt-2 text-xs text-gray-600">Distinct referrals with each recorded event in this period. A referral can appear in several stages; this is not a conversion funnel or independently verified outcome.</p>
              </div>
              <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-4">
                <h3 className="font-semibold">Provider response timeliness</h3>
                {partnerPerformance === undefined ? <p role="status" className="mt-2 text-sm">Loading response measures…</p> : <>
                  <p className="mt-2 text-sm">Responded: <strong>{partnerPerformance.totals.responded}</strong> · Open beyond provider response target: <strong>{partnerPerformance.totals.overdueOpen}</strong></p>
                  <p className="mt-2 text-xs text-gray-600">Each provider uses its configured response target, or 72 hours when none is set. The first recorded provider response determines timeliness; a response does not establish service delivery.</p>
                </>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Identified Visitors</p>
                <p className="text-2xl font-bold">{metrics.totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Browsers with a recorded visitor ID</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Views</p>
                <p className="text-2xl font-bold">{metrics.totalPageViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Recorded website page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">PDF download requests</p>
                <p className="text-2xl font-bold">{metrics.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Requests, not confirmed file delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Session measures</p>
                <p className="text-2xl font-bold">Unavailable</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Session boundaries are not recorded</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Traffic Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="visitors" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-4">{index + 1}</span>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{page.views.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.contentPerformance.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{content.title}</h4>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {content.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {content.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {content.downloads}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={metrics.trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {metrics.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.deviceTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  {metrics.realTimeStats.activeUsers}
                </div>
                <p className="text-gray-600">Distinct visitors with an event in the last 5 minutes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-500 mb-2">
                  {metrics.realTimeStats.currentPageViews}
                </div>
                <p className="text-gray-600">Pages viewed in last hour</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
