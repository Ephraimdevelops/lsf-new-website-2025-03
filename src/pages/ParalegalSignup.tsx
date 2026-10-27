import { useCopy } from "@/i18n/useCopy";
import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users, GraduationCap, Heart, Scale, Shield, Phone, Mail
} from 'lucide-react';
import ParalegalApplicationForm from '@/components/ParalegalApplicationForm';
import { useVisitorId } from '@/hooks/useVisitorId';

const ParalegalSignup = () => {
  const c = useCopy();
    const logEvent = useMutation(api.analytics.logEvent);
    const visitorId = useVisitorId();

    // =====================================================
    // ANALYTICS: Track paralegal page view on mount
    // =====================================================
    useEffect(() => {
        logEvent({
            type: "paralegal_page_view",
            resourceId: "/paralegal-signup",
            resourceType: "recruitment",
            visitorId: visitorId,
        });
    }, [logEvent, visitorId]); // Fire once on mount

    const benefits = [
        { icon: GraduationCap, title: 'Learning', desc: 'Complete the training assigned to your role' },
        { icon: Users, title: 'Community Impact', desc: 'Help people find and follow legal support' },
        { icon: Shield, title: 'Verified Access', desc: 'LSF reviews identity and credentials before work access' },
        { icon: Heart, title: 'Support Network', desc: 'Work with a supervised legal aid network' },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-primary via-primary-dark to-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8">
                            <Scale className="h-5 w-5 text-secondary-orange" />
                            <span className="text-sm font-medium">{c("Join Our Network")}</span>
                        </div>

                        <Typography variant="h1" className="text-4xl md:text-6xl font-black mb-6">{c("Become a ")}<span className="text-secondary-orange">{c("Community Paralegal")}</span>
                        </Typography>

                        <Typography variant="body" className="text-xl text-white/80 max-w-2xl mx-auto">{c("Help bridge the justice gap in your community. Apply for LSF review and use one account across the website and mobile app.")}</Typography>
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
                                    <h3 className="font-bold text-lg mb-2">{c(benefit.title)}</h3>
                                    <p className="text-sm text-neutral-600">{c(benefit.desc)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Application Form Section */}
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <Typography variant="h2" className="text-3xl md:text-4xl mb-4">{c("Apply to Become a Paralegal")}</Typography>
                            <Typography variant="body" className="text-neutral-600">{c("Complete the form and attach your verification documents. LSF will review your application and show the decision in your account.")}</Typography>
                        </div>

                        {/* THE SECURED FORM COMPONENT */}
                        <ParalegalApplicationForm />

                    </div>
                </Container>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <Typography variant="h3" className="text-2xl mb-4">{c("Have Questions?")}</Typography>
                        <Typography variant="body" className="text-neutral-600 mb-6">{c("Contact our paralegal recruitment team for more information.")}</Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild variant="outline" className="gap-2"><a href="tel:+255222601534">
                                <Phone className="h-4 w-4" />
                                +255 22 260 1534
                            </a></Button>
                            <Button asChild variant="outline" className="gap-2"><a href="mailto:info@lsftz.org">
                                <Mail className="h-4 w-4" />
                                info@lsftz.org
                            </a></Button>
                        </div>
                    </div>
                </Container>
            </section>
        </Layout>
    );
};

export default ParalegalSignup;
