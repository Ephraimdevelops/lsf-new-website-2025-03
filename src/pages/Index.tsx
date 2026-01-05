import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/home/hero/CinematicHero';
import ModernAboutSection from '@/components/home/ModernAboutSection';
import CompactNewsSection from '@/components/home/CompactNewsSection';
import ImpactStories from '@/components/home/ImpactStories';
import ModernPartnersSection from '@/components/home/ModernPartnersSection';
import ModernCallToAction from '@/components/home/ModernCallToAction';
import HakiYanguDownload from '@/components/haki-yangu/HakiYanguDownload';

// Ensure we're using the correct testimonials component

const Index = () => (
  <Layout>
    {/* Cinematic Hero Section with Apple/Netflix-level storytelling */}
    <CinematicHero />

    {/* Modern About Section with enhanced storytelling */}
    <ModernAboutSection />

    {/* Impact Stories Section */}
    <ImpactStories />

    {/* Compact News & Publications Section */}
    <CompactNewsSection />

    {/* Modern Partners Section */}
    <ModernPartnersSection />

    {/* Simple Haki Yangu Section */}
    <HakiYanguDownload />

    {/* Modern Call-to-Action Section */}
    <ModernCallToAction />
  </Layout>
);

export default Index;