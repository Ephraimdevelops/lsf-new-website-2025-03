import { useState, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, MapPin, CheckCircle, XCircle, Eye, Search,
    BadgeCheck, Shield, TrendingUp, Filter, Upload
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

// ==========================================
// CSV PARSING & DATA CLEANING UTILITIES
// ==========================================

function cleanPhone(raw: string): string {
    if (!raw) return '';
    // Take the first number if there are multiple separated by / or ,
    let phone = raw.split(/[\/,]/).map(s => s.trim())[0] || '';
    // Remove all spaces
    phone = phone.replace(/\s+/g, '');
    // Replace leading O (letter) with 0 (zero)
    if (phone.startsWith('O') && phone.length > 9) {
        phone = '0' + phone.slice(1);
    }
    // Normalize +255 to 0
    if (phone.startsWith('+255')) {
        phone = '0' + phone.slice(4);
    } else if (phone.startsWith('255') && phone.length > 11) {
        phone = '0' + phone.slice(3);
    }
    // Remove non-digit characters
    phone = phone.replace(/[^\d]/g, '');
    return phone;
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

type CsvRecord = {
    fullName: string;
    email: string;
    phone: string;
    region: string;
    district: string;
    bio?: string;
};

function parseCSV(text: string): CsvRecord[] {
    // Handle multiline fields by joining lines that are inside quotes
    const rawLines = text.split('\n');
    const lines: string[] = [];
    let buffer = '';
    let openQuotes = false;
    for (const line of rawLines) {
        const quoteCount = (line.match(/"/g) || []).length;
        if (openQuotes) {
            buffer += '\n' + line;
            if (quoteCount % 2 === 1) {
                openQuotes = false;
                lines.push(buffer);
                buffer = '';
            }
        } else {
            if (quoteCount % 2 === 1) {
                openQuotes = true;
                buffer = line;
            } else {
                lines.push(line);
            }
        }
    }
    if (buffer) lines.push(buffer);

    // Skip header row
    const records: CsvRecord[] = [];
    const seenKeys = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = parseCSVLine(line);
        // CSV columns: Timestamp, JINA LAKO, Barua pepe, MKOA, WILAYA, TASISI, CHEO, UMRI, JINSIA, NAMBA YA SIMU, (blank)
        const fullName = (cols[1] || '').replace(/^"|"$/g, '').trim();
        let email = (cols[2] || '').replace(/^"|"$/g, '').trim().toLowerCase();
        const region = (cols[3] || '').replace(/^"|"$/g, '').trim();
        const district = (cols[4] || '').replace(/^"|"$/g, '').trim();
        const organization = (cols[5] || '').replace(/^"|"$/g, '').trim();
        const title = (cols[6] || '').replace(/^"|"$/g, '').trim();
        const phone = cleanPhone((cols[9] || '').replace(/^"|"$/g, ''));

        // Skip if no name
        if (!fullName) continue;

        // Skip if phone is too short (invalid)
        if (phone.length < 9) continue;

        // Generate placeholder email if missing
        if (!email) {
            email = `noemail_${phone}@csv-import.local`;
        }

        // Deduplicate by email
        const dedupeKey = email;
        if (seenKeys.has(dedupeKey)) continue;
        seenKeys.add(dedupeKey);

        // Build bio from org + title
        const bioParts = [];
        if (organization) bioParts.push(`Organization: ${organization}`);
        if (title) bioParts.push(`Role: ${title}`);
        const bio = bioParts.length > 0 ? bioParts.join(' | ') : undefined;

        records.push({ fullName, email, phone, region, district, bio });
    }

    return records;
}

// ==========================================
// COMPONENT
// ==========================================

const AdminParalegals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

    // Queries
    const paralegals = useQuery(api.paralegals.listApprovedParalegals, {
        region: regionFilter || undefined,
        verifiedOnly: showVerifiedOnly || undefined,
        includePrivate: true,
    }) as Paralegal[] | undefined;
    const stats = useQuery(api.paralegals.getParalegalStats);

    // Mutations
    const toggleVerified = useMutation(api.paralegals.toggleVerified);
    const addParalegal = useMutation(api.paralegals.addParalegalManually);
    const importBatch = useMutation(api.paralegals.importParalegalsBatch);

    // Manual Add state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        region: '',
        district: '',
    });

    // CSV Import state
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [csvRecords, setCsvRecords] = useState<CsvRecord[]>([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const records = parseCSV(text);
            setCsvRecords(records);
        };
        reader.readAsText(file);
    };

    const handleCsvImport = async () => {
        if (csvRecords.length === 0) return;

        setIsImporting(true);
        let totalImported = 0;
        let totalDuplicates = 0;
        const allErrors: string[] = [];

        try {
            // Send in batches of 50
            const BATCH_SIZE = 50;
            const totalBatches = Math.ceil(csvRecords.length / BATCH_SIZE);

            for (let i = 0; i < csvRecords.length; i += BATCH_SIZE) {
                const batch = csvRecords.slice(i, i + BATCH_SIZE);
                const batchNum = Math.floor(i / BATCH_SIZE) + 1;
                setImportProgress(`Importing batch ${batchNum}/${totalBatches}...`);

                const result = await importBatch({ records: batch });
                totalImported += result.imported;
                totalDuplicates += result.duplicates;
                allErrors.push(...result.errors);
            }

            toast.success(
                `Import complete: ${totalImported} added, ${totalDuplicates} duplicates skipped` +
                (allErrors.length > 0 ? `, ${allErrors.length} errors` : '')
            );

            setIsCsvModalOpen(false);
            setCsvRecords([]);
            setCsvFileName('');
        } catch (error: any) {
            toast.error(error.message || "Import failed");
        } finally {
            setIsImporting(false);
            setImportProgress('');
        }
    };

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
                <div className="flex gap-2">
                    {/* CSV Import Button */}
                    <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Upload className="h-4 w-4" />
                                Import CSV
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Import Paralegals from CSV</DialogTitle>
                                <DialogDescription>
                                    Upload a CSV file to bulk-import paralegals. Duplicates by email will be skipped.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="csvFile">CSV File</Label>
                                    <input
                                        ref={fileInputRef}
                                        id="csvFile"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleCsvFileSelect}
                                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                </div>

                                {csvRecords.length > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="font-semibold text-green-800">
                                            ✅ {csvRecords.length} records ready to import
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            From: {csvFileName}
                                        </p>
                                        <div className="mt-3 text-xs text-green-700 space-y-1">
                                            <p>• Duplicate emails will be skipped automatically</p>
                                            <p>• Phone numbers cleaned & normalized</p>
                                            <p>• All imported as verified & approved</p>
                                        </div>
                                    </div>
                                )}

                                {importProgress && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                        <p className="text-sm text-blue-700 font-medium">{importProgress}</p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleCsvImport}
                                    disabled={csvRecords.length === 0 || isImporting}
                                    className="w-full"
                                >
                                    {isImporting ? importProgress || "Importing..." : `Import ${csvRecords.length} Paralegals`}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Add Paralegal Button */}
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
