import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/home/hero/CinematicHero';
import ModernAboutSection from '@/components/home/ModernAboutSection';
import HomeImpactNumbers from '@/components/home/HomeImpactNumbers';
import CompactNewsSection from '@/components/home/CompactNewsSection';
import ImpactStories from '@/components/home/ImpactStories';
import ModernPartnersSection from '@/components/home/ModernPartnersSection';
import ModernCallToAction from '@/components/home/ModernCallToAction';

const Index = () => (
    <Layout>
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

export default Index;
