
import Layout from '@/components/layout/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import AboutImpactNumbers from '@/components/about/AboutImpactNumbers';
import GovernanceSection from '@/components/about/GovernanceSection';
import AchievementsTimelineSection from '@/components/about/AchievementsTimelineSection';

const About = () => {
  return (
    <Layout>
      <AboutHero />
      <MissionVisionSection />
      <AchievementsTimelineSection />
      <GovernanceSection />
      <AboutImpactNumbers />
    </Layout>
  );
};

export default About;
