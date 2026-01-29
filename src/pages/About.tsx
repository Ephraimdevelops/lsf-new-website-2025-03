
import Layout from '@/components/layout/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import AboutImpactNumbers from '@/components/about/AboutImpactNumbers';
import GovernanceSection from '@/components/about/GovernanceSection';
import AchievementsTimelineSection from '@/components/about/AchievementsTimelineSection';
import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';

import StrategicTransparency from '@/components/about/StrategicTransparency';
import AboutPartnersSection from '@/components/about/AboutPartnersSection';
import SEOHead from '@/components/shared/SEOHead';
import ModernPartnersSection from '@/components/home/ModernPartnersSection';

const About = () => {
  return (
    <Layout>
      <SEOHead
        title="About Us"
        description="From grant-maker to direct implementer: LSF's strategic evolution in driving legal empowerment and access to justice in Tanzania."
        canonicalUrl="https://lsftz.org/about"
      />
      <AboutHero />
      <AboutImpactNumbers />
      <AchievementsTimelineSection />
      <MissionVisionSection />
      <StrategicTransparency />
      <GovernanceSection />

      {/* Modern Partners Section */}
      <ModernPartnersSection />
    </Layout>
  );
};

export default About;
