
import Layout from '@/components/layout/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import AboutImpactNumbers from '@/components/about/AboutImpactNumbers';
import GovernanceSection from '@/components/about/GovernanceSection';
import AchievementsTimelineSection from '@/components/about/AchievementsTimelineSection';
import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import ImpactInfographic from '@/components/home/ImpactInfographic';

import StrategicTransparency from '@/components/about/StrategicTransparency';
import AboutPartnersSection from '@/components/about/AboutPartnersSection';

const About = () => {
  return (
    <Layout>
      <AboutHero />
      <MissionVisionSection />
      <AchievementsTimelineSection />
      <StrategicTransparency />
      <GovernanceSection />
      <AboutImpactNumbers />
      <AboutPartnersSection />
    </Layout>
  );
};

export default About;
