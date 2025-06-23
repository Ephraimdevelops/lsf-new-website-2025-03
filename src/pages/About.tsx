
import Layout from '@/components/layout/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import AboutImpactNumbers from '@/components/about/AboutImpactNumbers';
import AboutSuccessStories from '@/components/about/AboutSuccessStories';
import LeadershipTeamSection from '@/components/about/LeadershipTeamSection';
import AchievementsTimelineSection from '@/components/about/AchievementsTimelineSection';
import AnimatedStats from '@/components/about/AnimatedStats';
import InteractiveTimeline from '@/components/about/InteractiveTimeline';
import TestimonialCarousel from '@/components/about/TestimonialCarousel';

const About = () => {
  return (
    <Layout>
      <AboutHero />
      <MissionVisionSection />
      <AboutImpactNumbers />
      <AboutSuccessStories />
      <AchievementsTimelineSection />
      <LeadershipTeamSection />
      <InteractiveTimeline />
      <TestimonialCarousel />
    </Layout>
  );
};

export default About;
