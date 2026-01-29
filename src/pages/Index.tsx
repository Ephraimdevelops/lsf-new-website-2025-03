import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/home/hero/CinematicHero';
import ModernAboutSection from '@/components/home/ModernAboutSection';
import HomeImpactNumbers from '@/components/home/HomeImpactNumbers';
import CompactNewsSection from '@/components/home/CompactNewsSection';
import ImpactStories from '@/components/home/ImpactStories';
import ModernPartnersSection from '@/components/home/ModernPartnersSection';
import ModernCallToAction from '@/components/home/ModernCallToAction';
import SEOHead from '@/components/shared/SEOHead';
import JsonLd from '@/components/shared/JsonLd';

const Index = () => {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Legal Services Facility (LSF)",
        "url": "https://lsftz.org",
        "logo": "https://lsftz.org/lsf-logo.png",
        "description": "Legal Services Facility (LSF) is a non-profit organization striving to increase access to justice for all in Tanzania.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dar es Salaam",
            "addressCountry": "TZ"
        },
        "sameAs": [
            "https://twitter.com/lsftz",
            "https://www.linkedin.com/company/legal-services-facility/"
        ]
    };

    return (
        <Layout>
            <SEOHead
                title="Home"
                description="Legal Services Facility (LSF) - Promoting access to justice and legal empowerment for all in Tanzania."
                canonicalUrl="https://lsftz.org/"
            />
            <JsonLd data={organizationSchema} />
            {/* Cinematic Hero Section */}
            <CinematicHero />

            {/* Modern About Section - With pill badge, gradient text, border accent */}
            <ModernAboutSection />

            {/* Impact Numbers - Full-bleed dramatic section */}
            <HomeImpactNumbers />

            {/* Impact Stories Section */}
            <ImpactStories />

            {/* Compact News & Publications Section */}
            <CompactNewsSection />

            {/* Call-to-Action with Newsletter */}
            <ModernCallToAction />

            {/* Modern Partners Section */}
            <ModernPartnersSection />
        </Layout>
    );
};

export default Index;
