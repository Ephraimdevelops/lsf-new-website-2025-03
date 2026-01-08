import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users, MapPin, GraduationCap, Briefcase, CheckCircle,
    FileText, Heart, Scale, Shield, Send, Phone, Mail
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const ParalegalSignup = () => {
    const [formData, setFormData] = useState({
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
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitApplication = useMutation(api.formSubmissions.submitParalegalApplication);

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

    const benefits = [
        { icon: GraduationCap, title: 'Free Training', desc: 'Comprehensive legal aid training program' },
        { icon: Users, title: 'Community Impact', desc: 'Help thousands access justice in your area' },
        { icon: Shield, title: 'Legal Protection', desc: 'Work under LSF\'s legal framework' },
        { icon: Heart, title: 'Support Network', desc: 'Join 500+ paralegals across Tanzania' },
    ];

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

        if (!formData.fullName || !formData.email || !formData.phone ||
            !formData.region || !formData.district || !formData.education ||
            !formData.experience || !formData.motivation) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await submitApplication({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                region: formData.region,
                district: formData.district,
                ward: formData.ward || undefined,
                education: formData.education,
                experience: formData.experience,
                motivation: formData.motivation,
                languages: formData.languages.length > 0 ? formData.languages : undefined,
            });

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError(result.message || 'Failed to submit application.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Application submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-primary via-primary-dark to-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8">
                            <Scale className="h-5 w-5 text-secondary-orange" />
                            <span className="text-sm font-medium">Join Our Network</span>
                        </div>

                        <Typography variant="h1" className="text-4xl md:text-6xl font-black mb-6">
                            Become a <span className="text-secondary-orange">Community Paralegal</span>
                        </Typography>

                        <Typography variant="body" className="text-xl text-white/80 max-w-2xl mx-auto">
                            Help bridge the justice gap in your community. Join over 500 paralegals
                            across Tanzania providing free legal aid to those who need it most.
                        </Typography>
                    </div>
                </Container>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardContent className="pt-6 text-center">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-neutral-600">{benefit.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Application Form */}
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <Typography variant="h2" className="text-3xl md:text-4xl mb-4">
                                Apply to Become a Paralegal
                            </Typography>
                            <Typography variant="body" className="text-neutral-600">
                                Complete the form below and our team will review your application within 5-7 business days.
                            </Typography>
                        </div>

                        {isSubmitted ? (
                            <Card className="shadow-xl">
                                <CardContent className="py-16 text-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                    <Typography variant="h3" className="text-2xl mb-4">Application Submitted!</Typography>
                                    <Typography variant="body" className="text-neutral-600 mb-8 max-w-md mx-auto">
                                        Thank you for your interest in becoming a paralegal. We will review your
                                        application and contact you within 5-7 business days.
                                    </Typography>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                                            Return Home
                                        </Button>
                                        <Button onClick={() => {
                                            setIsSubmitted(false);
                                            setFormData({
                                                fullName: '', email: '', phone: '', whatsapp: '', region: '', district: '',
                                                ward: '', education: '', experience: '', motivation: '', languages: []
                                            });
                                        }}>
                                            Submit Another Application
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-xl">
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                                {error}
                                            </div>
                                        )}

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
                                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                                        placeholder="Your full name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                                        placeholder="your.email@example.com"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                                        placeholder="+255 XXX XXX XXX"
                                                        required
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
                                                    rows={5}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                                    placeholder="Tell us about your passion for justice and community service. What motivates you to help others access legal aid?"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-6 text-lg"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Submitting Application...
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
                                                We'll contact you via the provided email or phone.
                                            </p>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </Container>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <Typography variant="h3" className="text-2xl mb-4">Have Questions?</Typography>
                        <Typography variant="body" className="text-neutral-600 mb-6">
                            Contact our paralegal recruitment team for more information.
                        </Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" className="gap-2">
                                <Phone className="h-4 w-4" />
                                +255 870 119 363
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Mail className="h-4 w-4" />
                                paralegals@lsftz.org
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
        </Layout>
    );
};

export default ParalegalSignup;
