import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Lock, Eye, AlertCircle, CheckCircle, Users, Scale, Heart, Phone, Mail, FileText, MessageSquare, Clock, Globe, Send, WifiOff } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Honeypot, useHoneypot } from '@/components/Honeypot';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const Whistleblower = () => {
  // Network status check
  const isOnline = useOnlineStatus();

  // Honeypot anti-bot protection
  const { honeypotValue, honeypotProps, isBotDetected } = useHoneypot('roleTitle');

  // Form state
  const [formData, setFormData] = useState({
    reportType: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    isAnonymous: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number } | null>(null);

  // Generate unique client identifier for rate limiting
  const [clientId] = useState(() => {
    const stored = localStorage.getItem('lsf_client_id');
    if (stored) return stored;
    const newId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('lsf_client_id', newId);
    return newId;
  });

  const submitReport = useMutation(api.whistleblower.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SECURITY: Check honeypot
    if (isBotDetected()) {
      console.log('[Security] Bot detected via honeypot');
      // Fake success to confuse bots
      setIsSubmitted(true);
      return;
    }

    // Check network
    if (!isOnline) {
      setError('Unganisho wa mtandao haupo. Tafadhali jaribu tena baadaye. / You are offline. Please try again later.');
      return;
    }

    if (!formData.reportType || !formData.description) {
      setError('Tafadhali jaza sehemu zote zinazohitajika. / Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitReport({
        reportType: formData.reportType,
        description: formData.description,
        contactEmail: formData.isAnonymous ? undefined : formData.contactEmail || undefined,
        contactPhone: formData.isAnonymous ? undefined : formData.contactPhone || undefined,
        isAnonymous: formData.isAnonymous,
        clientIdentifier: clientId,
        roleTitle: honeypotValue, // Honeypot value for backend validation
      });

      if (result.remaining !== undefined) {
        setRateLimitInfo({ remaining: result.remaining });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      // Check for rate limit error
      if (err.message?.includes('Rate limit')) {
        setError(err.message);
      } else {
        setError('Kushindwa kutuma ripoti. Tafadhali jaribu tena au tumia simu ya dharura. / Failed to submit report. Please try again or use the hotline.');
      }
      console.error('Whistleblower submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportTypes = [
    { value: 'fraud', label: 'Fraud or Financial Misconduct / Ulaghai wa Fedha' },
    { value: 'misconduct', label: 'Staff Misconduct / Tabia mbaya ya Wafanyakazi' },
    { value: 'harassment', label: 'Harassment or Discrimination / Unyanyasaji' },
    { value: 'safety', label: 'Safety Concerns / Masuala ya Usalama' },
    { value: 'policy', label: 'Policy Violations / Ukiukaji wa Sera' },
    { value: 'conflict', label: 'Conflict of Interest / Mgongano wa Maslahi' },
    { value: 'other', label: 'Other Concerns / Masuala Mengine' },
  ];

  const protectionFeatures = [
    {
      icon: Shield,
      title: "Complete Protection",
      description: "You are fully protected from retaliation when you report concerns in good faith.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: Lock,
      title: "Absolute Confidentiality",
      description: "Your identity and information will be kept confidential to the fullest extent possible.",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Eye,
      title: "Anonymous Reporting",
      description: "You may report completely anonymously, though contact information helps with follow-up.",
      color: "from-secondary-orange to-secondary-orange/80"
    }
  ];

  const impactStats = [
    { value: "98%", label: "Cases Resolved", description: "of reported concerns are thoroughly investigated" },
    { value: "24/7", label: "Available Support", description: "round-the-clock ethics hotline access" },
    { value: "100%", label: "Zero Retaliation", description: "protection guarantee for good faith reports" },
    { value: "48hrs", label: "Response Time", description: "maximum time to acknowledge your report" }
  ];

  return (
    <Layout>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black py-3 px-4 text-center font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span>Mtandao haupo / You are offline. Form submissions will not work.</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-ken-burns"
          style={{ backgroundImage: `url('/lovable-uploads/background with mother umage .png')` }}
        ></div>

        {/* Premium Overlay System */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-primary/80 to-black/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

        <Container className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary-orange rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="bg-white/5 p-6 rounded-full backdrop-blur-md border border-white/10 relative z-10 shadow-2xl">
                <Shield className="h-16 w-16 text-secondary-orange" />
              </div>
            </div>
          </div>

          <Typography variant="overline" className="text-secondary-orange mb-8 text-lg font-bold tracking-[0.3em] uppercase drop-shadow-sm">
            Safe • Secure • Protected
          </Typography>

          <Typography variant="h1" className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
            Speak Up with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-orange to-secondary-yellow">Confidence</span>
          </Typography>

          <Typography variant="body" className="text-2xl mb-12 max-w-4xl mx-auto text-white/80 leading-relaxed font-light drop-shadow-md">
            Your voice matters in maintaining the highest standards of integrity. Report concerns safely,
            knowing you're protected every step of the way.
          </Typography>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white text-xl px-10 py-8 rounded-2xl shadow-lg hover:shadow-secondary-orange/20 transition-all hover:-translate-y-1">
              <MessageSquare className="mr-3 h-6 w-6" />
              Submit Report Now
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-primary text-xl px-10 py-8 rounded-2xl transition-all hover:-translate-y-1">
              <Phone className="mr-3 h-6 w-6" />
              Call Ethics Hotline
            </Button>
          </div>
        </Container>
      </section>

      {/* Protection Guarantee Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              Your Protection is Our Priority
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              We've built multiple layers of protection to ensure you can report with complete confidence.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {protectionFeatures.map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${feature.color} p-8 text-white relative`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h3" className="text-white mb-4 text-2xl">
                      {feature.title}
                    </Typography>
                    <Typography variant="body" className="text-white/90 leading-relaxed">
                      {feature.description}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <Typography variant="h1" className="text-4xl md:text-5xl text-primary mb-2 font-bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="h4" className="mb-2 text-lg">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {stat.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl">
              Your Voice Creates Change
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl">
              Every report helps us build a more ethical, transparent, and accountable organization.
              Join us in maintaining the highest standards of integrity.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4 text-lg">
                <MessageSquare className="mr-3 h-6 w-6" />
                Submit Report
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Phone className="mr-3 h-6 w-6" />
                Call Hotline
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Mail className="mr-3 h-6 w-6" />
                Email Ethics Team
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced Reporting Options */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <Tabs defaultValue="report" className="w-full">
            <div className="text-center mb-12">
              <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
                Multiple Ways to Report
              </Typography>
              <TabsList className="grid grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="report" className="font-calibri text-base">Submit Online</TabsTrigger>
                <TabsTrigger value="policy" className="font-calibri text-base">Our Commitment</TabsTrigger>
                <TabsTrigger value="faq" className="font-calibri text-base">Common Questions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="report">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Main Reporting Section */}
                <div className="bg-white rounded-3xl p-10 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl mr-6">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <Typography variant="h2" className="text-3xl">Secure Online Form</Typography>
                      <Typography variant="body" className="text-neutral-gray">
                        Your most secure and convenient option
                      </Typography>
                    </div>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <Typography variant="h3" className="mb-4 text-2xl">Report Submitted Successfully</Typography>
                      <Typography variant="body" className="text-neutral-gray mb-6">
                        Your report has been securely received. We will investigate within 48 hours.
                        {!formData.isAnonymous && " We may contact you for additional information."}
                      </Typography>
                      {rateLimitInfo && (
                        <Typography variant="bodySmall" className="text-neutral-gray mb-4">
                          You have {rateLimitInfo.remaining} submission(s) remaining this hour.
                        </Typography>
                      )}
                      <Button onClick={() => { setIsSubmitted(false); setFormData({ reportType: '', description: '', contactEmail: '', contactPhone: '', isAnonymous: true }); }}>
                        Submit Another Report
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* HONEYPOT - Hidden from users, visible to bots */}
                      <Honeypot {...honeypotProps} />

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Offline Warning */}
                      {!isOnline && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-center gap-2">
                          <WifiOff className="w-5 h-5" />
                          <span>You are offline. Report cannot be submitted until connection is restored.</span>
                        </div>
                      )}

                      {/* Report Type */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Type of Concern / Aina ya Tatizo *
                        </label>
                        <select
                          value={formData.reportType}
                          onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          disabled={!isOnline}
                        >
                          <option value="">Select type of concern / Chagua aina ya tatizo</option>
                          {reportTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Describe Your Concern / Eleza Tatizo Lako *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          placeholder="Please provide as much detail as possible. Include dates, names, locations, and any evidence you may have... / Tafadhali eleza kwa undani zaidi. Weka tarehe, majina, maeneo, na ushahidi wowote..."
                          required
                          disabled={!isOnline}
                        />
                      </div>

                      {/* Anonymous Toggle */}
                      <div className="flex items-center gap-3 p-4 bg-secondary-orange/10 rounded-xl border border-secondary-orange/20">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={formData.isAnonymous}
                          onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="anonymous" className="flex-1">
                          <span className="font-semibold text-neutral-900">Submit Anonymously / Tuma Bila Jina</span>
                          <p className="text-sm text-neutral-600">Your identity will be completely protected / Utambulisho wako utalindwa</p>
                        </label>
                        <Lock className="h-5 w-5 text-secondary-orange" />
                      </div>

                      {/* Contact Info (if not anonymous) */}
                      {!formData.isAnonymous && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Email (for follow-up)
                            </label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="your.email@example.com"
                              disabled={!isOnline}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                              Phone (optional)
                            </label>
                            <input
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="+255 XXX XXX XXX"
                              disabled={!isOnline}
                            />
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isOnline}
                        className="w-full text-lg py-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting Securely...
                          </span>
                        ) : !isOnline ? (
                          <span className="flex items-center gap-2">
                            <WifiOff className="h-5 w-5" />
                            Offline - Cannot Submit
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Submit Secure Report / Tuma Ripoti
                          </span>
                        )}
                      </Button>

                      <div className="text-center">
                        <Typography variant="body" className="text-neutral-gray mb-2">
                          Need to speak to someone directly?
                        </Typography>
                        <Typography variant="body" className="font-bold text-primary">
                          Ethics Hotline: +255 123 456 789
                        </Typography>
                        <Typography variant="bodySmall" className="text-neutral-gray">
                          Available 24/7 in Swahili and English
                        </Typography>
                      </div>
                    </form>
                  )}
                </div>

                {/* What to Report Section */}
                <div className="space-y-8">
                  <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <Typography variant="h3" className="mb-6 text-2xl flex items-center">
                      <AlertCircle className="mr-3 h-8 w-8 text-secondary-orange" />
                      What Should You Report?
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Fraud or financial misconduct",
                        "Conflicts of interest",
                        "Policy violations",
                        "Safety concerns",
                        "Human rights abuses",
                        "Harassment or discrimination",
                        "Environmental violations",
                        "Data breaches or privacy issues"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <Typography variant="body" className="text-sm">
                            {item}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/5 rounded-3xl p-8 border border-secondary-orange/20">
                    <Typography variant="h4" className="mb-4 text-xl flex items-center">
                      <Heart className="mr-3 h-6 w-6 text-secondary-orange" />
                      Remember: Every Report Matters
                    </Typography>
                    <Typography variant="body" className="text-neutral-gray leading-relaxed">
                      Whether big or small, your concerns help us maintain the highest standards of integrity.
                      If something doesn't feel right, trust your instincts and speak up.
                    </Typography>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="policy">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 font-panton">Whistleblower Protection Policy</h2>
                  <p className="text-neutral-gray mb-6 font-calibri">
                    Our whistleblower policy is designed to encourage staff, volunteers, partners, and other stakeholders to report suspected wrongdoing without fear of retaliation.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Policy Objectives</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">
                        This policy aims to:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-neutral-gray font-calibri">
                        <li>Encourage reporting of suspected wrongdoing as soon as possible</li>
                        <li>Provide guidance on how to raise concerns</li>
                        <li>Reassure whistleblowers that they will be protected from retaliation</li>
                        <li>Establish a fair and transparent investigation process</li>
                        <li>Ensure appropriate action is taken in response to substantiated concerns</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Protection from Retaliation</h3>
                      <p className="text-neutral-gray font-calibri">
                        LSF prohibits retaliation against any person who reports a concern in good faith or participates in an investigation. Retaliation includes dismissal, disciplinary action, threats, harassment, discrimination, or any other unfavorable treatment connected with raising a concern.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Investigation Process</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">
                        All reports will be taken seriously and addressed promptly through the following process:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2 text-neutral-gray font-calibri">
                        <li>Initial assessment of the report</li>
                        <li>Appointment of an appropriate investigator</li>
                        <li>Thorough investigation while maintaining confidentiality</li>
                        <li>Documentation of findings and recommendations</li>
                        <li>Implementation of appropriate corrective actions</li>
                        <li>Follow-up with the whistleblower when possible</li>
                      </ol>
                    </div>

                    <div className="flex justify-center">
                      <Button variant="outline" className="font-calibri">
                        Download Full Policy (PDF)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-panton">Frequently Asked Questions</h2>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-calibri">Who can submit a whistleblower report?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Anyone associated with LSF can submit a report, including employees, volunteers, consultants, partners, beneficiaries, donors, and other stakeholders who have concerns about potential misconduct related to our operations.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-calibri">Can I remain anonymous when reporting?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Yes, you can choose to remain anonymous. However, providing your contact information allows us to follow up with questions that might be important for investigating your concerns. If you do provide your identity, we will make every effort to keep it confidential.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-calibri">What happens after I submit a report?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        After submitting a report, you will receive an acknowledgment within 48 hours. An initial assessment will be conducted to determine if an investigation is needed. If an investigation proceeds, it will be conducted by appropriate personnel who are independent of the issue. You may be contacted for additional information, and you will receive updates on the status when possible.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-calibri">How am I protected from retaliation?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Our policy strictly prohibits retaliation against whistleblowers who report concerns in good faith. If you believe you are experiencing retaliation, report it immediately through the same whistleblower channels. Reports of retaliation will be investigated promptly, and appropriate disciplinary action will be taken against anyone found to have engaged in retaliatory conduct.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-calibri">What if my report involves a senior leader?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Reports involving senior leadership are handled with special protocols to ensure independence and objectivity. Such reports may be directed to the Board of Directors or an external investigator to avoid conflicts of interest. The same protections against retaliation apply regardless of who is named in the report.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-lg font-calibri">What if I'm not sure if what I observed is a violation?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        If you have a reasonable belief that something inappropriate is occurring, we encourage you to report it. It's better to raise a concern that turns out not to be an issue than to remain silent about a potential violation. As long as reports are made in good faith, whistleblowers are protected even if the investigation determines no misconduct occurred.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-8 bg-neutral-light p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 font-panton">Still Have Questions?</h3>
                    <p className="mb-4 font-calibri">
                      If you have additional questions about the whistleblower process, please contact our Ethics Officer at <strong>ethics@lsf.org</strong> or call <strong>+255 123 456 789</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              Built on Trust & Transparency
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our whistleblower program is independently audited and recognized for its effectiveness.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Independent Oversight</Typography>
              <Typography variant="body" className="text-neutral-gray">
                Our processes are regularly reviewed by independent ethics experts to ensure fairness and effectiveness.
              </Typography>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-secondary-teal/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-secondary-teal" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Trained Investigators</Typography>
              <Typography variant="body" className="text-neutral-gray">
                All investigations are conducted by professionally trained staff with expertise in ethics and compliance.
              </Typography>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-secondary-orange/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-secondary-orange" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Proven Results</Typography>
              <Typography variant="body" className="text-neutral-gray">
                98% of reports lead to positive organizational changes, demonstrating our commitment to continuous improvement.
              </Typography>
            </div>
          </div>
        </Container>
      </section>


    </Layout>
  );
};

export default Whistleblower;
