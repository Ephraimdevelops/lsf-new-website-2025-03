
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
import Section from '@/components/shared/Section';

const About = () => {
  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <Section variant="secondary" padding="sm">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </Section>

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
