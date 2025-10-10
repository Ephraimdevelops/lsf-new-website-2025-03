import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/home/hero/CinematicHero';
import ModernAboutSection from '@/components/home/ModernAboutSection';
import NetflixStyleCarousel from '@/components/home/NetflixStyleCarousel';
import AppleStyleMetrics from '@/components/home/AppleStyleMetrics';
import EnhancedStorySection from '@/components/home/EnhancedStorySection';
import ModernHakiYanguSection from '@/components/home/ModernHakiYanguSection';
import ModernPartnersSection from '@/components/home/ModernPartnersSection';
import ModernCallToAction from '@/components/home/ModernCallToAction';

const Index = () => (
  <Layout>
    {/* Cinematic Hero Section with Apple/Netflix-level storytelling */}
    <CinematicHero />

    {/* Modern About Section with enhanced storytelling */}
    <ModernAboutSection />

    {/* Enhanced Story Section */}
    <EnhancedStorySection />

    {/* Netflix-style Content Carousel for News & Publications */}
    <NetflixStyleCarousel />

    {/* Apple-style Impact Metrics with data visualization */}
    <AppleStyleMetrics />

    {/* Modern Haki Yangu Section */}
    <ModernHakiYanguSection />

    {/* Modern Partners Section */}
    <ModernPartnersSection />

    {/* Modern Call-to-Action Section */}
    <ModernCallToAction />
  </Layout>
);

export default Index;