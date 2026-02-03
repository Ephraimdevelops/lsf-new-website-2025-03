import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";
import {
    FileText,
    Download,
    Users,
    TrendingUp,
    DollarSign,
    MessageCircle,
    ArrowRight,
    Loader2,
    BookOpen,
    UserPlus,
    Brain,
    Activity,
} from "lucide-react";

// ==========================================
// MISSION CONTROL ANALYTICS DASHBOARD
// Comprehensive metrics visualization
// ==========================================

// Color palette
const COLORS = {
    primary: "#931E5C",
    secondary: "#7A184C",
    accent: "#F59E0B",
    success: "#22C55E",
    danger: "#DC2626",
    chart: ["#931E5C", "#F59E0B", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899"],
};

// Metric Card Component
const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = COLORS.primary,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
    color?: string;
}) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold mt-1" style={{ color }}>
                    {value}
                </p>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                {trend && (
                    <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${!trend.isPositive && "rotate-180"}`} />
                        {trend.value}% from last period
                    </div>
                )}
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
        </div>
    </div>
);

// Section Header
const SectionHeader = ({ title, icon: Icon, description }: { title: string; icon: any; description: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#931E5C] to-[#7A184C] rounded-lg">
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

// Funnel Chart Component
const FunnelChart = ({ data }: { data: { stage: string; count: number; label: string }[] }) => {
    const maxCount = Math.max(...data.map((d) => d.count)) || 1;

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={item.stage} className="relative">
                    <div className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-600">{item.stage}</div>
                        <div className="flex-1 relative">
                            <div
                                className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                                style={{
                                    width: `${(item.count / maxCount) * 100}%`,
                                    minWidth: "60px",
                                    background: `linear-gradient(90deg, ${COLORS.primary}${100 - index * 25} 0%, ${COLORS.primary}${80 - index * 20} 100%)`,
                                }}
                            >
                                <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-28">{item.label}</p>
                    {index < data.length - 1 && (
                        <div className="flex justify-center my-2">
                            <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Loading Skeleton
const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
    </div>
);

// Main Dashboard Component
export default function AnalyticsDashboard() {
    // Fetch all analytics data
    const knowledgeStats = useQuery(api.analytics.getKnowledgeStats, { days: 30 });
    const paralegalFunnel = useQuery(api.analytics.getParalegalFunnel, { days: 30 });
    const costMetrics = useQuery(api.analytics.getCostMetrics, { days: 30 });
    const topicStats = useQuery(api.analytics.getChatTopicStats, { days: 30 });
    const dailyChats = useQuery(api.analytics.getDailyChats, { days: 30 });
    const userGrowth = useQuery(api.analytics.getUserGrowth, { days: 30 });

    const isLoading = !knowledgeStats || !paralegalFunnel || !costMetrics || !topicStats || !dailyChats || !userGrowth;

    if (isLoading) {
        return (
            <div className="p-6 space-y-8">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#931E5C]" />
                    <span className="ml-3 text-gray-600">Loading Mission Control...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
                    <p className="text-gray-500">Real-time platform intelligence • Last 30 days</p>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live
                </div>
            </div>

            {/* ==========================================
          SECTION A: KNOWLEDGE HUB
          ========================================== */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <SectionHeader
                    title="Knowledge Hub"
                    icon={BookOpen}
                    description="Publications & News Distribution"
                />

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                        title="Total Downloads"
                        value={knowledgeStats.totalDownloads.toLocaleString()}
                        subtitle="PDFs distributed"
                        icon={Download}
                        color={COLORS.success}
                    />
                    <MetricCard
                        title="News Views"
                        value={knowledgeStats.totalNewsViews.toLocaleString()}
                        subtitle="Articles read"
                        icon={FileText}
                        color={COLORS.primary}
                    />
                    <MetricCard
                        title="Knowledge Impact"
                        value={(knowledgeStats.totalDownloads + knowledgeStats.totalNewsViews).toLocaleString()}
                        subtitle="Total content consumed"
                        icon={TrendingUp}
                        color={COLORS.accent}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top PDFs Bar Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 5 Downloaded PDFs</h3>
                        {knowledgeStats.topPDFs.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={knowledgeStats.topPDFs} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="title"
                                        width={150}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => value.length > 20 ? value.slice(0, 20) + "..." : value}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="downloads" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                No download data yet
                            </div>
                        )}
                    </div>

                    {/* Top News List */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Most Read Articles</h3>
                        {knowledgeStats.topNews.length > 0 ? (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {knowledgeStats.topNews.slice(0, 5).map((article, index) => (
                                    <div
                                        key={article.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-[#931E5C] text-white flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-[#931E5C]">{article.views}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                No article views yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ==========================================
          SECTION B: HUMAN NETWORK (Paralegal Funnel)
          ========================================== */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <SectionHeader
                    title="Human Network"
                    icon={UserPlus}
                    description="Paralegal Recruitment Funnel"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Funnel Visualization */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recruitment Pipeline</h3>
                        <FunnelChart data={paralegalFunnel.funnel} />
                    </div>

                    {/* Conversion Metrics */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-[#931E5C] to-[#7A184C] rounded-xl p-6 text-white">
                            <p className="text-sm opacity-80">Conversion Rate</p>
                            <p className="text-4xl font-bold mt-2">{paralegalFunnel.conversionRate}%</p>
                            <p className="text-sm mt-2 opacity-80">Page View → Complete</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Drop-off: View → Start</p>
                            <p className="text-2xl font-bold text-red-500">{paralegalFunnel.dropoffRate1}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Drop-off: Start → Complete</p>
                            <p className="text-2xl font-bold text-red-500">{paralegalFunnel.dropoffRate2}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==========================================
          SECTION C: SAADA INTELLIGENCE
          ========================================== */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <SectionHeader
                    title="Saada Intelligence"
                    icon={Brain}
                    description="AI Performance & Cost Analytics"
                />

                {/* Burn Rate Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                        title="Total Sessions"
                        value={costMetrics.sessionCount.toLocaleString()}
                        subtitle="Citizens helped"
                        icon={MessageCircle}
                        color={COLORS.primary}
                    />
                    <MetricCard
                        title="Total Tokens"
                        value={costMetrics.totalTokens.toLocaleString()}
                        subtitle="API usage"
                        icon={Activity}
                        color={COLORS.secondary}
                    />
                    <MetricCard
                        title="Total Cost"
                        value={`$${costMetrics.totalCost.toFixed(2)}`}
                        subtitle="GPT-4o pricing"
                        icon={DollarSign}
                        color={COLORS.accent}
                    />
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-80">Cost per Help</p>
                        <p className="text-3xl font-bold mt-1">${costMetrics.costPerChat.toFixed(2)}</p>
                        <p className="text-sm mt-2 opacity-80">Proves ROI to donors</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Topic Breakdown Pie Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Topic Breakdown</h3>
                        {topicStats.topics.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={topicStats.topics}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                                        labelLine={true}
                                    >
                                        {topicStats.topics.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} chats`, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                <Brain className="w-12 h-12 mb-2 opacity-50" />
                                <p>No classified chats yet</p>
                                <p className="text-sm">AI classifier will populate this</p>
                            </div>
                        )}
                    </div>

                    {/* Daily Chats Line Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Chats per Day (30 Days)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={dailyChats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" })}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    labelFormatter={(value) => new Date(value).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="chats"
                                    stroke={COLORS.primary}
                                    strokeWidth={2}
                                    dot={{ fill: COLORS.primary, r: 3 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ==========================================
          SECTION D: USER GROWTH
          ========================================== */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <SectionHeader
                    title="User Growth"
                    icon={Users}
                    description="Platform Adoption Over Time"
                />

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                        title="Total Users"
                        value={userGrowth.totalUsers.toLocaleString()}
                        subtitle="Registered accounts"
                        icon={Users}
                        color={COLORS.primary}
                    />
                    <MetricCard
                        title="New This Period"
                        value={`+${userGrowth.newUsersInPeriod.toLocaleString()}`}
                        subtitle="Last 30 days"
                        icon={UserPlus}
                        color={COLORS.success}
                    />
                    <MetricCard
                        title="Daily Average"
                        value={Math.round(userGrowth.newUsersInPeriod / 30).toLocaleString()}
                        subtitle="New users/day"
                        icon={TrendingUp}
                        color={COLORS.accent}
                    />
                </div>

                {/* Area Chart */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Cumulative User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={userGrowth.data}>
                            <defs>
                                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" })}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                                formatter={(value, name) => [value, name === "users" ? "Total Users" : "New Users"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke={COLORS.primary}
                                strokeWidth={2}
                                fill="url(#userGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
