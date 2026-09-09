import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Bot, Users, MessageSquare, Zap, Clock, Activity, ThumbsUp, DollarSign, ShieldAlert } from "lucide-react";

import OpsDashboard from './OpsDashboard';

const AdminSaraAnalytics = () => {
    const [riskDisposition, setRiskDisposition] = useState<"open" | "reviewed" | "escalated" | "case_follow_up" | "false_positive">("open");
    const [riskNotes, setRiskNotes] = useState<Record<string, string>>({});
    const analytics = useQuery(api.sara_chat.getAnalytics);
    const riskEvents = useQuery(api.sara_chat.getRiskEvents, { dispositionStatus: riskDisposition });
    const resolveRiskEvent = useMutation(api.sara_chat.resolveRiskEvent);

    async function markRiskEvent(
        eventId: Id<"saada_risk_events">,
        dispositionStatus: "reviewed" | "escalated" | "case_follow_up" | "false_positive",
    ) {
        await resolveRiskEvent({
            eventId,
            dispositionStatus,
            reviewNote: riskNotes[eventId]?.trim() || undefined,
        });
        setRiskDisposition(dispositionStatus);
    }

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

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-primary" />
                                Saada Governance Events
                            </CardTitle>
                            <CardDescription>
                                Latest policy blocks, emergency keyword bypasses, low-confidence retrievals, and tool-routing events.
                            </CardDescription>
                        </div>
                        <select
                            value={riskDisposition}
                            onChange={(event) => setRiskDisposition(event.target.value as typeof riskDisposition)}
                            className="h-10 rounded-xl border bg-white px-3 text-sm font-medium"
                        >
                            <option value="open">Open</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="escalated">Escalated</option>
                            <option value="case_follow_up">Case follow-up</option>
                            <option value="false_positive">False positive</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    {riskEvents === undefined ? (
                        <p className="text-sm text-muted-foreground">Loading risk events...</p>
                    ) : riskEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No governance events recorded yet.</p>
                    ) : (
                        <div className="overflow-hidden rounded-xl border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Event</th>
                                        <th className="px-4 py-3">Source</th>
                                        <th className="px-4 py-3">Preview</th>
                                        <th className="px-4 py-3">Disposition</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {riskEvents.map((event) => (
                                        <tr key={event._id}>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                {event.eventType.replaceAll("_", " ")}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{event.source}</td>
                                            <td className="max-w-md px-4 py-3 text-gray-600">{event.messagePreview}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {(event.dispositionStatus ?? "open").replaceAll("_", " ")}
                                                {event.reviewNote ? (
                                                    <p className="mt-1 text-xs text-gray-500">{event.reviewNote}</p>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(event.createdAt).toLocaleString()}
                                            </td>
                                            <td className="min-w-[240px] px-4 py-3">
                                                <textarea
                                                    value={riskNotes[event._id] ?? ""}
                                                    onChange={(inputEvent) =>
                                                        setRiskNotes((current) => ({
                                                            ...current,
                                                            [event._id]: inputEvent.target.value,
                                                        }))
                                                    }
                                                    placeholder="Staff note"
                                                    className="mb-2 min-h-16 w-full rounded-lg border px-3 py-2 text-xs"
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    <button className="rounded-full border px-3 py-1 text-xs font-bold text-gray-700" onClick={() => void markRiskEvent(event._id, "reviewed")}>
                                                        Reviewed
                                                    </button>
                                                    <button className="rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary" onClick={() => void markRiskEvent(event._id, "escalated")}>
                                                        Escalate
                                                    </button>
                                                    <button className="rounded-full border px-3 py-1 text-xs font-bold text-gray-700" onClick={() => void markRiskEvent(event._id, "case_follow_up")}>
                                                        Case follow-up
                                                    </button>
                                                    <button className="rounded-full border px-3 py-1 text-xs font-bold text-gray-500" onClick={() => void markRiskEvent(event._id, "false_positive")}>
                                                        False positive
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

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
                            Saada is operating optimally. Knowledge base access is active.
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
