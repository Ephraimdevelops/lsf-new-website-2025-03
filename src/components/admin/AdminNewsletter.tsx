import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Mail, Users, Send, FileText, Plus, Trash2, Eye, Download,
    TrendingUp, UserPlus, UserMinus, BarChart3, Edit, Archive
} from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';

// Types
type Subscriber = {
    _id: Id<"newsletter_subscribers">;
    email: string;
    firstName?: string;
    lastName?: string;
    subscribedAt: number;
    status: "active" | "unsubscribed" | "bounced";
    source?: string;
    openCount?: number;
    clickCount?: number;
};

type Campaign = {
    _id: Id<"newsletter_campaigns">;
    title: string;
    subject: string;
    previewText?: string;
    content: string;
    pdfUrl?: string;
    coverImageUrl?: string;
    status: "draft" | "scheduled" | "sent" | "archived";
    scheduledAt?: number;
    sentAt?: number;
    createdAt: number;
    recipientCount?: number;
    openRate?: number;
    clickRate?: number;
};

const AdminNewsletter = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCampaignForm, setShowCampaignForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    // Queries
    const subscribers = useQuery(api.newsletter.listSubscribers, {}) as Subscriber[] | undefined;
    const campaigns = useQuery(api.newsletter.listCampaigns, {}) as Campaign[] | undefined;
    const stats = useQuery(api.newsletter.getSubscriberStats);

    // Mutations
    const deleteSubscriber = useMutation(api.newsletter.deleteSubscriber);
    const deleteCampaign = useMutation(api.newsletter.deleteCampaign);
    const sendCampaign = useMutation(api.newsletter.sendCampaign);
    const createCampaign = useMutation(api.newsletter.createCampaign);
    const updateCampaign = useMutation(api.newsletter.updateCampaign);

    // Campaign form state
    const [campaignForm, setCampaignForm] = useState({
        title: '',
        subject: '',
        previewText: '',
        content: '',
    });

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCampaign(campaignForm);
            setShowCampaignForm(false);
            setCampaignForm({ title: '', subject: '', previewText: '', content: '' });
        } catch (error) {
            console.error('Failed to create campaign:', error);
        }
    };

    const handleSendCampaign = async (id: Id<"newsletter_campaigns">) => {
        if (window.confirm('Are you sure you want to send this campaign to all active subscribers?')) {
            try {
                const result = await sendCampaign({ id });
                alert(`Campaign sent to ${result.recipientCount} subscribers!`);
            } catch (error) {
                console.error('Failed to send campaign:', error);
            }
        }
    };

    const handleDeleteSubscriber = async (id: Id<"newsletter_subscribers">) => {
        if (window.confirm('Are you sure you want to delete this subscriber?')) {
            await deleteSubscriber({ id });
        }
    };

    const handleDeleteCampaign = async (id: Id<"newsletter_campaigns">) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            await deleteCampaign({ id });
        }
    };

    const exportSubscribers = () => {
        if (!subscribers) return;
        const csv = [
            ['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Subscribed At'].join(','),
            ...subscribers.map(s => [
                s.email,
                s.firstName || '',
                s.lastName || '',
                s.status,
                s.source || '',
                new Date(s.subscribedAt).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Newsletter Management</h1>
                    <p className="text-neutral-600 mt-1">Manage subscribers, create campaigns, and track engagement</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={exportSubscribers}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Subscribers
                    </Button>
                    <Button onClick={() => setShowCampaignForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Campaign
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Total Subscribers</p>
                                <p className="text-3xl font-bold text-neutral-900">{stats?.total || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Active</p>
                                <p className="text-3xl font-bold text-green-600">{stats?.active || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <UserPlus className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Unsubscribed</p>
                                <p className="text-3xl font-bold text-orange-600">{stats?.unsubscribed || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <UserMinus className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Campaigns Sent</p>
                                <p className="text-3xl font-bold text-secondary-teal">
                                    {campaigns?.filter(c => c.status === 'sent').length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center">
                                <Send className="h-6 w-6 text-secondary-teal" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Subscribers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Recent Subscribers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {subscribers?.slice(0, 5).map((sub) => (
                                        <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{sub.email}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(sub.subscribedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                                                {sub.status}
                                            </Badge>
                                        </div>
                                    ))}
                                    {(!subscribers || subscribers.length === 0) && (
                                        <p className="text-neutral-500 text-center py-4">No subscribers yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Campaigns */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Recent Campaigns
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {campaigns?.slice(0, 5).map((campaign) => (
                                        <div key={campaign._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{campaign.title}</p>
                                                <p className="text-sm text-gray-500">{campaign.subject}</p>
                                            </div>
                                            <Badge variant={
                                                campaign.status === 'sent' ? 'default' :
                                                    campaign.status === 'draft' ? 'secondary' :
                                                        campaign.status === 'scheduled' ? 'outline' : 'destructive'
                                            }>
                                                {campaign.status}
                                            </Badge>
                                        </div>
                                    ))}
                                    {(!campaigns || campaigns.length === 0) && (
                                        <p className="text-neutral-500 text-center py-4">No campaigns yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Subscribers Tab */}
                <TabsContent value="subscribers">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Subscribers ({subscribers?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Email</th>
                                            <th className="text-left py-3 px-4">Name</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Source</th>
                                            <th className="text-left py-3 px-4">Subscribed</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribers?.map((sub) => (
                                            <tr key={sub._id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{sub.email}</td>
                                                <td className="py-3 px-4">
                                                    {sub.firstName || sub.lastName
                                                        ? `${sub.firstName || ''} ${sub.lastName || ''}`.trim()
                                                        : '-'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                                                        {sub.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">{sub.source || 'website'}</td>
                                                <td className="py-3 px-4">
                                                    {new Date(sub.subscribedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteSubscriber(sub._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>All Campaigns ({campaigns?.length || 0})</CardTitle>
                            <Button onClick={() => setShowCampaignForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Campaign
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campaigns?.map((campaign) => (
                                    <div key={campaign._id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold">{campaign.title}</h3>
                                                <Badge variant={
                                                    campaign.status === 'sent' ? 'default' :
                                                        campaign.status === 'draft' ? 'secondary' :
                                                            campaign.status === 'scheduled' ? 'outline' : 'destructive'
                                                }>
                                                    {campaign.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                                <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                                                {campaign.sentAt && (
                                                    <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                                                )}
                                                {campaign.recipientCount && (
                                                    <span>Recipients: {campaign.recipientCount}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {campaign.status === 'draft' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSendCampaign(campaign._id)}
                                                >
                                                    <Send className="h-4 w-4 mr-1" />
                                                    Send
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCampaign(campaign._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {(!campaigns || campaigns.length === 0) && (
                                    <p className="text-neutral-500 text-center py-8">
                                        No campaigns yet. Create your first campaign to get started!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Campaign Creation Modal */}
            {showCampaignForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
                        <form onSubmit={handleCreateCampaign} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Campaign Title</label>
                                <input
                                    type="text"
                                    value={campaignForm.title}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., January 2026 Newsletter"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Subject</label>
                                <input
                                    type="text"
                                    value={campaignForm.subject}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., LSF Updates: New Programs & Impact Stories"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Preview Text</label>
                                <input
                                    type="text"
                                    value={campaignForm.previewText}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, previewText: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Brief preview shown in email clients..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Content (HTML)</label>
                                <textarea
                                    value={campaignForm.content}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                    placeholder="<h1>Hello!</h1><p>Your newsletter content here...</p>"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => setShowCampaignForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Campaign
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNewsletter;
