import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, MapPin, CheckCircle, XCircle, Eye, Search,
    BadgeCheck, Shield, TrendingUp, Filter
} from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Paralegal = {
    _id: Id<"paralegal_applications">;
    fullName: string;
    email: string;
    phone: string;
    region: string;
    district: string;
    education: string;
    experience: string;
    status: "pending" | "under_review" | "approved" | "rejected";
    isVerified?: boolean;
    profileViews?: number;
    submittedAt: number;
    approvedAt?: number;
};

const AdminParalegals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

    // Queries
    const paralegals = useQuery(api.paralegals.listApprovedParalegals, {
        region: regionFilter || undefined,
        verifiedOnly: showVerifiedOnly || undefined,
    }) as Paralegal[] | undefined;
    const stats = useQuery(api.paralegals.getParalegalStats);

    // Mutations
    const toggleVerified = useMutation(api.paralegals.toggleVerified);
    const addParalegal = useMutation(api.paralegals.addParalegalManually);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        region: '',
        district: '',
    });

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await addParalegal(formData);
            setIsAddModalOpen(false);
            setFormData({ fullName: '', email: '', phone: '', region: '', district: '' });
            toast.success("Paralegal added successfully");
        } catch (error: any) {
            console.error("Failed to add paralegal", error);
            toast.error(error.message || "Failed to add paralegal");
        } finally {
            setIsSubmitting(false);
        }
    };

    const regions = [
        'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera',
        'Katavi', 'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara',
        'Mbeya', 'Morogoro', 'Mtwara', 'Mwanza', 'Njombe', 'Pemba North',
        'Pemba South', 'Pwani', 'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu',
        'Singida', 'Songwe', 'Tabora', 'Tanga', 'Zanzibar North',
        'Zanzibar South and Central', 'Zanzibar West'
    ];

    const filteredParalegals = paralegals?.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleVerified = async (id: Id<"paralegal_applications">) => {
        await toggleVerified({ id });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Paralegal Management</h1>
                    <p className="text-neutral-600 mt-1">Manage your network of community paralegals</p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Users className="h-4 w-4" />
                            Add Paralegal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Paralegal Manually</DialogTitle>
                            <DialogDescription>
                                Add a verified paralegal directly to the network.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region</Label>
                                    <select
                                        id="region"
                                        required
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Input
                                        id="district"
                                        required
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Paralegal"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Total Paralegals</p>
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
                                <p className="text-sm text-neutral-500">Verified</p>
                                <p className="text-3xl font-bold text-green-600">{stats?.verified || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <BadgeCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-500">Pending Applications</p>
                                <p className="text-3xl font-bold text-orange-600">{stats?.pending || 0}</p>
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
                                <p className="text-sm text-neutral-500">Regions Covered</p>
                                <p className="text-3xl font-bold text-secondary-teal">
                                    {Object.keys(stats?.byRegion || {}).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-secondary-teal" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or district..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="">All Regions</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Button
                            variant={showVerifiedOnly ? "default" : "outline"}
                            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                            className="gap-2"
                        >
                            <BadgeCheck className="h-4 w-4" />
                            Verified Only
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Paralegals List */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Paralegals ({filteredParalegals?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredParalegals?.map((paralegal) => (
                            <div
                                key={paralegal._id}
                                className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary">
                                            {paralegal.fullName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{paralegal.fullName}</h3>
                                            {paralegal.isVerified && (
                                                <Badge className="bg-green-100 text-green-700 gap-1">
                                                    <BadgeCheck className="h-3 w-3" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{paralegal.email}</p>
                                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {paralegal.region}, {paralegal.district}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {paralegal.profileViews || 0} profile views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={paralegal.isVerified ? "outline" : "default"}
                                        onClick={() => handleToggleVerified(paralegal._id)}
                                        className="gap-1"
                                    >
                                        {paralegal.isVerified ? (
                                            <>
                                                <XCircle className="h-4 w-4" />
                                                Unverify
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Verify
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {(!filteredParalegals || filteredParalegals.length === 0) && (
                            <p className="text-center text-neutral-500 py-8">
                                No paralegals found. Approve applications from the Submissions tab.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Region Distribution */}
            {stats?.byRegion && Object.keys(stats.byRegion).length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Regional Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {Object.entries(stats.byRegion)
                                .sort((a, b) => b[1] - a[1])
                                .map(([region, count]) => (
                                    <div
                                        key={region}
                                        className="p-3 bg-gray-50 rounded-xl text-center"
                                    >
                                        <p className="font-bold text-lg text-primary">{count}</p>
                                        <p className="text-xs text-gray-600">{region}</p>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminParalegals;
