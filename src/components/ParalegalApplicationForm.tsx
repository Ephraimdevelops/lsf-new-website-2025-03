import { useCopy } from "@/i18n/useCopy";
import { usePlainError } from "@/i18n/usePlainError";
import { useLanguage } from "@/providers/LanguageProvider";
import { displayLabel } from "../../shared/plainLanguage";
import { BrandLoadingIcon } from '@/components/shared/BrandLoading';
import { useState, useRef, useLayoutEffect } from 'react';
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

const AccountApplicationForm = () => {
    const c = useCopy(); const readError = usePlainError(); const { locale } = useLanguage();
    const { isSignedIn, userId } = useAuth();
    const { user } = useUser();
    const accountActive = useRef(true);
    useLayoutEffect(() => {
        accountActive.current = true;
        return () => { accountActive.current = false; };
    }, []);
    function ensureCurrentAccount() {
        if (!accountActive.current) throw new Error("Application account changed.");
    }
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
        initialFormState,
        isSignedIn ? userId ?? null : null,
        'session'
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
        ensureCurrentAccount();
        if (file.size > 10 * 1024 * 1024) throw new Error("Choose a file up to 10 MB.");
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) throw new Error("Choose a PDF, JPG or PNG file.");
        const url = await generateUploadUrl({});
        ensureCurrentAccount();
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
        ensureCurrentAccount();
        if (!response.ok) throw new Error("File upload failed. Try again.");
        const result = await response.json();
        ensureCurrentAccount();
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
        if (!accountActive.current) return;

        // 1. Security Check: Honeypot
        if (isBotDetected()) {
            console.log('[Security] Bot detected via honeypot');
            setIsSubmitted(true);
            clearStorage();
            return;
        }

        // 2. Network Check
        if (!isOnline) {
            setError(c("You are currently offline. Your progress is saved locally. Please try again when connection is restored."));
            return;
        }

        // 3. Validation
        if (!identityFile || !certificateFile) {
            setError(c("Please attach your identity document and paralegal credential."));
            return;
        }
        if (!formData.fullName || !(user?.primaryEmailAddress?.emailAddress || formData.email) || !formData.phone ||
            !formData.region || !formData.district || !formData.education ||
            !formData.experience || !formData.motivation) {
            setError(c("Please fill in all required fields marked with *"));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const idDocumentStorageId = await uploadDocument(identityFile);
            const certificateStorageId = await uploadDocument(certificateFile);
            const resumeStorageId = resumeFile ? await uploadDocument(resumeFile) : undefined;
            ensureCurrentAccount();
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

            ensureCurrentAccount();
            if (result.success) {
                // =====================================================
                // ANALYTICS: Track signup completion
                // =====================================================
                trackSignupComplete();
                // =====================================================

                setIsSubmitted(true);
                clearStorage();
            } else {
                setError(c(result.message || 'Failed to submit application.'));
            }
        } catch (err: any) {
            if (!accountActive.current) return;
            console.error('Application submission error:', err);
            if (err.message && err.message.includes('Rate limit')) {
                setError(c("You are submitting too fast. Please wait a moment."));
            } else {
                setError(err instanceof Error && ['Choose a file up to 10 MB.', 'Choose a PDF, JPG or PNG file.', 'File upload failed. Try again.'].includes(err.message) ? c(err.message) : readError(err, "Could not confirm application submission. Check its status before retrying."));
            }
        } finally {
            if (accountActive.current) setIsSubmitting(false);
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
                    <h3 className="text-2xl font-bold mb-4">{c("Application Submitted!")}</h3>
                    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                        {c("Thank you for your interest in becoming a paralegal. We will review your application. You can check its status from the same account on the website or mobile app.")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            {c("Return Home")}
                        </Button>
                        <Button asChild><Link to="/dashboard/user">{c("My account")}</Link></Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isSignedIn) return <Card><CardContent className="p-8"><h3 className="text-xl font-bold">{c("Sign in to apply")}</h3><p className="mt-2 text-neutral-600">{c("Use the same account on the website and mobile app. Your application and review status will stay linked to it.")}</p><Button asChild className="mt-5"><Link to="/login?redirect_url=%2Fbecome-a-paralegal">{c("Sign in or create an account")}</Link></Button></CardContent></Card>;
    if (application && !(application.status === 'pending' && application.intakeOrigin)) return <Card><CardContent className="p-8"><h3 className="text-xl font-bold">{c("Your application")}</h3><p className="mt-2 text-neutral-600">{c("Status:")} {displayLabel(application.status, locale)}{c(". Sign in on either platform with this account to follow your next steps.")}</p><Button asChild className="mt-5"><Link to="/dashboard/user">{c("Open my account")}</Link></Button></CardContent></Card>;

    // Render Form
    return (
        <Card className="shadow-xl relative overflow-hidden">
            {/* Offline Banner */}
            {!isOnline && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 z-10">
                    <WifiOff className="w-4 h-4" />
                    {c("You are offline. Your progress is saved automatically.")}
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
                    {application?.intakeOrigin && <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">{c("LSF has created an invitation for your account. Complete this form and attach your documents so the team can review it.")}</div>}

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {c("Personal Information")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Full Name *")}</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    onFocus={trackSignupStart}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder={c("Your full name")}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Email Address *")}</label>
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
                                <label className="block text-sm font-medium mb-2">{c("Phone Number *")}</label>
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
                                <label className="block text-sm font-medium mb-2">{c("WhatsApp Number")}</label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder={c("Leave empty if same as phone")}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {c("Location")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Region *")}</label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">{c("Select Region")}</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("District *")}</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder={c("Your district")}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Ward (Optional)")}</label>
                                <input
                                    type="text"
                                    value={formData.ward}
                                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder={c("Your ward")}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education & Experience */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            {c("Education & Experience")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Education Level *")}</label>
                                <select
                                    value={formData.education}
                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">{c("Select Education Level")}</option>
                                    {educationLevels.map(e => <option key={e} value={e}>{c(e)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">{c("Relevant Experience *")}</label>
                                <select
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">{c("Select Experience")}</option>
                                    <option value="none">{c("No prior experience")}</option>
                                    <option value="community_work">{c("Community work/volunteering")}</option>
                                    <option value="legal_aid">{c("Legal aid/paralegal work")}</option>
                                    <option value="ngo">{c("NGO/Civil society")}</option>
                                    <option value="government">{c("Government/public service")}</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">{c("Languages Spoken")}</label>
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
                                        {c(lang)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            {c("Motivation")}
                        </h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {c("Why do you want to become a paralegal? *")}
                            </label>
                            <textarea
                                value={formData.motivation}
                                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                onFocus={trackSignupStart}
                                rows={5}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                placeholder={c("Tell us about your passion for justice and community service. What motivates you to help others access legal aid?")}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                        <h3 className="text-lg font-bold">{c("Verification documents")}</h3>
                        <p className="mt-1 text-sm text-neutral-600">{c("PDF, JPG or PNG, up to 10 MB each. Only authorised LSF reviewers can inspect these files.")}</p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-semibold">{c("Identity document *")}<input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(event) => setIdentityFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
                            <label className="text-sm font-semibold">{c("Paralegal credential *")}<input type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={(event) => setCertificateFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
                            <label className="text-sm font-semibold">{c("CV or supporting document (optional)")}<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)} disabled={isSubmitting} className="mt-2 block w-full rounded-xl border bg-white p-3 text-sm" /></label>
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
                                    <BrandLoadingIcon size={18}/>
                                    {c("Submitting Application...")}
                                </span>
                            ) : !isOnline ? (
                                <span className="flex items-center gap-2">
                                    <WifiOff className="h-5 w-5" />
                                    {c("Offline - Saved Locally")}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    {c("Submit Application")}
                                </span>
                            )}
                        </Button>
                        <p className="text-center text-sm text-neutral-500 mt-4">
                            {c("By submitting, you agree to our terms and conditions.")}
                            {!isOnline && " Please restore connection to finalize submission."}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

// Changing the signed-in identity remounts all local form/file/receipt state.
const ParalegalApplicationForm = () => {
    const { isSignedIn, userId } = useAuth();
    return <AccountApplicationForm key={isSignedIn && userId ? `account:${userId}` : 'signed-out'} />;
};

export default ParalegalApplicationForm;
