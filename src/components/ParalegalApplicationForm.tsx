import { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import type { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users, MapPin, GraduationCap, Heart, Send, CheckCircle, WifiOff, AlertCircle
} from 'lucide-react';
import { Honeypot, useHoneypot } from '@/components/Honeypot';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useVisitorId } from '@/hooks/useVisitorId';

const ParalegalApplicationForm = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const application = useQuery(api.paralegals.getMyApplication, isSignedIn ? {} : 'skip');
    // 1. Network Status
    const isOnline = useOnlineStatus();

    // 2. Honeypot Protection
    const { honeypotValue, honeypotProps, isBotDetected } = useHoneypot('roleTitle');

    // 3. Form Persistence
    const initialFormState = {
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        region: '',
        district: '',
        ward: '',
        education: '',
        experience: '',
        motivation: '',
        languages: [] as string[],
    };

    const [formData, setFormData, clearStorage] = useFormPersistence(
        'lsf_paralegal_application_v1',
        initialFormState
    );

    // Local UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [identityFile, setIdentityFile] = useState<File | null>(null);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // =====================================================
    // ANALYTICS: Track signup funnel
    // =====================================================
    // =====================================================
    const logEvent = useMutation(api.analytics.logEvent);
    const visitorId = useVisitorId();
    const hasLoggedStart = useRef(false);

    const trackSignupStart = () => {
        if (!hasLoggedStart.current) {
            hasLoggedStart.current = true;
            logEvent({
                type: "paralegal_signup_start",
                resourceId: "/paralegal-signup",
                resourceType: "recruitment",
                visitorId: visitorId,
            });
        }
    };

    const trackSignupComplete = () => {
        logEvent({
            type: "paralegal_signup_complete",
            resourceId: "/paralegal-signup",
            resourceType: "recruitment",
            visitorId: visitorId,
            meta: { region: formData.region, education: formData.education },
        });
    };
    // =====================================================

    // Convex Mutation
    const submitApplication = useMutation(api.formSubmissions.submitParalegalApplication);
    const generateUploadUrl = useMutation(api.formSubmissions.generateParalegalDocumentUploadUrl);
    const uploadDocument = async (file: File): Promise<Id<'_storage'>> => {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} exceeds the 10 MB limit.`);
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) throw new Error(`${file.name} must be a PDF, JPG or PNG.`);
        const url = await generateUploadUrl({});
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
        if (!response.ok) throw new Error(`Could not upload ${file.name}. Please retry.`);
        const result = await response.json();
        return result.storageId as Id<'_storage'>;
    };

    // Options Lists
    const regions = [
        'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera',
        'Katavi', 'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara',
        'Mbeya', 'Morogoro', 'Mtwara', 'Mwanza', 'Njombe', 'Pemba North',
        'Pemba South', 'Pwani', 'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu',
        'Singida', 'Songwe', 'Tabora', 'Tanga', 'Zanzibar North',
        'Zanzibar South and Central', 'Zanzibar West'
    ];

    const educationLevels = [
        'Primary School',
        'Secondary School (O-Level)',
        'Secondary School (A-Level)',
        'Certificate',
        'Diploma',
        'Bachelor\'s Degree',
        'Master\'s Degree or Higher'
    ];

    const languageOptions = ['Swahili', 'English', 'French', 'Arabic', 'Other Local Languages'];

    // Handlers
    const handleLanguageToggle = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Security Check: Honeypot
        if (isBotDetected()) {
            console.log('[Security] Bot detected via honeypot');
            setIsSubmitted(true);
            clearStorage();
            return;
        }

        // 2. Network Check
        if (!isOnline) {
            setError('You are currently offline. Your progress is saved locally. Please try again when connection is restored.');
            return;
        }

        // 3. Validation
        if (!identityFile || !certificateFile) {
            setError('Please attach your identity document and paralegal credential.');
            return;
        }
        if (!formData.fullName || !(user?.primaryEmailAddress?.emailAddress || formData.email) || !formData.phone ||
            !formData.region || !formData.district || !formData.education ||
            !formData.experience || !formData.motivation) {
            setError('Please fill in all required fields marked with *');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const idDocumentStorageId = await uploadDocument(identityFile);
            const certificateStorageId = await uploadDocument(certificateFile);
            const resumeStorageId = resumeFile ? await uploadDocument(resumeFile) : undefined;
            const result = await submitApplication({
                fullName: formData.fullName,
                email: user?.primaryEmailAddress?.emailAddress ?? formData.email,
                phone: formData.phone,
                region: formData.region,
                district: formData.district,
                ward: formData.ward || undefined,
                education: formData.education,
                experience: formData.experience,
                motivation: formData.motivation,
                languages: formData.languages.length > 0 ? formData.languages : undefined,
                idDocumentStorageId,
                certificateStorageId,
                resumeStorageId,
                roleTitle: honeypotValue,
            });

            if (result.success) {
                // =====================================================
                // ANALYTICS: Track signup completion
                // =====================================================
                trackSignupComplete();
                // =====================================================

                setIsSubmitted(true);
                clearStorage();
            } else {
                setError(result.message || 'Failed to submit application.');
            }
        } catch (err: any) {
            console.error('Application submission error:', err);
            if (err.message && err.message.includes('Rate limit')) {
                setError('You are submitting too fast. Please wait a moment.');
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Success State
    if (isSubmitted) {
        return (
            <Card className="shadow-xl">
                <CardContent className="py-16 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
                    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                        Thank you for your interest in becoming a paralegal. We will review your
                        application. You can check its status from the same account on the website or mobile app.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Return Home
                        </Button>
                        <Button asChild><Link to="/dashboard/user">My dashboard</Link></Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isSignedIn) return <Card><CardContent className="p-8"><h3 className="text-xl font-bold">Sign in to apply</h3><p className="mt-2 text-neutral-600">Use the same account on the website and mobile app. Your application and review status will stay linked to it.</p><Button asChild className="mt-5"><Link to="/login?redirect_url=%2Fbecome-a-paralegal">Sign in or create an account</Link></Button></CardContent></Card>;
    if (application && !(application.status === 'pending' && application.intakeOrigin)) return <Card><CardContent className="p-8"><h3 className="text-xl font-bold">Your application</h3><p className="mt-2 text-neutral-600">Status: {application.status.replaceAll('_', ' ')}. Sign in on either platform with this account to follow your next steps.</p><Button asChild className="mt-5"><Link to="/dashboard/user">Open dashboard</Link></Button></CardContent></Card>;

    // Render Form
    return (
        <Card className="shadow-xl relative overflow-hidden">
            {/* Offline Banner */}
            {!isOnline && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 z-10">
                    <WifiOff className="w-4 h-4" />
                    You are offline. Your progress is saved automatically.
                </div>
            )}

            <CardContent className="p-8 pt-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* HONEYPOT COMPONENT */}
                    <Honeypot {...honeypotProps} />

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                    {application?.intakeOrigin && <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">LSF has created an invitation for your account. Complete this form and attach your documents so the team can review it.</div>}

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    onFocus={trackSignupStart}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your full name"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={user?.primaryEmailAddress?.emailAddress ?? formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={trackSignupStart}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="your.email@example.com"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    onFocus={trackSignupStart}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="+255 XXX XXX XXX"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Leave empty if same as phone"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Region *</label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">District *</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your district"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Ward (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.ward}
                                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Your ward"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education & Experience */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            Education & Experience
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Education Level *</label>
                                <select
                                    value={formData.education}
                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Education Level</option>
                                    {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Relevant Experience *</label>
                                <select
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Experience</option>
                                    <option value="none">No prior experience</option>
                                    <option value="community_work">Community work/volunteering</option>
                                    <option value="legal_aid">Legal aid/paralegal work</option>
                                    <option value="ngo">NGO/Civil society</option>
                                    <option value="government">Government/public service</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Languages Spoken</label>
                            <div className="flex flex-wrap gap-2">
                                {languageOptions.map(lang => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => handleLanguageToggle(lang)}
                                        disabled={isSubmitting}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.languages.includes(lang)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            Motivation
                        </h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Why do you want to become a paralegal? *
                            </label>
                            <textarea
                                value={formData.motivation}
                                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                onFocus={trackSignupStart}
                                rows={5}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                placeholder="Tell us about your passion for justice and community service. What motivates you to help others access legal aid?"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                        <h3 className="text-lg font-bold">Verification documents</h3>
                        <p className="mt-1 text-sm text-neutral-600">PDF, JPG or PNG, up to 10 MB each. Only authorised LSF reviewers can inspect these files.</p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-semibold">Identity document *<input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(event) => setIdentityFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
                            <label className="text-sm font-semibold">Paralegal credential *<input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(event) => setCertificateFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
                            <label className="text-sm font-semibold">CV or supporting document (optional)<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isOnline}
                            className={`w-full py-6 text-lg ${!isOnline && 'cursor-not-allowed opacity-70'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting Application...
                                </span>
                            ) : !isOnline ? (
                                <span className="flex items-center gap-2">
                                    <WifiOff className="h-5 w-5" />
                                    Offline - Saved Locally
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Submit Application
                                </span>
                            )}
                        </Button>
                        <p className="text-center text-sm text-neutral-500 mt-4">
                            By submitting, you agree to our terms and conditions.
                            {!isOnline && " Please restore connection to finalize submission."}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ParalegalApplicationForm;
