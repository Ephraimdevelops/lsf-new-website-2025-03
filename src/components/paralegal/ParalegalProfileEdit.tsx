
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Upload } from 'lucide-react';
import { Id } from '../../../convex/_generated/dataModel';

interface ParalegalProfileEditProps {
    paralegal: {
        _id: Id<"paralegal_applications">;
        fullName: string;
        phone: string;
        region: string;
        district: string;
        ward?: string;
        bio?: string;
        photoUrl?: string;
        specializations?: string[];
        availabilityStatus?: "accepting_cases" | "limited" | "paused" | "unavailable";
        weeklyCapacity?: number;
        workingHours?: string;
        availabilityNotes?: string;
    };
}

const ParalegalProfileEdit = ({ paralegal }: ParalegalProfileEditProps) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const generateUploadUrl = useMutation(api.media.generateUploadUrl);
    const saveMedia = useMutation(api.media.saveMedia);
    const updateProfile = useMutation(api.paralegals.updateParalegalProfile);

    const [formData, setFormData] = useState({
        fullName: paralegal.fullName,
        phone: paralegal.phone,
        ward: paralegal.ward || '',
        bio: paralegal.bio || '',
        photoUrl: paralegal.photoUrl || '',
        specializations: paralegal.specializations?.join(', ') || '',
        availabilityStatus: paralegal.availabilityStatus || 'accepting_cases',
        weeklyCapacity: String(paralegal.weeklyCapacity ?? 3),
        workingHours: paralegal.workingHours || '',
        availabilityNotes: paralegal.availabilityNotes || ''
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setUploadProgress(10);

            // 1. Get upload URL
            const postUrl = await generateUploadUrl();
            setUploadProgress(30);

            // 2. Upload to storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();
            setUploadProgress(60);

            // 3. Save media record and get public URL
            const url = await saveMedia({
                storageId,
                name: file.name,
                type: file.type,
                size: file.size,
            });
            setUploadProgress(90);

            // 4. Update form state
            setFormData(prev => ({ ...prev, photoUrl: url }));
            toast({ title: "Image uploaded successfully" });

        } catch (error) {
            console.error(error);
            toast({ title: "Upload failed", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateProfile({
                id: paralegal._id,
                fullName: formData.fullName,
                phone: formData.phone,
                ward: formData.ward,
                bio: formData.bio,
                photoUrl: formData.photoUrl,
                specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
                availabilityStatus: formData.availabilityStatus as "accepting_cases" | "limited" | "paused" | "unavailable",
                weeklyCapacity: Number.parseInt(formData.weeklyCapacity, 10) || 0,
                workingHours: formData.workingHours,
                availabilityNotes: formData.availabilityNotes
            });

            toast({ title: "Profile updated successfully" });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ title: "Update failed", description: "Please try again later", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Public Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-sm text-gray-500">Tap to upload new photo</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ward</Label>
                            <Input
                                value={formData.ward}
                                onChange={e => setFormData({ ...formData, ward: e.target.value })}
                                placeholder="e.g. Kinondoni"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>District/Region</Label>
                            <Input value={`${paralegal.district}, ${paralegal.region}`} disabled className="bg-gray-50" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Specializations (comma separated)</Label>
                        <Input
                            value={formData.specializations}
                            onChange={e => setFormData({ ...formData, specializations: e.target.value })}
                            placeholder="e.g. Land Law, Family Law, Gender Rights"
                        />
                    </div>

                    <div className="rounded-xl border bg-[#fbf7f8] p-4 space-y-4">
                        <div>
                            <Label>Availability for new Haki Yangu cases</Label>
                            <select
                                value={formData.availabilityStatus}
                                onChange={e => setFormData({ ...formData, availabilityStatus: e.target.value })}
                                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="accepting_cases">Accepting new cases</option>
                                <option value="limited">Limited availability</option>
                                <option value="paused">Temporarily paused</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Weekly case capacity</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={formData.weeklyCapacity}
                                    onChange={e => setFormData({ ...formData, weeklyCapacity: e.target.value })}
                                    placeholder="e.g. 3"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Working hours</Label>
                                <Input
                                    value={formData.workingHours}
                                    onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                                    placeholder="e.g. Mon-Fri, 9:00-16:00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Availability notes for LSF staff</Label>
                            <Textarea
                                value={formData.availabilityNotes}
                                onChange={e => setFormData({ ...formData, availabilityNotes: e.target.value })}
                                placeholder="Add routing constraints, travel limits, or temporary notes for assignment decisions."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Short Bio</Label>
                        <Textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell clients about your experience and expertise..."
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ParalegalProfileEdit;
