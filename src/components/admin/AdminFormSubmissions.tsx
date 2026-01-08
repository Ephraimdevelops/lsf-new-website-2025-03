import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare, Shield, UserCheck, Eye, Trash2, Check, Clock,
    AlertTriangle, Mail, Phone, MapPin, FileText, CheckCircle, XCircle
} from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';

// Types
type ContactSubmission = {
    _id: Id<"contact_submissions">;
    name: string;
    email: string;
    phone?: string;
    category: string;
    subject: string;
    message: string;
    submittedAt: number;
    status: "new" | "read" | "replied" | "archived";
    notes?: string;
};

type WhistleblowerReport = {
    _id: Id<"whistleblower_reports">;
    reportType: string;
    description: string;
    contactEmail?: string;
    contactPhone?: string;
    isAnonymous: boolean;
    submittedAt: number;
    status: "new" | "investigating" | "resolved" | "dismissed";
    priority?: "low" | "medium" | "high" | "critical";
    resolution?: string;
};

type ParalegalApplication = {
    _id: Id<"paralegal_applications">;
    fullName: string;
    email: string;
    phone: string;
    region: string;
    district: string;
    education: string;
    experience: string;
    motivation: string;
    submittedAt: number;
    status: "pending" | "under_review" | "approved" | "rejected";
    reviewNotes?: string;
};

const AdminFormSubmissions = () => {
    const [activeTab, setActiveTab] = useState('contacts');
    const [selectedItem, setSelectedItem] = useState<ContactSubmission | WhistleblowerReport | ParalegalApplication | null>(null);

    // Queries
    const contacts = useQuery(api.formSubmissions.listContactSubmissions, {}) as ContactSubmission[] | undefined;
    const whistleblower = useQuery(api.formSubmissions.listWhistleblowerReports, {}) as WhistleblowerReport[] | undefined;
    const paralegals = useQuery(api.formSubmissions.listParalegalApplications, {}) as ParalegalApplication[] | undefined;
    const paralegalStats = useQuery(api.formSubmissions.getParalegalApplicationStats);

    // Mutations
    const updateContactStatus = useMutation(api.formSubmissions.updateContactStatus);
    const updateWhistleblower = useMutation(api.formSubmissions.updateWhistleblowerReport);
    const reviewParalegal = useMutation(api.formSubmissions.reviewParalegalApplication);
    const deleteContact = useMutation(api.formSubmissions.deleteContact);

    const handleContactStatusChange = async (id: Id<"contact_submissions">, status: "new" | "read" | "replied" | "archived") => {
        await updateContactStatus({ id, status });
    };

    const handleWhistleblowerStatusChange = async (id: Id<"whistleblower_reports">, status: "new" | "investigating" | "resolved" | "dismissed") => {
        await updateWhistleblower({ id, status });
    };

    const handleParalegalReview = async (id: Id<"paralegal_applications">, status: "pending" | "under_review" | "approved" | "rejected") => {
        await reviewParalegal({ id, status });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            new: 'default',
            read: 'secondary',
            replied: 'outline',
            archived: 'secondary',
            investigating: 'default',
            resolved: 'outline',
            dismissed: 'destructive',
            pending: 'default',
            under_review: 'secondary',
            approved: 'outline',
            rejected: 'destructive',
        };
        return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
    };

    const getPriorityBadge = (priority?: string) => {
        if (!priority) return null;
        const colors: Record<string, string> = {
            low: 'bg-gray-100 text-gray-700',
            medium: 'bg-yellow-100 text-yellow-700',
            high: 'bg-orange-100 text-orange-700',
            critical: 'bg-red-100 text-red-700',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>{priority}</span>;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Form Submissions</h1>
                <p className="text-neutral-600 mt-1">Review and manage all form submissions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Contact Messages</p>
                                <p className="text-3xl font-bold text-neutral-900">{contacts?.length || 0}</p>
                                <p className="text-xs text-primary">{contacts?.filter(c => c.status === 'new').length || 0} new</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Whistleblower Reports</p>
                                <p className="text-3xl font-bold text-neutral-900">{whistleblower?.length || 0}</p>
                                <p className="text-xs text-orange-600">{whistleblower?.filter(w => w.status === 'new').length || 0} pending</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Shield className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Paralegal Applications</p>
                                <p className="text-3xl font-bold text-neutral-900">{paralegalStats?.total || 0}</p>
                                <p className="text-xs text-green-600">{paralegalStats?.pending || 0} pending review</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Approved Paralegals</p>
                                <p className="text-3xl font-bold text-green-600">{paralegalStats?.approved || 0}</p>
                                <p className="text-xs text-neutral-500">{paralegalStats?.rejected || 0} rejected</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="contacts">
                        Contact Messages ({contacts?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="whistleblower">
                        Whistleblower Reports ({whistleblower?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="paralegals">
                        Paralegal Applications ({paralegals?.length || 0})
                    </TabsTrigger>
                </TabsList>

                {/* Contact Messages */}
                <TabsContent value="contacts">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {contacts?.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className={`p-4 border rounded-xl ${contact.status === 'new' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold">{contact.subject}</h3>
                                                    {getStatusBadge(contact.status)}
                                                    <Badge variant="outline">{contact.category}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{contact.message.slice(0, 200)}...</p>
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {contact.email}
                                                    </span>
                                                    {contact.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3" />
                                                            {contact.phone}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(contact.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {contact.status === 'new' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleContactStatusChange(contact._id, 'read')}>
                                                        Mark Read
                                                    </Button>
                                                )}
                                                {contact.status === 'read' && (
                                                    <Button size="sm" onClick={() => handleContactStatusChange(contact._id, 'replied')}>
                                                        Mark Replied
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" onClick={() => deleteContact({ id: contact._id })}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!contacts || contacts.length === 0) && (
                                    <p className="text-center text-neutral-500 py-8">No contact messages yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Whistleblower Reports */}
                <TabsContent value="whistleblower">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {whistleblower?.map((report) => (
                                    <div
                                        key={report._id}
                                        className={`p-4 border rounded-xl ${report.status === 'new' ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold capitalize">{report.reportType.replace('_', ' ')}</h3>
                                                    {getStatusBadge(report.status)}
                                                    {getPriorityBadge(report.priority)}
                                                    {report.isAnonymous && (
                                                        <Badge variant="secondary">Anonymous</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{report.description.slice(0, 300)}...</p>
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(report.submittedAt).toLocaleDateString()}
                                                    </span>
                                                    {!report.isAnonymous && report.contactEmail && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {report.contactEmail}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {report.status === 'new' && (
                                                    <Button size="sm" onClick={() => handleWhistleblowerStatusChange(report._id, 'investigating')}>
                                                        Start Investigation
                                                    </Button>
                                                )}
                                                {report.status === 'investigating' && (
                                                    <>
                                                        <Button size="sm" onClick={() => handleWhistleblowerStatusChange(report._id, 'resolved')}>
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Resolve
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleWhistleblowerStatusChange(report._id, 'dismissed')}>
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Dismiss
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!whistleblower || whistleblower.length === 0) && (
                                    <p className="text-center text-neutral-500 py-8">No whistleblower reports</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Paralegal Applications */}
                <TabsContent value="paralegals">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {paralegals?.map((app) => (
                                    <div
                                        key={app._id}
                                        className={`p-4 border rounded-xl ${app.status === 'pending' ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold">{app.fullName}</h3>
                                                    {getStatusBadge(app.status)}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                                    <div>
                                                        <span className="text-gray-500">Region:</span> {app.region}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">District:</span> {app.district}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Education:</span> {app.education}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Experience:</span> {app.experience}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <strong>Motivation:</strong> {app.motivation.slice(0, 200)}...
                                                </p>
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {app.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {app.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(app.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {app.status === 'pending' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleParalegalReview(app._id, 'under_review')}>
                                                        Start Review
                                                    </Button>
                                                )}
                                                {app.status === 'under_review' && (
                                                    <>
                                                        <Button size="sm" onClick={() => handleParalegalReview(app._id, 'approved')}>
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleParalegalReview(app._id, 'rejected')}>
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!paralegals || paralegals.length === 0) && (
                                    <p className="text-center text-neutral-500 py-8">No paralegal applications yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminFormSubmissions;
