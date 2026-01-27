import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Bot, Users, MessageSquare, Zap, Clock, Activity, ThumbsUp, ThumbsDown, DollarSign } from "lucide-react";

import OpsDashboard from './OpsDashboard';

const AdminSaraAnalytics = () => {
    const analytics = useQuery(api.sara_chat.getAnalytics);

    if (!analytics) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const toolData = Object.entries(analytics.toolUsage).map(([name, count]) => ({
        name: name.replace('_', ' ').toUpperCase(),
        count
    }));

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

    // Calculate satisfaction rate
    const satisfactionRate = analytics.feedback?.total > 0
        ? Math.round((analytics.feedback.positive / analytics.feedback.total) * 100)
        : 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Saada AI Overview</h2>
                    <p className="text-muted-foreground mt-1">Real-time performance metrics for the legal assistant.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-100">
                    <Activity className="h-4 w-4 animate-pulse" />
                    System Healthy
                </div>
            </div>

            {/* CONTROL PANEL - KILL SWITCH */}
            <OpsDashboard />

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalMessages}</div>
                        <p className="text-xs text-muted-foreground">Lifetime interactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">Unique conversations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">24h Activity</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.last24h}</div>
                        <p className="text-xs text-muted-foreground">Messages today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{satisfactionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.feedback?.positive || 0} 👍 / {analytics.feedback?.negative || 0} 👎
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Cost</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.tokens?.estimatedCost || '$0.00'}</div>
                        <p className="text-xs text-muted-foreground">{(analytics.tokens?.total || 0).toLocaleString()} tokens</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tool Usage</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Object.values(analytics.toolUsage).reduce((a, b) => a + b, 0)}</div>
                        <p className="text-xs text-muted-foreground">External actions triggered</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Tool Usage Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Tool Utilization</CardTitle>
                        <CardDescription>Frequency of external tool calls (e.g., Paralegal Search).</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            {toolData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={toolData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]}>
                                            {toolData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                    No tool usage data available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution (Placeholder for now, can be role distribution) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>
                            SARA is operating optimally. Knowledge base access is active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">AI Model Status</p>
                                        <p className="text-xs text-gray-500">GPT-4o Online</p>
                                    </div>
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">Paralegal Database</p>
                                        <p className="text-xs text-gray-500">Connected & Indexed</p>
                                    </div>
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSaraAnalytics;
