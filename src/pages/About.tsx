
import Layout from '@/components/layout/Layout';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import LeadershipTeamSection from '@/components/about/LeadershipTeamSection';
import AchievementsTimelineSection from '@/components/about/AchievementsTimelineSection';
import AnimatedStats from '@/components/about/AnimatedStats';
import InteractiveTimeline from '@/components/about/InteractiveTimeline';
import TestimonialCarousel from '@/components/about/TestimonialCarousel';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';

const About = () => {
  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <AboutHero />
      <MissionVisionSection />
      <AnimatedStats />
      <AchievementsTimelineSection />
      <LeadershipTeamSection />
      <InteractiveTimeline />
      <TestimonialCarousel />
    </Layout>
  );
};

export default About;
