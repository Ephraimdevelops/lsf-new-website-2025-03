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

const ParalegalSignup = () => {
    const logEvent = useMutation(api.analytics.logEvent);

    // =====================================================
    // ANALYTICS: Track paralegal page view on mount
    // =====================================================
    useEffect(() => {
        logEvent({
            type: "paralegal_page_view",
            resourceId: "/paralegal-signup",
            resourceType: "recruitment",
        });
    }, []); // Fire once on mount

    const benefits = [
        { icon: GraduationCap, title: 'Free Training', desc: 'Comprehensive legal aid training program' },
        { icon: Users, title: 'Community Impact', desc: 'Help thousands access justice in your area' },
        { icon: Shield, title: 'Legal Protection', desc: 'Work under LSF\'s legal framework' },
        { icon: Heart, title: 'Support Network', desc: 'Join 500+ paralegals across Tanzania' },
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

            {/* Application Form Section */}
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

                        {/* THE SECURED FORM COMPONENT */}
                        <ParalegalApplicationForm />

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
